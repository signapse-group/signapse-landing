'use client';

import {
  BookOpenIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CircleHelpIcon,
  LifeBuoyIcon,
  MessageCircleIcon,
} from 'lucide-react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';

import { withLocalePath } from '@/i18n/routing';
import type { Dictionary } from '@/i18n/messages';
import type { Locale } from '@/i18n/config';
import type { GuideGroupId, UserGuideMenuGroup } from '@/lib/user-guides';
import styles from './landing-docs-navigation.module.css';
import landingStyles from './landing-page.module.css';

const groupIcons = {
  'getting-started': BookOpenIcon,
  market: CircleHelpIcon,
  ai: MessageCircleIcon,
  troubleshooting: LifeBuoyIcon,
} satisfies Record<GuideGroupId, typeof BookOpenIcon>;

export function LandingDocsNavigation({
  dictionary,
  guideGroups,
  locale,
  currentPath,
  compact = false,
}: {
  dictionary: Dictionary;
  guideGroups: UserGuideMenuGroup[];
  locale: Locale;
  currentPath?: string;
  compact?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const t = dictionary.landing;
  const copy = t.documentation;
  const documentationHref = withLocalePath('/docs', locale);

  const clearCloseTimeout = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    function closeOnOutsidePointer(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener('pointerdown', closeOnOutsidePointer);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePointer);
      clearCloseTimeout();
    };
  }, [clearCloseTimeout]);

  return (
    <div
      ref={rootRef}
      className={`${styles.docsNavigation} ${compact ? styles.compact : ''}`}
      data-docs-navigation
      onPointerEnter={(event) => {
        if (event.pointerType !== 'mouse') return;
        clearCloseTimeout();
        setOpen(true);
      }}
      onPointerLeave={(event) => {
        if (
          event.pointerType !== 'mouse' ||
          rootRef.current?.contains(document.activeElement)
        ) {
          return;
        }
        clearCloseTimeout();
        timeoutRef.current = setTimeout(() => {
          setOpen(false);
          timeoutRef.current = null;
        }, 250);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          event.preventDefault();
          setOpen(false);
          triggerRef.current?.focus();
        }
      }}
    >
      <a
        href={documentationHref}
        className={
          compact ? landingStyles.headerMenuItem : landingStyles.headerNavItem
        }
        aria-current={
          currentPath === documentationHref ||
          currentPath?.startsWith(`${documentationHref}/`)
            ? 'page'
            : undefined
        }
      >
        {t.nav.docs}
      </a>
      <button
        ref={triggerRef}
        type="button"
        className={`${styles.docsTrigger} ${compact ? styles.compactTrigger : ''}`}
        aria-label={open ? copy.menuClose : copy.menuOpen}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          clearCloseTimeout();
          setOpen((value) => !value);
        }}
      >
        <ChevronDownIcon
          aria-hidden="true"
          className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
        />
      </button>
      <div
        id={panelId}
        className={styles.docsPanel}
        role="region"
        aria-label={copy.contentsLabel}
        hidden={!open}
        data-docs-menu-panel
      >
        {guideGroups.some((group) => group.articles.length > 0) ? (
          <div className={styles.docsGroups}>
            {guideGroups.map((group) => {
              if (group.articles.length === 0) return null;
              const GroupIcon = groupIcons[group.id];

              return (
                <section key={group.id} className={styles.docsGroup}>
                  <h2 className={styles.docsGroupTitle}>
                    <GroupIcon
                      aria-hidden="true"
                      className={styles.groupIcon}
                    />
                    <span>{copy.groups[group.id]}</span>
                  </h2>
                  <ul className={styles.docsLinks}>
                    {group.articles.map((article) => {
                      const href = withLocalePath(
                        `/docs/${article.articleId}`,
                        locale,
                      );

                      return (
                        <li key={article.articleId}>
                          <a
                            href={href}
                            className={styles.docsLink}
                            aria-current={
                              currentPath === href ? 'page' : undefined
                            }
                          >
                            <span>{article.title}</span>
                            <ChevronRightIcon
                              aria-hidden="true"
                              className={styles.linkIcon}
                            />
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })}
          </div>
        ) : (
          <p className={styles.docsEmpty}>{copy.emptyMessage}</p>
        )}
      </div>
    </div>
  );
}
