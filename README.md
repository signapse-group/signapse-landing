# Signapse Landing

Repository Astro này nhận task để **implement landing Signapse**: source, nội dung VI/EN trong code, runtime assets/demo, tests, runbook và bằng chứng thực thi. Requirement/design, copy contract, Pen/prototype, nghiên cứu và ADR thuộc [signapse-planing](https://github.com/signapse-group/signapse-planing/blob/main/ui-design/references/landing/README.md) từ **2026-10-06**. Baseline implementation đã được người dùng xác nhận ngày **2026-10-04**.

Astro prerender landing cho `/`, `/vi`, `/en` và Privacy Policy tại `/vi/privacy-policy`, `/en/privacy-policy`; root hiển thị tiếng Việt. Các route `/vi/blogs` và `/en/blogs` cùng trang chi tiết được render theo từng request trong Cloudflare Worker, lấy bài từ public API. React islands sở hữu header/capability, Hero WebGL, bốn demo và Audience. Nội dung SSR, SVG fallback và native navigation vẫn hữu ích khi JavaScript hoặc WebGL không khả dụng. Các demo dùng dữ liệu mẫu và timeline trong repo, không gọi backend.

Đọc [mục lục tài liệu](docs/README.md), [contract landing tại planning](https://github.com/signapse-group/signapse-planing/blob/main/ui-design/references/landing/LANDING.md), [kiến trúc implementation](docs/architecture.md) và [kiểm chứng](docs/verification/README.md). Task tham chiếu design/AC đã duyệt; thay đổi requirement/design được xử lý tại planning. Source nằm trong `src/`, runtime assets trong `public/`, model/browser tests trong `tests/`.

## Assigned execution và Symphony

Jira `SIGN` giữ contract/lifecycle; [WORKFLOW.md](WORKFLOW.md) là điểm vào thực thi assigned Symphony work. [CONTRIBUTING.md](CONTRIBUTING.md) sở hữu standards và cách chọn verification; skills local hỗ trợ kỹ thuật theo nhu cầu. Ordinary requests và cấu hình consumer giữ boundary đã giao.

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

Các route: [VI](http://127.0.0.1:4321/vi), [EN](http://127.0.0.1:4321/en). Landing build/run độc lập; public Blog ở landing. Dashboard, authentication và Articles thuộc ứng dụng sản phẩm; CTA dashboard đã được gỡ vì chưa mở quyền user access.

Blog SSR cần Worker binding `PUBLIC_BLOG_API_ORIGIN`. Local production preview dùng ignored `.dev.vars`; tạo từ mẫu trước lần chạy đầu:

```powershell
Copy-Item .dev.vars.example .dev.vars
pnpm preview --host 127.0.0.1 --port 4321
```

`pnpm preview` chép `.dev.vars` vào `dist/server/.dev.vars` sau build để Wrangler preview đọc runtime binding. `wrangler.jsonc` đặt mặc định API dev công khai; đặt origin thực tế của môi trường tại Worker variable khi deploy. Public GET không cần credential.

## Cấu hình

Copy `.env.example` sang ignored `.env`, đặt giá trị rồi **build lại**. Env được áp dụng tại build time.

| Biến                         | Hành vi                                                                                                                                                                                                                                      |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PUBLIC_APP_ORIGIN`          | Origin HTTP(S) của ứng dụng sản phẩm, không path/query/credentials. Default `http://localhost:3000`; vẫn được validate tại build/deploy. Landing hiện không render link hoặc CTA dashboard.                                                  |
| `PUBLIC_CONTACT_API_ORIGIN`  | Origin HTTPS của API contact, riêng với ứng dụng sản phẩm. `.env.example` dùng `https://dev-api.signapse.cloud`; cấu hình GitHub theo môi trường landing và CORS của API.                                                                    |
| `PUBLIC_BLOG_API_ORIGIN`     | Worker runtime variable cho API public blog; cấu hình qua GitHub Variable khi deploy, hoặc `wrangler.jsonc` / `.dev.vars` khi local. Không phải build-time `.env`; mặc định local là `https://dev-api.signapse.cloud`. Không cần credential. |
| `SIGNAPSE_PUBLIC_ORIGIN`     | Origin HTTPS explicit của landing. Thiếu/invalid ở preview: bỏ canonical/hreflang, giữ `noindex`.                                                                                                                                            |
| `SIGNAPSE_LANDING_INDEXABLE` | Default `false`. Bật `true` yêu cầu public origin HTTPS hợp lệ; thiếu thì build fail. Root luôn `noindex` để tránh duplicate.                                                                                                                |
| `SIGNAPSE_VERCEL_ANALYTICS`  | Default `false`. Chỉ bật Analytics/Speed Insights khi hosting có Vercel endpoints.                                                                                                                                                           |

Mọi trang public kế thừa token landing từ `BaseLayout`; `.landingRoot` trong `landing-page.module.css` là nguồn duy nhất của `--landing-*`, không chép lại trong CSS từng trang. Header/Footer dùng chung trên landing, Privacy Policy và Blog, kể cả trạng thái lỗi.

Header có năm item trực tiếp: Tính năng, Xem demo, Dành cho ai, Blog và Liên hệ; mobile dùng menu phẳng với cùng thứ tự. Item Liên hệ dẫn tới `#access`, hoặc `/{locale}#access` từ Blog. Hero “Liên hệ” dẫn tới `#access`; form gửi JSON tới `{PUBLIC_CONTACT_API_ORIGIN}/contact-requests`. Phần liên hệ dùng “Start Your Journey / Contact Us” ở EN và “Bắt đầu hành trình của bạn / Liên hệ với chúng tôi” ở VI; form không có tiêu đề/dòng hướng dẫn đầu card hoặc viền ngoài, vẫn giữ labels và validation. Phần liên hệ và Footer có số `0933.80.99.36` với link `tel:+84933809936`; email `access@signapse.cloud` tiếp tục dùng mailto. Dashboard chưa mở quyền user access, nên Header/Footer không có nút hoặc link vào dashboard; chỉ khôi phục khi người dùng cho phép rõ ràng. Locale switch giữ query và các hash trong `SUPPORTED_LANDING_HASHES`.

Request-language negotiation và domain redirects cần cấu hình tại hosting. Hosted CI và deployment được kiểm chứng trong quy trình release; production preview chạy cả static homepage lẫn Worker SSR cho blog.

Footer gồm brand, Khám phá (Tính năng/Xem demo/Dành cho ai/Blog/Chính sách quyền riêng tư) và Liên hệ (Gửi lời nhắn/email/điện thoại); Privacy Policy xuất hiện sau Blog, labels phản ánh đúng đích, mobile links tối thiểu 44 px. Typography landing giữ copy: Hero 32/48/56 px, Audience H2 30/36 px như Providers/contact, Audience item titles 18/20/22 px. Các ngưỡng là base/640/1024 px; showcase và Blog không đổi kích thước chữ.

## Deploy dev và public

Feature PR vào `dev`; merge/push `dev` chạy Verify rồi deploy Worker `signapse-landing-dev` tại `https://dev.signapse.cloud`. Sau kiểm thử dev, coordinator duyệt PR `dev` → `main`; main deploy Worker `signapse-landing` tại `https://signapse.cloud`. Không push thẳng lên các nhánh phát hành. PR chỉ chạy checks, không publish.

Hai môi trường build riêng; dev chọn `CLOUDFLARE_ENV=dev` ngay lúc build, luôn noindex và Analytics off. GitHub Variables dev có prefix `DEV_`, public giữ tên hiện có; API/blog hiện dùng chung `https://dev-api.signapse.cloud`. Worker/runtime bindings và domain được tách, database/API không được nhân bản. Dashboard CTA vẫn ẩn.

[Runbook deployment](docs/deployment/signapse-cloud.md) sở hữu cấu hình, bootstrap, CI/revision/domain verification và rollback. [Symphony consumer](docs/symphony.md) giữ stable control checkout main; issue workspace clone dev, PR/delivery dev. Release public là operation riêng do coordinator duyệt.

## Kiểm tra

| Lệnh                | Mục đích                                                                                                                                  |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm check`        | Astro / strict TypeScript                                                                                                                 |
| `pnpm lint`         | Source/config ESLint                                                                                                                      |
| `pnpm format:check` | Format source/config/test; loại docs, runtime assets và local skills                                                                      |
| `pnpm format`       | Format cùng phạm vi                                                                                                                       |
| `pnpm build`        | Sinh static assets và Worker SSR trong `dist/`                                                                                            |
| `pnpm test:models`  | Invariants timeline Graph/Chart/AI/Telegram                                                                                               |
| `pnpm test:browser` | Playwright trên Worker production preview với HTTP fixture API: SSR blog, trạng thái/freshness, navigation, responsive, demos và fallback |

Lần đầu cài browser và chạy các checks:

```powershell
pnpm exec playwright install chromium
pnpm check
pnpm lint
pnpm format:check
pnpm build
pnpm test
```

Playwright tự mở `pnpm preview --ignore-lock` foreground tại 4321 khi chưa có server, kể cả trong Codex. Browser runner khởi động HTTP fixture API, tạm ghi Worker vars vào `dist/server/.dev.vars`, rồi khôi phục file sau test. Trên shared Symphony host, mọi browser checks đi qua [wrapper của operator](docs/symphony.md#browser-isolation-trên-shared-host) với `CI=1`, shared lock và cache landing riêng. CLI đọc ignored `.env`, với process env được ưu tiên; metadata assertions nhận chế độ indexability và public origin của build. Có thể đổi port bằng `PLAYWRIGHT_PORT`. Navigation tests kiểm Blog/locale/contact và khóa việc không có link dashboard, không yêu cầu backend hay đăng nhập ứng dụng sản phẩm. Trace/report và kết quả JSON nằm trong ignored `test-results/`.

Browser runner chỉ thay `PUBLIC_BLOG_API_ORIGIN` bằng fixture local; giữ nguyên metadata, indexability và analytics theo env của build. Chạy build và browser tests với cùng `SIGNAPSE_PUBLIC_ORIGIN` / `SIGNAPSE_LANDING_INDEXABLE`; preview không đặt public origin vẫn kiểm tra canonical/hreflang vắng mặt và noindex.

CI khai báo install frozen, check/lint/format/build, model tests và browser tests. [Verification](docs/verification/README.md) lưu kết quả và giới hạn của các lần chạy thực tế. Chụp lại ảnh của landing bằng `node docs/verification/capture-preview.mjs http://127.0.0.1:4321` khi production preview đang chạy; script dùng riêng repo này.

Fonts Geist, Geist Mono và Inter được self-host; giấy phép đi kèm trong `public/fonts/`. Provider assets có NOTICE trong `public/images/providers/`.
