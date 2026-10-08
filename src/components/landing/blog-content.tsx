import katex from 'katex';
import type { ReactNode } from 'react';

import type { BlogNode, PublicBlogPost } from '@/lib/public-blog-api';
import styles from './public-blog.module.css';
import 'katex/dist/katex.min.css';

type Locale = 'vi' | 'en';
const blogListStyles = [
  'disc',
  'circle',
  'square',
  'decimal',
  'lower-alpha',
  'upper-alpha',
  'lower-roman',
  'upper-roman',
  'todo',
] as const;
type BlogListStyle = (typeof blogListStyles)[number];

function isBlogListStyle(value: unknown): value is BlogListStyle {
  return (
    typeof value === 'string' &&
    (blogListStyles as readonly string[]).includes(value)
  );
}

function attribute(node: BlogNode, name: string): unknown {
  return node.attrs?.[name] ?? node[name];
}

function listIndent(node: BlogNode) {
  const value = Number(attribute(node, 'indent'));
  return Number.isSafeInteger(value) ? Math.min(Math.max(value, 0), 6) : 0;
}

function children(node: BlogNode) {
  return Array.isArray(node.children) ? node.children : [];
}

function textValue(node: BlogNode): string {
  if (typeof node.text === 'string') return node.text;
  return children(node).map(textValue).join('');
}

function safeLink(value: unknown) {
  if (typeof value !== 'string') return undefined;
  if (value.startsWith('/') && !value.startsWith('//')) return value;
  try {
    const url = new URL(value);
    if (
      (url.protocol === 'https:' || url.protocol === 'http:') &&
      !url.username &&
      !url.password
    ) {
      return url.href;
    }
  } catch {
    return undefined;
  }
  return undefined;
}

function safeImage(value: unknown) {
  if (typeof value !== 'string') return undefined;
  try {
    const url = new URL(value);
    if (url.protocol === 'https:' && !url.username && !url.password) {
      return url.href;
    }
  } catch {
    return undefined;
  }
  return undefined;
}

function safeColor(value: unknown) {
  if (
    typeof value === 'string' &&
    /^(#[\da-f]{3,8}|(?:rgb|hsl)a?\([\d.% ,/]+\))$/i.test(value)
  ) {
    return value;
  }
  return undefined;
}

function textMarks(node: BlogNode): Set<string> {
  const marks = new Set<string>();
  for (const mark of Array.isArray(node.marks) ? node.marks : []) {
    marks.add(mark.type);
  }
  for (const name of [
    'bold',
    'italic',
    'underline',
    'strikethrough',
    'code',
    'superscript',
    'subscript',
    'highlight',
  ]) {
    if (node[name] === true) marks.add(name);
  }
  return marks;
}

function renderInline(
  node: BlogNode,
  key: string | number,
  headings: ReturnType<typeof headingRecords>,
  locale: Locale,
): ReactNode {
  if (typeof node.text === 'string') {
    let value: ReactNode = node.text;
    const marks = textMarks(node);
    const linkMark = (node.marks ?? []).find((mark) => mark.type === 'link');
    const href = safeLink(linkMark?.attrs?.href ?? node.href);
    if (href) {
      const external = /^https?:/.test(href);
      value = (
        <a
          key={`${key}-link`}
          href={href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
        >
          {value}
        </a>
      );
    }
    if (marks.has('bold')) value = <strong key={`${key}-bold`}>{value}</strong>;
    if (marks.has('italic')) value = <em key={`${key}-italic`}>{value}</em>;
    if (marks.has('underline')) value = <u key={`${key}-underline`}>{value}</u>;
    if (marks.has('strikethrough'))
      value = <s key={`${key}-strike`}>{value}</s>;
    if (marks.has('code')) value = <code key={`${key}-code`}>{value}</code>;
    if (marks.has('superscript')) value = <sup key={`${key}-sup`}>{value}</sup>;
    if (marks.has('subscript')) value = <sub key={`${key}-sub`}>{value}</sub>;
    if (marks.has('highlight')) {
      value = <mark key={`${key}-highlight`}>{value}</mark>;
    }
    return value;
  }
  return renderNode(node, key, headings, locale);
}

function headingRecords(nodes: BlogNode[]) {
  const used = new Map<string, number>();
  return nodes.flatMap((node) => {
    if (!/^h[1-6]$/.test(node.type ?? '')) return [];
    const base =
      textValue(node)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || 'section';
    const count = (used.get(base) ?? 0) + 1;
    used.set(base, count);
    return [
      {
        id: count === 1 ? base : `${base}-${count}`,
        label: textValue(node),
        nodeId: node.id,
      },
    ];
  });
}

function safeHeadingId(value: string) {
  return `blog-${value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')}`;
}

function dateLabel(value: unknown, locale: Locale) {
  if (typeof value !== 'string') return null;
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return null;
  return new Intl.DateTimeFormat(locale === 'vi' ? 'vi-VN' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

function renderNode(
  node: BlogNode,
  key: string | number,
  headings: ReturnType<typeof headingRecords>,
  locale: Locale = 'vi',
): ReactNode {
  const type = node.type ?? '';
  const kids = children(node).map((child, index) =>
    renderInline(child, `${key}-${index}`, headings, locale),
  );
  const heading = /^h[1-6]$/.test(type)
    ? headings.find((item) => item.nodeId === node.id)
    : undefined;
  const headingId = heading ? safeHeadingId(heading.id) : undefined;

  if (type === 'p') {
    const align = attribute(node, 'align');
    const textAlign = ['left', 'center', 'right', 'justify'].includes(
      String(align),
    )
      ? (align as 'left' | 'center' | 'right' | 'justify')
      : undefined;
    const indent = Number(attribute(node, 'indent'));
    return (
      <p
        key={key}
        className={styles.blogParagraph}
        style={{
          textAlign,
          paddingInlineStart:
            Number.isFinite(indent) && indent > 0
              ? `${Math.min(indent, 6) * 1.25}rem`
              : undefined,
        }}
      >
        {kids}
      </p>
    );
  }
  if (/^h[1-6]$/.test(type)) {
    const Tag = type as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    return (
      <Tag key={key} id={headingId} className={styles.blogContentHeading}>
        {kids}
      </Tag>
    );
  }
  if (type === 'blockquote') {
    return (
      <blockquote key={key} className={styles.blogBlockquote}>
        {kids}
      </blockquote>
    );
  }
  if (type === 'hr') return <hr key={key} className={styles.blogRule} />;
  if (type === 'ul' || type === 'ol') {
    const Tag = type;
    const style = attribute(node, 'listStyleType');
    const listStyle = isBlogListStyle(style)
      ? style
      : type === 'ol'
        ? 'decimal'
        : 'disc';
    const indent = listIndent(node);
    const listStart = Number(attribute(node, 'listStart'));
    return (
      <Tag
        key={key}
        className={styles.blogList}
        start={
          type === 'ol' && Number.isSafeInteger(listStart)
            ? listStart
            : undefined
        }
        style={{
          listStyleType: listStyle === 'todo' ? 'none' : listStyle,
          marginInlineStart:
            indent > 1 ? `${(indent - 1) * 1.5}rem` : undefined,
        }}
      >
        {kids}
      </Tag>
    );
  }
  if (type === 'li') {
    const checked = attribute(node, 'checked');
    return (
      <li key={key}>
        {typeof checked === 'boolean' && (
          <input
            className={styles.blogTodoCheckbox}
            type="checkbox"
            disabled
            checked={checked}
            aria-label={textValue(node).trim() || 'Task'}
          />
        )}
        {kids}
      </li>
    );
  }
  if (type === 'code_block') {
    const lines = children(node);
    const code = lines.length
      ? lines.map(textValue).join('\n')
      : textValue(node);
    return (
      <pre key={key} className={styles.blogCodeBlock}>
        <code>{code}</code>
      </pre>
    );
  }
  if (type === 'code_line') return <span key={key}>{kids}</span>;
  if (type === 'a' || type === 'link') {
    const href = safeLink(attribute(node, 'href') ?? attribute(node, 'url'));
    return href ? (
      <a
        key={key}
        href={href}
        target={/^https?:/.test(href) ? '_blank' : undefined}
        rel={/^https?:/.test(href) ? 'noopener noreferrer' : undefined}
      >
        {kids}
      </a>
    ) : (
      <>{kids}</>
    );
  }
  if (type === 'img') {
    const src = safeImage(attribute(node, 'src') ?? attribute(node, 'url'));
    const alt =
      typeof attribute(node, 'alt') === 'string'
        ? String(attribute(node, 'alt'))
        : '';
    const caption = attribute(node, 'caption');
    return src ? (
      <figure key={key} className={styles.blogFigure}>
        <img src={src} alt={alt} loading="lazy" />
        {typeof caption === 'string' && caption && (
          <figcaption>{caption}</figcaption>
        )}
      </figure>
    ) : (
      <div
        key={key}
        className={styles.blogImageFallback}
        role="img"
        aria-label={alt}
      >
        {alt || (locale === 'vi' ? 'Ảnh không khả dụng' : 'Image unavailable')}
      </div>
    );
  }
  if (type === 'table') {
    return (
      <div key={key} className={styles.blogTableScroll}>
        <table className={styles.blogTable}>{kids}</table>
      </div>
    );
  }
  if (type === 'tr') return <tr key={key}>{kids}</tr>;
  if (type === 'td') return <td key={key}>{kids}</td>;
  if (type === 'column_group') {
    return (
      <div key={key} className={styles.blogColumns}>
        {kids}
      </div>
    );
  }
  if (type === 'column') {
    const width = Number(attribute(node, 'width'));
    return (
      <div
        key={key}
        className={styles.blogColumn}
        style={{
          flexBasis: Number.isFinite(width)
            ? `${Math.min(Math.max(width, 20), 100)}%`
            : undefined,
        }}
      >
        {kids}
      </div>
    );
  }
  if (type === 'callout') {
    const color = safeColor(attribute(node, 'backgroundColor'));
    const icon = attribute(node, 'icon');
    return (
      <aside
        key={key}
        className={styles.blogCallout}
        style={color ? { backgroundColor: color } : undefined}
      >
        {typeof icon === 'string' && <span aria-hidden="true">{icon}</span>}
        <div>{kids}</div>
      </aside>
    );
  }
  if (type === 'toggle') {
    const summary = attribute(node, 'summary') ?? attribute(node, 'title');
    return (
      <details key={key} className={styles.blogToggle}>
        <summary>{typeof summary === 'string' ? summary : 'Details'}</summary>
        {kids}
      </details>
    );
  }
  if (type === 'toc') {
    return (
      <nav
        key={key}
        className={styles.blogToc}
        aria-label={locale === 'vi' ? 'Mục lục bài viết' : 'Table of contents'}
      >
        <p>{locale === 'vi' ? 'Trong bài viết' : 'In this article'}</p>
        <ol>
          {headings.map((heading) => (
            <li key={heading.id}>
              <a href={`#${safeHeadingId(heading.id)}`}>{heading.label}</a>
            </li>
          ))}
        </ol>
      </nav>
    );
  }
  if (type === 'equation') {
    const source = textValue(node) || String(attribute(node, 'value') ?? '');
    const html = katex.renderToString(source, {
      displayMode: attribute(node, 'displayMode') !== false,
      output: 'htmlAndMathml',
      throwOnError: false,
      trust: false,
    });
    return (
      <div
        key={key}
        className={styles.blogEquation}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
  if (type === 'date') {
    const date = dateLabel(
      attribute(node, 'date') ?? attribute(node, 'rawDate'),
      locale,
    );
    return date ? (
      <time key={key} className={styles.blogInlineObject}>
        {date}
      </time>
    ) : null;
  }
  if (type === 'mention' || type === 'mention_input') {
    const value = attribute(node, 'value') ?? attribute(node, 'label');
    return (
      <span key={key} className={styles.blogInlineObject}>
        {typeof value === 'string' ? value : ''}
      </span>
    );
  }
  return <span key={key}>{kids}</span>;
}

function renderBlocks(nodes: BlogNode[], locale: Locale) {
  const headings = headingRecords(nodes);
  let headingIndex = 0;
  const rendered: ReactNode[] = [];
  for (let index = 0; index < nodes.length; index += 1) {
    const node = nodes[index];
    if (!node) continue;
    const style = attribute(node, 'listStyleType');
    if (node.type === 'p' && isBlogListStyle(style)) {
      const indent = listIndent(node);
      const group: BlogNode[] = [];
      while (
        index < nodes.length &&
        nodes[index]?.type === 'p' &&
        attribute(nodes[index]!, 'listStyleType') === style &&
        listIndent(nodes[index]!) === indent
      ) {
        group.push(nodes[index]!);
        index += 1;
      }
      index -= 1;
      const ordered = [
        'decimal',
        'lower-alpha',
        'upper-alpha',
        'lower-roman',
        'upper-roman',
      ].includes(style);
      const Tag = ordered ? 'ol' : 'ul';
      const listStart = Number(attribute(group[0] ?? node, 'listStart'));
      const start = Number.isSafeInteger(listStart) ? listStart : undefined;
      rendered.push(
        <Tag
          key={`list-${index}`}
          className={styles.blogList}
          start={ordered ? start : undefined}
          style={{
            listStyleType: style === 'todo' ? 'none' : style,
            marginInlineStart:
              indent > 1 ? `${(indent - 1) * 1.5}rem` : undefined,
          }}
        >
          {group.map((item, itemIndex) => (
            <li key={item.id?.toString() ?? itemIndex}>
              {style === 'todo' && (
                <input
                  className={styles.blogTodoCheckbox}
                  type="checkbox"
                  disabled
                  checked={attribute(item, 'checked') === true}
                  aria-label={textValue(item).trim() || 'Task'}
                />
              )}
              {children(item).map((child, childIndex) =>
                renderInline(
                  child,
                  `${index}-${itemIndex}-${childIndex}`,
                  headings,
                  locale,
                ),
              )}
            </li>
          ))}
        </Tag>,
      );
      continue;
    }
    const renderedNode = renderNode(
      node,
      node.id?.toString() ?? index,
      headings,
      locale,
    );
    if (/^h[1-6]$/.test(node.type ?? '')) {
      const heading = headings[headingIndex];
      headingIndex += 1;
      if (heading) {
        const Tag = node.type as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
        rendered.push(
          <Tag
            key={heading.id}
            id={safeHeadingId(heading.id)}
            className={styles.blogContentHeading}
          >
            {children(node).map((child, childIndex) =>
              renderInline(
                child,
                `${heading.id}-${childIndex}`,
                headings,
                locale,
              ),
            )}
          </Tag>,
        );
      } else {
        rendered.push(renderedNode);
      }
    } else {
      rendered.push(renderedNode);
    }
  }
  return rendered;
}

export function BlogContent({
  post,
  locale,
}: {
  post: PublicBlogPost;
  locale: Locale;
}) {
  const content = [...(post.content ?? [])];
  const titleHeadingIndex = content.findIndex(
    (node) =>
      node.type === 'h1' && textValue(node).trim() === post.title.trim(),
  );
  if (titleHeadingIndex >= 0) content.splice(titleHeadingIndex, 1);
  return (
    <div className={styles.blogContent}>{renderBlocks(content, locale)}</div>
  );
}
