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
const sourceRevision = 'b1915e0c96e7e758326942dc081b1b9adc6574c0';

function makeEntries() {
  return articleIds.flatMap((articleId) =>
    ['vi', 'en'].map((locale) => ({
      id: `${articleId}.${locale}`,
      data: {
        articleId,
        locale,
        title: `${articleId} ${locale}`,
        sourceRevision,
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

test('keeps every drafted guide private instead of publishing a partial batch', () => {
  const draftGuides = makeEntries().map((entry) => ({
    ...entry,
    data: { ...entry.data, approvalStatus: 'draft', approvalReference: '' },
  }));

  assert.deepEqual(getPublicGuideEntries(draftGuides), []);
  assert.deepEqual(
    getPublicGuideGroups(draftGuides, 'vi').map(({ articles }) => articles),
    [[], [], [], []],
  );
  assert.deepEqual(getPublicGuidePaths(draftGuides), []);
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

test('keeps imported VI/EN pairs aligned, linked to the right locale, and approved as one batch', async () => {
  const directory = new URL('../../src/content/user-guides/', import.meta.url);
  const files = await readdir(directory);
  const existingGuideFiles = files.filter((file) =>
    articleIds.some((articleId) => file.startsWith(`${articleId}.`)),
  );

  assert.equal(existingGuideFiles.length, articleIds.length * 2);

  for (const articleId of articleIds) {
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
          new RegExp(`^sourceRevision: ${sourceRevision}$`, 'm'),
        );
        assert.match(frontmatter, /^approvalStatus: approved$/m);
        assert.match(
          frontmatter,
          /^approvalReference: 'SIGN-170: coordinator 2026-11-16'$/m,
        );

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
        if (articleId === 'ug07') {
          const condition =
            locale === 'vi'
              ? 'Nếu phiên bản ứng dụng bạn đang sử dụng hỗ trợ lịch sử hội thoại và workspace hiện tại có hội thoại đã lưu, bạn có thể tìm và mở lại hội thoại như sau.'
              : 'If the app version you are using supports conversation history and your current workspace has saved conversations, you can find and reopen one as follows.';
          const instruction =
            locale === 'vi'
              ? 'Mở **Lịch sử hội thoại**'
              : 'Open **Conversation history**';
          const conditionIndex = body.indexOf(condition);
          const instructionIndex = body.indexOf(instruction);

          assert.notEqual(conditionIndex, -1);
          assert.notEqual(instructionIndex, -1);
          assert.ok(conditionIndex < instructionIndex);
          assert.match(
            body.slice(conditionIndex + condition.length, instructionIndex),
            /^\s*$/,
          );
        }
        return headingShape;
      }),
    );

    assert.deepEqual(translations[0], translations[1], `${articleId} headings`);
  }
});

test('imports UG08 and UG09 as localized guides with source-aligned structure', async () => {
  const directory = new URL('../../src/content/user-guides/', import.meta.url);
  const titles = {
    ug08: {
      vi: 'Không thấy dữ liệu hoặc tính năng',
      en: 'Missing data or features',
    },
    ug09: {
      vi: 'Thuật ngữ và trạng thái dữ liệu',
      en: 'Glossary and data states',
    },
  };
  const requiredCopy = {
    'ug08.vi': [
      'Không thấy menu hoặc không dùng được thao tác',
      'Mở được trang nhưng dữ liệu trống hoặc thiếu',
      'Giao diện báo lỗi tải hoặc lưu',
      'người đã cấp quyền',
      'không gửi mật khẩu, token bot Telegram hoặc khóa truy cập',
      'che thông tin riêng tư',
    ],
    'ug08.en': [
      'A menu item is missing or an action is unavailable',
      'The page opens, but data is empty or incomplete',
      'The interface reports a loading or saving error',
      'the person who granted you access',
      'do not send passwords, Telegram bot tokens, or access keys',
      'hide unnecessary private information',
    ],
    'ug09.vi': [
      'Asset — Tài sản',
      'Workspace — Không gian làm việc',
      'Watchlist — Danh sách tài sản theo dõi',
      'News Article — Bài viết tin tức',
      'Event — Sự kiện',
      'Theme — Chủ đề',
      'Market Reaction — Phản ứng / Tác động thị trường',
      'Narrative — Luận điểm thị trường',
      'Evidence — Bằng chứng',
      'Provenance — Khả năng truy nguồn',
      'Múi giờ / UTC',
      'Số 0',
      'Không có quyền',
      'Không thể tải',
      'Token bot',
      'Điểm nhận',
      'Định tuyến',
      'Ngôn ngữ mặc định Telegram',
      'Tin nhắn thử',
    ],
    'ug09.en': [
      '| Asset',
      '| Workspace',
      '| Watchlist',
      '| News article',
      '| Event',
      '| Theme',
      '| Market reaction',
      '| Narrative',
      '| Evidence',
      '| Provenance',
      'Time zone / UTC',
      '| Zero',
      'Access denied',
      'Could not load',
      'Bot token',
      '| Destination',
      '| Routing',
      'Default Telegram language',
      'Test message',
    ],
  };

  for (const articleId of ['ug08', 'ug09']) {
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
          new RegExp(`^title: '${titles[articleId][locale]}'$`, 'm'),
        );
        assert.match(
          frontmatter,
          new RegExp(`^sourceRevision: ${sourceRevision}$`, 'm'),
        );
        assert.match(frontmatter, /^approvalStatus: approved$/m);
        assert.match(
          frontmatter,
          /^approvalReference: 'SIGN-170: coordinator 2026-11-16'$/m,
        );
        assert.match(body.trimStart(), /^## /);

        for (const phrase of requiredCopy[`${articleId}.${locale}`]) {
          assert.ok(body.includes(phrase), `${articleId}.${locale}: ${phrase}`);
        }

        for (const match of body.matchAll(/\]\(([^)]+)\)/g)) {
          assert.match(match[1], new RegExp(`^/${locale}/docs/ug\\d{2}$`));
          const targetArticleId = match[1].split('/').at(-1);
          assert.ok(articleIds.includes(targetArticleId));
        }

        return [...body.matchAll(/^(#{2,3}) /gm)].reduce((shape, heading) => {
          const level = heading[1].length;
          shape[level] = (shape[level] ?? 0) + 1;
          return shape;
        }, {});
      }),
    );

    assert.deepEqual(translations[0], translations[1], `${articleId} headings`);
  }
});
