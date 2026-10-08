# SIGN-136 — kiểm chứng local blog public

Subtask `SIGN-136`, parent `SIGN-135`. Initial implementation commit `6e53ebc928144d6d3fad8e012637a8aabbf415b8`; follow-up fixes and current handoff evidence are recorded below. Lượt chạy đầy đủ ngày **2026-10-08** dùng Node 24.21.0, pnpm 10.34.5 và Cloudflare Worker preview qua browser wrapper của Symphony.

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

Prototype ghi rõ copy trong export chỉ minh họa bố cục, chưa phải copy marketing được duyệt; vì vậy mô tả list giữ locale copy hiện có. Detail có breadcrumb bổ sung để chỉ đường dẫn trang.

## Rà soát khi resume — 2026-10-08

Coordinator đã chốt OD-1 trong comment `10017` của `SIGN-136` và cập nhật SIGN-135 AC-7: URL VI/EN giữ nguyên; nội dung, title và slug dùng chung; từng URL list/detail canonical theo locale; canonical list giữ trang hiện tại; hreflang liên kết cùng trang hoặc cùng slug. Implementation trên revision `56531c0aca9487623817bd7ca7a4fdacfc28c07f` đáp ứng các đích này. Ghi chú blocker ở lượt kiểm tra ban đầu phía trên phản ánh trạng thái trước quyết định này.

OpenAPI được đọc lại lúc **2026-10-08 07:13:49 UTC** tại `https://dev-api.signapse.cloud/v3/api-docs`; `x-build-revision` vẫn là `5379145d86da2cab3af902d8c733e905d8dab80e`. Fetch anonymous trực tiếp lúc **07:16:43 UTC**: list `page=0&size=1` trả HTTP 200, detail slug `test` trả HTTP 200 và `contentSchemaVersion: 1`. Không gửi credential. Đây là kiểm tra dev API tại thời điểm ghi, không xác nhận hosted landing hoặc QA trên production data.

Hai screenshot desktop đã lưu được đối chiếu trực tiếp với export đã duyệt ở revision `5d0fb679c3b7500d518a6652873772f9b7b35a8e`. List giữ intro, thẻ bài nổi bật, lưới, phân trang và footer. Detail giữ hero navy, rail bên trái, cột nội dung và back-to-list; capture hiện có thêm breadcrumb trong hero và hiển thị nhãn/ngày trên hai dòng. Review độc lập xác định mức ảnh hưởng của các khác biệt nhỏ này trước handoff.

PR #4 hiện mở trên head `56531c0aca9487623817bd7ca7a4fdacfc28c07f`; workflow Verify/check thành công trên revision này. Chưa có hosted acceptance, merge hoặc deployment; các bước đó do owner/coordinator thực hiện sau handoff.

Rà soát resume trên checkout Node 24.21.0 / pnpm 10.34.5: `pnpm check`, `pnpm lint`, `pnpm format:check`, Prettier trực tiếp cho file evidence và `pnpm build` đều pass. Build còn cảnh báo chunk vượt 500 kB. Browser wrapper chạy với `PUBLIC_APP_ORIGIN=http://localhost:3000`, `PUBLIC_CONTACT_API_ORIGIN=https://dev-api.signapse.cloud`, `SIGNAPSE_PUBLIC_ORIGIN=https://landing.example.test`, indexability `false` và Analytics `false`: **51/51 pass**, Chromium, run `SIGN-136.20261008T072901Z.Jk9GJB`. Assertions mới khóa canonical/hreflang của list trang 2 và detail cùng slug theo AC-7. Đây là local output/evidence; không thay hosted acceptance.

## Kiểm chứng khi bàn giao — 2026-10-08

Implementation source revision: `ab7c8126ffe2c5be8a02048d96a245c483299bd7`; Playwright title-size assertion revision: `f8fd68efd1429cb7a74320e08fa3ee95525386f6`. The list route redirects stale pagination to the last available page without caching the redirect. The content renderer preserves editor list markers, numbering start, indent and checklist state. The detail title is 60 px at 1440 px as specified by the approved prototype.

On exact HEAD `f8fd68efd1429cb7a74320e08fa3ee95525386f6`, `pnpm check`, `pnpm lint`, `pnpm format:check`, and `pnpm build` passed between **07:55:57 and 07:56:20 UTC**. Build still reports a Vite chunk above 500 kB. `pnpm exec wrangler deploy --dry-run` passed at **07:54 UTC**, confirming the current Worker output and `ASSETS` / `PUBLIC_BLOG_API_ORIGIN` bindings; it did not deploy. No model files changed, so `pnpm test:models` was not rerun; its previous result was 14/14.

The full Symphony browser wrapper passed **52/52** on Chromium, run `SIGN-136.20261008T075010Z.7f9eKb`; durable evidence: `/opt/apps/symphony/logs-landing/evidence/SIGN-136.20261008T075010Z.7f9eKb`. It exercised the out-of-range redirect over HTTP, list HTML with JavaScript disabled, editor list markers/start/indent/check state, structural lists, error and freshness paths, mobile layout, keyboard navigation and accessibility. A focused test also passed **1/1**, confirming the 60 px detail title at 1440 px, run `SIGN-136.20261008T075413Z.msmBse`. The tracked desktop captures were refreshed from the full run; ignored Playwright output is not durable evidence.

At **2026-10-08 08:08:38 UTC**, `https://dev-api.signapse.cloud/v3/api-docs` returned OpenAPI 3.1 with body SHA-256 `ca9c996564facb66b410b325f2aa4791d74c93e9fdb816d5381b88a530bcfbf0` and JSON field `x-build-revision=180ffd7098d2c43a67720026ce52c4bfce36c48a`. The earlier **07:58 UTC** fetch recorded revision `9535439ff6c34cd347502b04cf8e1762cd4ba407` with SHA-256 `5afbe4fddd5b20ea4845788e96415c2abad56a6867edcde05c265afb9c15e14a`. Both GET routes are public and need no credential. The list contract uses zero-based `page`, a default `size` of 20, and fixed `publishedAt,desc` then `id,desc` ordering; submitted sort values are ignored. Anonymous list `page=0&size=1` and detail slug `test` returned HTTP 200; detail was `PUBLISHED`, `contentSchemaVersion: 1`, with 54 content nodes. Anonymous `page=999&size=6` returned HTTP 200 with `number=999`, `totalElements=1`, `totalPages=1`, and empty content. The Worker fixture test confirms the landing redirects an out-of-range request to the last available page. These checks do not verify a hosted landing deployment or production data.

The refreshed list and detail captures were compared again with the approved exports at planning revision `5d0fb679c3b7500d518a6652873772f9b7b35a8e`. List structure and detail hero/rail/content/back link match the approved layout. The detail title now matches the 60 px contract. Independent review passed Requirement adherence and Correctness & Standards with no blocking findings; it recorded the added breadcrumb and two-line date labels as small visual differences. Merge, deployment, hosted smoke and coordinator acceptance remain separate human-owned actions.
