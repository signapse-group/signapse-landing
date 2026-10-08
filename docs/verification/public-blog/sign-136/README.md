# SIGN-136 — kiểm chứng local blog public

Subtask `SIGN-136`, parent `SIGN-135`. Lượt chạy đầy đủ ngày **2026-10-08** dùng Node 24.21.0, pnpm 10.34.5 và Cloudflare Worker preview qua browser wrapper của Symphony. Source commit sẽ được ghi sau khi tạo commit implementation.

## Kết quả

- `pnpm check`: pass, không có lỗi/cảnh báo/hint.
- `pnpm lint`: pass.
- `pnpm format:check`: pass.
- `pnpm test:models`: 14/14 pass.
- `pnpm build`: pass; Vite báo dynamic chunk lớn hơn 500 kB.
- `pnpm exec wrangler deploy --dry-run`: pass; kiểm tra binding `ASSETS` và `PUBLIC_BLOG_API_ORIGIN`, không deploy.
- Browser wrapper: 51/51 pass, Chromium, run `SIGN-136.20261008T042921Z.qR8NTA`. Regression coverage confirms nested content date formatting stays English on the English detail route; list breadcrumb and next-page copy match the approved Vietnamese export.
- API transport tests đi qua HTTP fixture cục bộ được gọi từ runtime Worker SSR. Chúng kiểm tra status/HTML/metadata, `no-store`, không credential, phân trang và locale links trong SSR HTML, content version 1, empty/missing/nonpublic/upstream/schema errors, image failure, freshness, điều hướng, responsive, keyboard và axe.

Lệnh browser đầy đủ:

```sh
PUBLIC_APP_ORIGIN=http://localhost:3000 \
PUBLIC_CONTACT_API_ORIGIN=https://dev-api.signapse.cloud \
SIGNAPSE_PUBLIC_ORIGIN=https://landing.example.test \
SIGNAPSE_LANDING_INDEXABLE=false \
SIGNAPSE_VERCEL_ANALYTICS=false \
"$SYMPHONY_LANDING_BROWSER_WRAPPER" "$PWD"
```

Evidence run ngoài repository: `/opt/apps/symphony/logs-landing/evidence/SIGN-136.20261008T042921Z.qR8NTA`. Browser report/trace ở ignored `test-results/` không phải bằng chứng lưu lâu dài. Ba capture desktop được chụp lại sau khi chỉnh renderer, design và copy; evidence được lưu trong repo:

- Danh sách 1440 px: [list-desktop.png](list-desktop.png).
- Chi tiết tiếng Việt 1440 px: [detail-desktop.png](detail-desktop.png).
- Renderer structured content v1: [content-version-1-desktop.png](content-version-1-desktop.png).

## Contract và giới hạn

OpenAPI hiện hành được đọc lại ngày **2026-10-08 04:20 UTC** tại `https://dev-api.signapse.cloud/v3/api-docs`, producer revision `5379145d86da2cab3af902d8c733e905d8dab80e` (OpenAPI 3.1; SHA-256 của response body `93e0c935a2b405e8dc615966fcd742ed782c13fa0280e4786f6cf09ac2866e40`). `GET /blogs/public` và `GET /blogs/public/{slug}` hiện được gọi anonymous: cả hai trả HTTP 200; detail có `contentSchemaVersion: 1`. Fixture checks kiểm chứng server-to-API HTTP boundary, nhưng không xác nhận producer deployment, hosted landing deployment hay dữ liệu sống sau lần đọc này.

Desktop captures được so sánh với các export đã duyệt: [list 2×](https://github.com/signapse-group/signapse-planing/blob/5d0fb679c3b7500d518a6652873772f9b7b35a8e/ui-design/pen/landing/exports/public-blog/list-desktop.png) và [detail 2×](https://github.com/signapse-group/signapse-planing/blob/5d0fb679c3b7500d518a6652873772f9b7b35a8e/ui-design/pen/landing/exports/public-blog/detail-desktop.png). Implementation references [approved prototype and responsive contract](https://github.com/signapse-group/signapse-planing/blob/5d0fb679c3b7500d518a6652873772f9b7b35a8e/ui-design/pen/landing/public-blog-prototype.md).

Canonical VI/EN remains subject to parent `SIGN-135` OD-1, which was still open at the latest Jira reread. No hosted acceptance, merge or deployment is claimed here.
