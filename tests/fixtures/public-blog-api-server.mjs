import { createServer } from 'node:http';

const publishedAt = '2026-10-01T08:00:00.000Z';
const modifiedAt = '2026-10-05T12:30:00.000Z';
const state = { published: true, empty: false, lastAuthorization: null };

function summary(
  id,
  title,
  slug,
  date = publishedAt,
  shortDescription = `${title} summary for public reading.`,
) {
  return {
    id,
    title,
    slug,
    shortDescription,
    status: 'PUBLISHED',
    publishedAt: date,
  };
}

const posts = [
  summary(
    1,
    'Đọc thị trường qua mối liên hệ giữa sự kiện và giá',
    'fixture-post',
    '2026-10-04T08:00:00.000Z',
    'Từ một tin tức đến biến động trên biểu đồ: cách đặt sự kiện trong bối cảnh trước khi đưa ra nhận định.',
  ),
  summary(
    2,
    'Đặt câu hỏi cho AI khi phân tích thị trường',
    'market-structure',
    '2026-10-02T08:00:00.000Z',
    'Một câu hỏi rõ ràng giúp AI đối chiếu dữ liệu, chỉ ra giả định và giải thích giới hạn của câu trả lời.',
  ),
  summary(
    3,
    'Xây dựng bản tin thị trường tự động',
    'weekly-signals',
    '2026-09-29T08:00:00.000Z',
    'Chọn dữ liệu, xác định nội dung và đặt lịch để theo dõi thị trường theo nhịp làm việc của bạn.',
  ),
  summary(
    4,
    'Khi nào một biến động giá cần được tìm hiểu?',
    'price-chart',
    '2026-09-25T08:00:00.000Z',
    'Đối chiếu giá, thời điểm và nguồn tin để tách một chuyển động đáng chú ý khỏi nhiễu thường ngày.',
  ),
  summary(
    5,
    'Từ ý tưởng đến chiến lược có thể kiểm chứng',
    'trading-routine',
    '2026-09-21T08:00:00.000Z',
    'Chuyển một nhận định thành giả thuyết với điều kiện rõ ràng và dữ liệu để kiểm tra.',
  ),
  summary(
    6,
    'Giữ bối cảnh trong quy trình phân tích',
    'market-risk',
    '2026-09-18T08:00:00.000Z',
    'Ghi lại dữ kiện, mối liên hệ và câu hỏi còn mở để tiếp tục phân tích mà không mất dấu lập luận.',
  ),
  summary(7, 'A second page article', 'second-page'),
  summary(8, 'Signals across related markets', 'related-markets'),
  summary(9, 'Building a research routine', 'research-routine'),
  summary(10, 'When to revisit a market view', 'market-view'),
  summary(11, 'Keeping evidence in context', 'evidence-context'),
  summary(12, 'Turning questions into scenarios', 'scenarios'),
  summary(13, 'Following a market event', 'market-event'),
  summary(14, 'Comparing signals over time', 'signals-over-time'),
  summary(15, 'Reviewing a trading hypothesis', 'trading-hypothesis'),
  summary(16, 'Notes for the next session', 'next-session'),
  summary(17, 'A second look at price movement', 'price-movement'),
  summary(18, 'What changed in the market', 'market-changes'),
];

const designContent = [
  {
    id: 'title',
    type: 'h1',
    children: [{ text: posts[0].title }],
  },
  {
    id: 'intro',
    type: 'p',
    children: [
      {
        text: 'Giá cho biết thị trường đã dịch chuyển thế nào. Sự kiện giúp bạn đặt câu hỏi vì sao chuyển động đó xuất hiện. Đọc hai nguồn thông tin cùng nhau là điểm bắt đầu để xây dựng một nhận định có bối cảnh.',
      },
    ],
  },
  {
    id: 'event-context',
    type: 'h2',
    children: [{ text: 'Bắt đầu từ sự kiện' }],
  },
  {
    id: 'event-source',
    type: 'p',
    children: [
      {
        text: 'Trước khi nhìn vào biểu đồ, hãy làm rõ điều gì đã xảy ra, nguồn tin đến từ đâu và sự kiện được ghi nhận vào thời điểm nào. Một tiêu đề ngắn có thể bỏ qua những chi tiết làm thay đổi cách hiểu nội dung.',
      },
    ],
  },
  {
    id: 'event-assets',
    type: 'p',
    children: [
      {
        text: 'Cùng một sự kiện có thể liên quan đến nhiều tài sản. Giữ lại các mối liên hệ cần kiểm tra giúp bạn mở rộng góc nhìn mà vẫn biết đâu là dữ kiện, đâu là giả thuyết.',
      },
    ],
  },
  {
    id: 'price-movement',
    type: 'h2',
    children: [{ text: 'Đối chiếu với chuyển động của giá' }],
  },
  {
    id: 'price-context',
    type: 'p',
    children: [
      {
        text: 'Đặt thời điểm của sự kiện cạnh diễn biến trên biểu đồ. Mục đích của bước này là xác định câu hỏi cần tìm hiểu thêm, thay vì vội gán mọi biến động cho tin tức vừa đọc.',
      },
    ],
  },
  {
    id: 'verification-questions',
    type: 'ul',
    children: [
      {
        type: 'li',
        children: [
          {
            text: 'Thời điểm: biến động xuất hiện trước hay sau khi thông tin được công bố?',
          },
        ],
      },
      {
        type: 'li',
        children: [
          {
            text: 'Phạm vi: chuyển động chỉ xuất hiện ở một tài sản hay ở nhiều thị trường liên quan?',
          },
        ],
      },
      {
        type: 'li',
        children: [
          {
            text: 'Bối cảnh: còn sự kiện hoặc điều kiện nào khác cần được đối chiếu?',
          },
        ],
      },
    ],
  },
  {
    id: 'hypothesis',
    type: 'h2',
    children: [{ text: 'Giữ lại giả thuyết và giới hạn' }],
  },
  {
    id: 'causality',
    type: 'p',
    children: [
      {
        text: 'Hai dữ kiện xuất hiện gần nhau chưa đủ để chứng minh quan hệ nhân quả. Hãy đối chiếu thêm các nguồn độc lập và ghi rõ điều gì có thể khiến giả thuyết ban đầu cần thay đổi.',
      },
    ],
  },
  {
    id: 'notes',
    type: 'p',
    children: [
      {
        text: 'Một ghi chú hữu ích gồm dữ kiện đã biết, mối liên hệ đang kiểm tra và câu hỏi còn mở. Khi có thông tin mới, bạn có thể tiếp tục lập luận mà không mất dấu những giả định trước đó.',
      },
    ],
  },
];

const content = [
  {
    id: 'title',
    type: 'h1',
    children: [{ text: 'Fixture market outlook' }],
  },
  {
    id: 'intro',
    type: 'p',
    children: [
      { text: 'A public article with ' },
      {
        text: 'a safe link',
        marks: [
          { type: 'link', attrs: { href: 'https://example.com/research' } },
        ],
      },
      { text: ' and ' },
      {
        text: 'an unsafe link',
        marks: [{ type: 'link', attrs: { href: 'javascript:alert(1)' } }],
      },
      { text: '.' },
    ],
  },
  {
    id: 'contents',
    type: 'toc',
    children: [],
  },
  {
    id: 'section-one',
    type: 'h2',
    children: [{ text: 'Section one' }],
  },
  {
    id: 'broken-image',
    type: 'img',
    src: 'https://127.0.0.1:1/missing.png',
    alt: 'Unavailable market chart',
    caption: 'Fixture image caption',
  },
  {
    id: 'after-image',
    type: 'p',
    children: [{ text: 'This paragraph remains after the broken image.' }],
  },
  {
    id: 'list-a',
    type: 'p',
    indent: 1,
    listStyleType: 'disc',
    children: [{ text: 'First list item', bold: true }],
  },
  {
    id: 'list-b',
    type: 'p',
    indent: 1,
    listStyleType: 'disc',
    children: [{ text: 'Second list item' }],
  },
  {
    id: 'ordered-list-a',
    type: 'p',
    indent: 1,
    listStart: 4,
    listStyleType: 'lower-alpha',
    children: [{ text: 'First ordered item' }],
  },
  {
    id: 'ordered-list-b',
    type: 'p',
    indent: 1,
    listStyleType: 'lower-alpha',
    children: [{ text: 'Second ordered item' }],
  },
  {
    id: 'ordered-list-c',
    type: 'p',
    indent: 2,
    listStyleType: 'lower-alpha',
    children: [{ text: 'Indented ordered item' }],
  },
  {
    id: 'todo-a',
    type: 'p',
    indent: 1,
    listStyleType: 'todo',
    checked: true,
    children: [{ text: 'Completed task' }],
  },
  {
    id: 'todo-b',
    type: 'p',
    indent: 1,
    listStyleType: 'todo',
    checked: false,
    children: [{ text: 'Open task' }],
  },
  {
    id: 'quote',
    type: 'blockquote',
    children: [{ type: 'p', children: [{ text: 'A quoted observation.' }] }],
  },
  {
    id: 'code',
    type: 'code_block',
    children: [
      {
        type: 'code_line',
        children: [{ text: 'const publicReading = true;' }],
      },
      {
        type: 'code_line',
        children: [{ text: 'console.log(publicReading);' }],
      },
    ],
  },
  {
    id: 'callout',
    type: 'callout',
    icon: 'i',
    backgroundColor: '#eef1ff',
    children: [
      {
        type: 'p',
        children: [
          { text: 'Callout content. ' },
          { type: 'date', date: '2026-10-02T08:00:00.000Z' },
        ],
      },
    ],
  },
  {
    id: 'table',
    type: 'table',
    children: [
      {
        type: 'tr',
        children: [{ type: 'td', children: [{ text: 'Table cell' }] }],
      },
    ],
  },
  {
    id: 'toggle',
    type: 'toggle',
    title: 'More details',
    children: [{ type: 'p', children: [{ text: 'Expanded details.' }] }],
  },
  { id: 'date', type: 'date', date: publishedAt },
  { id: 'mention', type: 'mention', value: 'Signapse' },
  {
    id: 'columns',
    type: 'column_group',
    children: [
      {
        type: 'column',
        width: 50,
        children: [{ type: 'p', children: [{ text: 'Column content.' }] }],
      },
    ],
  },
  { id: 'equation', type: 'equation', value: 'x^2 + y^2 = z^2' },
];

function detail(slug) {
  const post = posts.find((item) => item.slug === slug);
  if (!post) return undefined;
  const postContent =
    slug === 'fixture-post'
      ? designContent
      : content.map((node) =>
          node.id === 'title'
            ? { ...node, children: [{ text: post.title }] }
            : node,
        );
  return {
    ...post,
    lastModifiedDate: modifiedAt,
    contentSchemaVersion: 1,
    content: postContent,
  };
}

function json(response, status, body) {
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  });
  response.end(JSON.stringify(body));
}

const server = createServer((request, response) => {
  const url = new URL(request.url ?? '/', 'http://127.0.0.1');
  if (url.pathname === '/__fixture/publish') {
    state.published = url.searchParams.get('value') !== 'false';
    json(response, 200, { published: state.published });
    return;
  }
  if (url.pathname === '/__fixture/empty') {
    state.empty = url.searchParams.get('value') === 'true';
    json(response, 200, { empty: state.empty });
    return;
  }
  if (url.pathname === '/__fixture/authorization') {
    json(response, 200, { authorization: state.lastAuthorization });
    return;
  }

  if (!url.pathname.startsWith('/blogs/public')) {
    json(response, 404, { message: 'fixture route not found' });
    return;
  }

  state.lastAuthorization = request.headers.authorization ?? null;
  if (url.pathname === '/blogs/public') {
    const page = Number(url.searchParams.get('page') ?? 0);
    if (page === 99) {
      json(response, 503, { message: 'PRIVATE-UPSTREAM-MARKER' });
      return;
    }
    const visiblePosts = state.published && !state.empty ? posts : [];
    const content = visiblePosts.slice(page * 6, (page + 1) * 6);
    json(response, 200, {
      content,
      number: Math.max(0, page),
      size: 6,
      totalElements: visiblePosts.length,
      totalPages: Math.ceil(visiblePosts.length / 6),
    });
    return;
  }

  const slug = decodeURIComponent(url.pathname.slice('/blogs/public/'.length));
  if (slug === 'upstream-error') {
    json(response, 503, { message: 'PRIVATE-UPSTREAM-MARKER' });
    return;
  }
  if (slug === 'unsupported-version') {
    json(response, 200, {
      ...detail('fixture-post'),
      contentSchemaVersion: 2,
      title: 'PRIVATE-UNSUPPORTED-MARKER',
    });
    return;
  }
  if (slug === 'draft-body') {
    json(response, 200, {
      ...detail('fixture-post'),
      status: 'DRAFT',
      title: 'PRIVATE-DRAFT-MARKER',
    });
    return;
  }
  if (slug === 'private-post' || !state.published) {
    json(response, 404, { message: 'PRIVATE-NOT-FOUND-MARKER' });
    return;
  }
  const value = detail(slug);
  if (!value) {
    json(response, 404, { message: 'PRIVATE-NOT-FOUND-MARKER' });
    return;
  }
  json(response, 200, value);
});

server.listen(0, '127.0.0.1');
server.on('listening', () => {
  const address = server.address();
  if (!address || typeof address === 'string') process.exitCode = 1;
  else process.stdout.write(`${address.port}\n`);
});
