import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { test } from 'node:test';

import {
  getPublicGuideEntries,
  getPublicGuideGroups,
  getPublicGuidePaths,
  guideHref,
} from '../../src/lib/user-guides.ts';

const articleIds = [
  'ug01',
  'ug02',
  'ug03',
  'ug04',
  'ug05',
  'ug06',
  'ug07',
  'ug08',
  'ug09',
  'ug10',
];
const draftedArticleIds = [
  'ug01',
  'ug02',
  'ug03',
  'ug04',
  'ug05',
  'ug06',
  'ug10',
];
const sourceRevisions = {
  ug01: 'ccf32983b8e984e3bac3855811e0e188c21914b8',
  ug02: 'ccf32983b8e984e3bac3855811e0e188c21914b8',
  ug03: 'ccf32983b8e984e3bac3855811e0e188c21914b8',
  ug04: 'e734b0cdd39d1551724636487ab68eca7690da57',
  ug05: 'e734b0cdd39d1551724636487ab68eca7690da57',
  ug06: 'e734b0cdd39d1551724636487ab68eca7690da57',
  ug10: 'ccf32983b8e984e3bac3855811e0e188c21914b8',
};

function makeEntries() {
  return articleIds.flatMap((articleId) =>
    ['vi', 'en'].map((locale) => ({
      id: `${articleId}.${locale}`,
      data: {
        articleId,
        locale,
        title: `${articleId} ${locale}`,
        sourceRevision: sourceRevisions[articleId] ?? sourceRevisions.ug01,
        approvalStatus: 'approved',
        approvalReference: 'SIGN-170 release approval',
      },
    })),
  );
}

test('publishes the complete approved VI/EN batch in the four group order', () => {
  const entries = makeEntries();
  const published = getPublicGuideEntries(entries);

  assert.equal(published.length, 20);
  assert.equal(published[0].data.articleId, 'ug01');
  assert.equal(published[0].data.locale, 'vi');
  assert.equal(published[6].data.articleId, 'ug10');
  assert.equal(published[8].data.articleId, 'ug04');
  assert.equal(published.at(-1).data.articleId, 'ug09');

  const groups = getPublicGuideGroups(entries, 'en');
  assert.deepEqual(
    groups.map(({ id, articles }) => [
      id,
      articles.map(({ data }) => data.articleId),
    ]),
    [
      ['getting-started', ['ug01', 'ug02', 'ug03', 'ug10']],
      ['market', ['ug04', 'ug05', 'ug06']],
      ['ai', ['ug07']],
      ['troubleshooting', ['ug08', 'ug09']],
    ],
  );

  const paths = getPublicGuidePaths(entries);
  assert.equal(paths.length, 20);
  assert.deepEqual(paths[0].params, { lang: 'vi', articleId: 'ug01' });
  assert.deepEqual(paths[1].params, { lang: 'en', articleId: 'ug01' });
});

test('keeps seven drafted guides private instead of publishing them as a partial batch', () => {
  const sevenGuides = makeEntries().filter(({ data }) =>
    draftedArticleIds.includes(data.articleId),
  );

  assert.deepEqual(getPublicGuideEntries(sevenGuides), []);
  assert.deepEqual(
    getPublicGuideGroups(sevenGuides, 'vi').map(({ articles }) => articles),
    [[], [], [], []],
  );
  assert.deepEqual(getPublicGuidePaths(sevenGuides), []);
  assert.equal(guideHref('vi', 'ug01'), '/vi/docs/ug01');
  assert.equal(guideHref('en', 'ug01'), '/en/docs/ug01');
  assert.equal(guideHref('vi', 'ug04'), '/vi/docs/ug04');
  assert.equal(guideHref('en', 'ug06'), '/en/docs/ug06');
});

test('requires exactly one approved VI and EN version of every guide', () => {
  const complete = makeEntries();
  const missingLocale = complete.slice(1);
  const withDraft = complete.map((entry) => ({ ...entry }));
  withDraft[0] = {
    ...withDraft[0],
    data: { ...withDraft[0].data, approvalStatus: 'draft' },
  };
  const withoutApprovalRecord = complete.map((entry) => ({ ...entry }));
  withoutApprovalRecord[0] = {
    ...withoutApprovalRecord[0],
    data: { ...withoutApprovalRecord[0].data, approvalReference: '' },
  };
  const duplicate = [...complete, complete[0]];
  const mixedApprovalReferences = complete.map((entry, index) =>
    index === 1
      ? {
          ...entry,
          data: { ...entry.data, approvalReference: 'another release' },
        }
      : entry,
  );
  const unknownArticle = complete.map((entry, index) =>
    index === 0
      ? { ...entry, data: { ...entry.data, articleId: 'ug11' } }
      : entry,
  );

  for (const candidate of [
    missingLocale,
    withDraft,
    withoutApprovalRecord,
    duplicate,
    mixedApprovalReferences,
    unknownArticle,
  ]) {
    assert.deepEqual(getPublicGuideEntries(candidate), []);
    assert.deepEqual(getPublicGuidePaths(candidate), []);
  }
});

test('keeps imported VI/EN pairs aligned, linked to the right locale, and marked draft', async () => {
  const directory = new URL('../../src/content/user-guides/', import.meta.url);
  const files = await readdir(directory);

  assert.equal(files.length, draftedArticleIds.length * 2);

  for (const articleId of draftedArticleIds) {
    const translations = await Promise.all(
      ['vi', 'en'].map(async (locale) => {
        const markdown = await readFile(
          new URL(`${articleId}.${locale}.md`, directory),
          'utf8',
        );
        const [, frontmatter, body] = markdown.split(/^---\s*$/m);
        assert.match(frontmatter, new RegExp(`^articleId: ${articleId}$`, 'm'));
        assert.match(frontmatter, new RegExp(`^locale: ${locale}$`, 'm'));
        assert.match(
          frontmatter,
          new RegExp(`^sourceRevision: ${sourceRevisions[articleId]}$`, 'm'),
        );
        assert.match(frontmatter, /^approvalStatus: draft$/m);
        assert.match(frontmatter, /^approvalReference: (?:''|"")$/m);

        const headingShape = [...body.matchAll(/^(#{2,3}) /gm)].reduce(
          (shape, heading) => {
            const level = heading[1].length;
            shape[level] = (shape[level] ?? 0) + 1;
            return shape;
          },
          {},
        );
        for (const match of body.matchAll(/\]\((\/[^)]+)\)/g)) {
          assert.match(
            match[1],
            new RegExp(`^/${locale}/docs/ug\\d{2}(?:#.*)?$`),
          );
        }
        return headingShape;
      }),
    );

    assert.deepEqual(translations[0], translations[1], `${articleId} headings`);
  }
});
