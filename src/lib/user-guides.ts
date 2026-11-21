import { SUPPORTED_LOCALES, type Locale } from '../i18n/config.ts';
import { withLocalePath } from '../i18n/routing.ts';

export const GUIDE_GROUPS = [
  {
    id: 'getting-started',
    articleIds: ['ug01', 'ug02', 'ug03', 'ug10'],
  },
  { id: 'market', articleIds: ['ug04', 'ug05', 'ug06'] },
  { id: 'ai', articleIds: ['ug07'] },
  { id: 'troubleshooting', articleIds: ['ug08', 'ug09'] },
] as const;

export type GuideGroupId = (typeof GUIDE_GROUPS)[number]['id'];
export type GuideId = (typeof GUIDE_GROUPS)[number]['articleIds'][number];

export interface UserGuideData {
  articleId: GuideId;
  locale: Locale;
  title: string;
  sourceRevision: string;
  approvalStatus: 'draft' | 'approved';
  approvalReference: string;
}

export interface UserGuideEntry {
  id: string;
  data: UserGuideData;
}

export interface UserGuideGroup<T extends UserGuideEntry = UserGuideEntry> {
  id: GuideGroupId;
  articles: T[];
}

export interface UserGuideLink {
  articleId: GuideId;
  title: string;
}

export interface UserGuideMenuGroup {
  id: GuideGroupId;
  articles: UserGuideLink[];
}

const expectedKeys = GUIDE_GROUPS.flatMap(({ articleIds }) =>
  articleIds.flatMap((articleId) =>
    SUPPORTED_LOCALES.map((locale) => `${articleId}:${locale}`),
  ),
);

export function getPublicGuideEntries<T extends UserGuideEntry>(
  entries: readonly T[],
) {
  if (entries.length !== expectedKeys.length) return [];

  const byKey = new Map<string, T>();
  let approvalReference: string | undefined;

  for (const entry of entries) {
    const { articleId, locale, approvalStatus } = entry.data;
    const reference = entry.data.approvalReference.trim();
    const key = `${articleId}:${locale}`;

    if (
      !expectedKeys.includes(key) ||
      approvalStatus !== 'approved' ||
      !reference ||
      byKey.has(key) ||
      (approvalReference !== undefined && approvalReference !== reference)
    ) {
      return [];
    }

    approvalReference = reference;
    byKey.set(key, entry);
  }

  if (byKey.size !== expectedKeys.length) return [];

  return GUIDE_GROUPS.flatMap(({ articleIds }) =>
    articleIds.flatMap((articleId) =>
      SUPPORTED_LOCALES.map((locale) => byKey.get(`${articleId}:${locale}`)!),
    ),
  );
}

export function getPublicGuideGroups<T extends UserGuideEntry>(
  entries: readonly T[],
  locale: Locale,
): UserGuideGroup<T>[] {
  const byId = new Map(
    getPublicGuideEntries(entries)
      .filter((entry) => entry.data.locale === locale)
      .map((entry) => [entry.data.articleId, entry]),
  );

  return GUIDE_GROUPS.map(({ id, articleIds }) => ({
    id,
    articles: articleIds
      .map((articleId) => byId.get(articleId))
      .filter((entry): entry is T => entry !== undefined),
  }));
}

export function getPublicGuideMenu<T extends UserGuideEntry>(
  entries: readonly T[],
  locale: Locale,
): UserGuideMenuGroup[] {
  return getPublicGuideGroups(entries, locale).map(({ id, articles }) => ({
    id,
    articles: articles.map(({ data }) => ({
      articleId: data.articleId,
      title: data.title,
    })),
  }));
}

export function getPublicGuidePaths<T extends UserGuideEntry>(
  entries: readonly T[],
) {
  return getPublicGuideEntries(entries).map((guide) => ({
    params: {
      lang: guide.data.locale,
      articleId: guide.data.articleId,
    },
    props: { guide },
  }));
}

export function guideHref(locale: Locale, articleId: GuideId) {
  return withLocalePath(`/docs/${articleId}`, locale);
}
