export const PUBLIC_BLOG_PAGE_SIZE = 6;

export type BlogMark = {
  type: string;
  attrs?: Record<string, unknown>;
};

export type BlogNode = {
  type?: string;
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: BlogMark[];
  children?: BlogNode[];
  [key: string]: unknown;
};

export type PublicBlogPost = {
  id: number | string;
  title: string;
  slug: string;
  shortDescription: string;
  status: 'PUBLISHED';
  publishedAt: string;
  lastModifiedDate?: string;
  contentSchemaVersion?: 1;
  content?: BlogNode[];
};

export type PublicBlogPage = {
  content: PublicBlogPost[];
  number: number;
  totalElements: number;
  totalPages: number;
};

export class PublicBlogApiError extends Error {
  constructor() {
    super('Public blog service unavailable');
    this.name = 'PublicBlogApiError';
  }
}

export class PublicBlogNotFoundError extends Error {
  constructor() {
    super('Public blog post not found');
    this.name = 'PublicBlogNotFoundError';
  }
}

type Fetcher = typeof fetch;

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function nonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function safeOrigin(value: string) {
  let origin: URL;
  try {
    origin = new URL(value);
  } catch {
    throw new PublicBlogApiError();
  }

  const localHttp =
    origin.protocol === 'http:' &&
    (origin.hostname === 'localhost' || origin.hostname === '127.0.0.1');
  if (
    (origin.protocol !== 'https:' && !localHttp) ||
    origin.username ||
    origin.password ||
    origin.pathname !== '/' ||
    origin.search ||
    origin.hash
  ) {
    throw new PublicBlogApiError();
  }
  return origin;
}

function parseNode(value: unknown): value is BlogNode {
  if (!record(value)) return false;
  if (value.text !== undefined && typeof value.text !== 'string') return false;
  if (value.text === undefined && !nonEmptyString(value.type)) return false;
  if (value.attrs !== undefined && !record(value.attrs)) return false;
  if (value.marks !== undefined && !Array.isArray(value.marks)) return false;
  if (value.children !== undefined && !Array.isArray(value.children)) {
    return false;
  }
  if (
    Array.isArray(value.marks) &&
    !value.marks.every(
      (mark) =>
        record(mark) &&
        nonEmptyString(mark.type) &&
        (mark.attrs === undefined || record(mark.attrs)),
    )
  ) {
    return false;
  }
  return !Array.isArray(value.children) || value.children.every(parseNode);
}

function parsePost(value: unknown, detail = false): PublicBlogPost {
  if (
    !record(value) ||
    (typeof value.id !== 'number' && typeof value.id !== 'string') ||
    !nonEmptyString(value.title) ||
    !nonEmptyString(value.slug) ||
    !nonEmptyString(value.shortDescription) ||
    !nonEmptyString(value.publishedAt)
  ) {
    throw new PublicBlogApiError();
  }

  if (value.status !== 'PUBLISHED') throw new PublicBlogNotFoundError();

  const publishedAt = new Date(value.publishedAt);
  if (Number.isNaN(publishedAt.valueOf())) throw new PublicBlogApiError();
  const lastModifiedDate =
    typeof value.lastModifiedDate === 'string' &&
    !Number.isNaN(new Date(value.lastModifiedDate).valueOf())
      ? value.lastModifiedDate
      : undefined;

  if (detail) {
    if (
      value.contentSchemaVersion !== 1 ||
      !Array.isArray(value.content) ||
      !value.content.every(parseNode)
    ) {
      throw new PublicBlogApiError();
    }
  }

  return {
    id: value.id,
    title: value.title,
    slug: value.slug,
    shortDescription: value.shortDescription,
    status: 'PUBLISHED',
    publishedAt: value.publishedAt,
    lastModifiedDate,
    ...(detail
      ? {
          contentSchemaVersion: 1 as const,
          content: value.content as BlogNode[],
        }
      : {}),
  };
}

async function getJson(originValue: string, path: string, fetcher: Fetcher) {
  const origin = safeOrigin(originValue);
  const url = new URL(path, origin);
  let response: Response;
  try {
    response = await fetcher(url, {
      headers: { accept: 'application/json' },
      cache: 'no-store',
      signal: AbortSignal.timeout(8_000),
    });
  } catch {
    throw new PublicBlogApiError();
  }

  if (response.status === 404) throw new PublicBlogNotFoundError();
  if (!response.ok) throw new PublicBlogApiError();
  try {
    return await response.json();
  } catch {
    throw new PublicBlogApiError();
  }
}

export async function getPublicBlogPage(
  origin: string,
  page: number,
  fetcher: Fetcher = fetch,
): Promise<PublicBlogPage> {
  const query = new URLSearchParams({
    page: String(Math.max(0, Math.floor(page))),
    size: String(PUBLIC_BLOG_PAGE_SIZE),
  });
  const result = await getJson(
    origin,
    `/blogs/public?${query.toString()}`,
    fetcher,
  );

  if (
    !record(result) ||
    !Array.isArray(result.content) ||
    typeof result.number !== 'number' ||
    !Number.isSafeInteger(result.number) ||
    result.number < 0 ||
    typeof result.totalElements !== 'number' ||
    !Number.isSafeInteger(result.totalElements) ||
    result.totalElements < 0 ||
    typeof result.totalPages !== 'number' ||
    !Number.isSafeInteger(result.totalPages) ||
    result.totalPages < 0
  ) {
    throw new PublicBlogApiError();
  }

  return {
    content: result.content.map((post) => parsePost(post)),
    number: result.number,
    totalElements: result.totalElements,
    totalPages: result.totalPages,
  };
}

export async function getPublicBlogPost(
  origin: string,
  slug: string,
  fetcher: Fetcher = fetch,
): Promise<PublicBlogPost> {
  const result = await getJson(
    origin,
    `/blogs/public/${encodeURIComponent(slug)}`,
    fetcher,
  );
  return parsePost(result, true);
}
