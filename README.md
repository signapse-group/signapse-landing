# Signapse Landing

Repository Astro này nhận task để **implement landing Signapse**: source, nội dung VI/EN trong code, runtime assets/demo, tests, runbook và bằng chứng thực thi. Requirement/design, copy contract, Pen/prototype, nghiên cứu và ADR thuộc [signapse-planing](../signapse-planing/ui-design/references/landing/README.md) từ **2026-10-06**. Baseline implementation đã được người dùng xác nhận ngày **2026-10-04**.

Astro dựng HTML tĩnh cho `/`, `/vi` và `/en`; root hiển thị tiếng Việt. React islands sở hữu header/capability, Hero WebGL, bốn demo và Audience. Nội dung SSR, SVG fallback và native navigation vẫn hữu ích khi JavaScript hoặc WebGL không khả dụng. Các demo dùng dữ liệu mẫu và timeline trong repo, không gọi backend.

Đọc [mục lục tài liệu](docs/README.md), [contract landing tại planning](../signapse-planing/ui-design/references/landing/LANDING.md), [kiến trúc implementation](docs/architecture.md) và [kiểm chứng](docs/verification/README.md). Task tham chiếu design/AC đã duyệt; thay đổi requirement/design được xử lý tại planning. Source nằm trong `src/`, runtime assets trong `public/`, model/browser tests trong `tests/`.

## Assigned execution và Symphony

Jira `SIGN` giữ contract/lifecycle; [WORKFLOW.md](WORKFLOW.md) nhận native Subtask có `route-landing`. Skills local trong [.agents/skills](.agents/skills/) được adapt từ FE và do landing sở hữu. Worker thực thi/check/review rồi bàn giao tại `In Review`; coordinator giữ `Done` sau applicable gates, merge không tự hoàn tất Jira. Ordinary requests và cấu hình consumer không tự dispatch issue.

[Consumer runbook](docs/symphony.md) mô tả offline checker, host inputs, browser isolation và handoff. Phần setup/activation trên server được người dùng thực hiện riêng qua repo Symphony sau cập nhật consumer; repository config không chứng minh runtime đã chạy.

## Chạy local và production preview

Dùng Node **24.21.0** và pnpm **10.34.5** theo `.node-version` / `packageManager`.

```powershell
pnpm install --frozen-lockfile
pnpm dev
```

Dev server mặc định tại [localhost:4321](http://localhost:4321/vi). Để kiểm tra output production:

```powershell
pnpm build
pnpm preview --host 127.0.0.1 --port 4321
```

Các route: [VI](http://127.0.0.1:4321/vi), [EN](http://127.0.0.1:4321/en). Landing build/run độc lập; ứng dụng sản phẩm là đích liên kết dashboard và Articles.

## Cấu hình

Copy `.env.example` sang ignored `.env`, đặt giá trị rồi **build lại**. Env được áp dụng tại build time.

| Biến                         | Hành vi                                                                                                                                                                                              |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PUBLIC_APP_ORIGIN`          | Origin HTTP(S) của ứng dụng sản phẩm, không path/query/credentials. Default `http://localhost:3000`. Dashboard CTA dẫn tới `{origin}/{locale}/dashboard`; Articles tới `{origin}/{locale}/articles`. |
| `SIGNAPSE_PUBLIC_ORIGIN`     | Origin HTTPS explicit của landing. Thiếu/invalid ở preview: bỏ canonical/hreflang, giữ `noindex`.                                                                                                    |
| `SIGNAPSE_LANDING_INDEXABLE` | Default `false`. Bật `true` yêu cầu public origin HTTPS hợp lệ; thiếu thì build fail. Root luôn `noindex` để tránh duplicate.                                                                        |
| `SIGNAPSE_VERCEL_ANALYTICS`  | Default `false`. Chỉ bật Analytics/Speed Insights khi hosting có Vercel endpoints.                                                                                                                   |

Hero “Liên hệ” dẫn tới `#access`; footer giữ mailto `access@signapse.cloud`. Dashboard CTA mở trực tiếp ứng dụng sản phẩm; ứng dụng đích xử lý đăng nhập. Locale switch giữ query và các hash trong `SUPPORTED_LANDING_HASHES`.

Request-language negotiation và domain redirects cần cấu hình tại hosting. Hosted CI và deployment được kiểm chứng trong quy trình release; production preview chỉ kiểm chứng output static.

## Deploy signapse.cloud

Landing dùng Cloudflare Workers Static Assets với `wrangler.jsonc`. Mỗi push/merge vào `main` chạy workflow **Verify**: checks/build/model/browser tests pass rồi tự deploy chính `dist/` đã kiểm tra lên `signapse.cloud`. PR và push ở nhánh khác chạy CI. Nút **Run workflow** trên `main` vẫn có thể dùng để deploy lại. Các run trên `main` dùng chung concurrency group và chạy nối tiếp để tránh publish đồng thời.

GitHub giữ một run đang chạy và một run chờ trong group; push mới có thể thay run đang chờ bằng revision mới nhất.

Origins và `SIGNAPSE_LANDING_INDEXABLE` lưu trong GitHub Variables; Cloudflare token/account ID lưu trong GitHub Secrets. Indexing mặc định tắt và hiện variable là `false`; đổi thành `true` sau khi hoàn tất go-live. Push `main` và deploy thủ công đều dùng cùng cấu hình.

Làm theo [hướng dẫn deploy signapse.cloud](docs/deployment/signapse-cloud.md). [Bản nghiên cứu tại planning](../signapse-planing/docs/research/landing-cloudflare-deployment.md) giải thích lựa chọn hosting và các giới hạn. Bật indexing không đổi root `/`: root tiếp tục là landing VI noindex.

## Kiểm tra

| Lệnh                | Mục đích                                                                                          |
| ------------------- | ------------------------------------------------------------------------------------------------- |
| `pnpm check`        | Astro / strict TypeScript                                                                         |
| `pnpm lint`         | Source/config ESLint                                                                              |
| `pnpm format:check` | Format source/config/test; loại docs, runtime assets và local skills                              |
| `pnpm format`       | Format cùng phạm vi                                                                               |
| `pnpm build`        | Sinh output static `dist/`                                                                        |
| `pnpm test:models`  | Invariants timeline Graph/Chart/AI/Telegram                                                       |
| `pnpm test:browser` | Playwright trên production preview: VI/EN, responsive, navigation, demos, accessibility, fallback |

Lần đầu cài browser và chạy các checks:

```powershell
pnpm exec playwright install chromium
pnpm check
pnpm lint
pnpm format:check
pnpm build
pnpm test
```

Playwright tự mở `pnpm preview --ignore-lock` foreground tại 4321 khi chưa có server, kể cả trong Codex. Trên shared Symphony host, mọi browser checks đi qua [wrapper của operator](docs/symphony.md#browser-isolation-trên-shared-host) với `CI=1`, shared lock và cache landing riêng. CLI đọc ignored `.env`, với process env được ưu tiên; metadata assertions nhận chế độ indexability và public origin của build. Có thể đổi port bằng `PLAYWRIGHT_PORT`; nếu build dùng origin app khác, đặt `PLAYWRIGHT_APP_ORIGIN` khớp env build. Navigation tests intercept đích dashboard/Articles để kiểm URL và locale mà không yêu cầu backend. Trace/report và kết quả JSON nằm trong ignored `test-results/`.

CI khai báo install frozen, check/lint/format/build, model tests và browser tests. [Verification](docs/verification/README.md) lưu kết quả và giới hạn của các lần chạy thực tế. Chụp lại ảnh của landing bằng `node docs/verification/capture-preview.mjs http://127.0.0.1:4321` khi production preview đang chạy; script dùng riêng repo này.

Fonts Geist, Geist Mono và Inter được self-host; giấy phép đi kèm trong `public/fonts/`. Provider assets có NOTICE trong `public/images/providers/`.
