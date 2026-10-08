# Deploy landing lên signapse.cloud

Stack: **Astro prerendered homepage + Cloudflare Worker SSR blog → GitHub Actions → Worker Static Assets → Custom Domain signapse.cloud**. Homepage `/`, `/vi` và `/en` vẫn static; blog list/detail gọi public API theo từng request và trả `no-store`. [Wrangler config](../../wrangler.jsonc), [workflow Verify](../../.github/workflows/ci.yml) và browser tests đã được chuẩn bị trong repo.

Mỗi push/merge vào `main` tự chạy CI rồi deploy sau khi toàn bộ checks và tests pass. PR và push ở nhánh khác chạy verification với noindex. Nút **Run workflow** trên `main` dùng để deploy lại khi cần. Workflow dùng chính `dist/` đã kiểm tra để publish; các run trên `main` chạy nối tiếp trong cùng concurrency group để tránh publish đồng thời. [GitHub push trigger](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#push), [concurrency](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency).

Concurrency mặc định giữ một run đang chạy và một run pending; push mới có thể thay run pending bằng revision mới nhất. Run đang publish trên `main` không bị huỷ bởi push mới.

## Trạng thái triển khai ngày 2026-10-07

Nhánh `main`, commit `2ea7124611b6902596e12232dbd8c696463350ce`, đã deploy thành công qua [GitHub Actions run 37591390406](https://github.com/signapse-group/signapse-landing/actions/runs/37591390406). Checks/build và 14 model tests pass. Browser suite ghi nhận 30 tests pass ngay và 1 test reset Graph/Telegram pass sau retry; workflow kết thúc success. Nguyên nhân lỗi test không ổn định chưa được chẩn đoán trong lượt deploy này.

Worker version `dcfcdc6d-b082-43a2-8744-8d5d1b779b04` đã phục vụ trên `signapse.cloud`. Kiểm tra hosted xác nhận nội dung VI/EN mới, nội dung khớp Workers, canonical/noindex, 12 assets, 404 và các redirect slash/www/HTTP. [Bằng chứng release](../verification/cloudflare-hosted-release-2026-10-07.json). Giữ `PUBLIC_APP_ORIGIN=https://dev.signapse.cloud`, indexing tắt; DNS dùng cấu hình đã nối ngày 2026-10-05.

Contact API origin hiện chưa có trong GitHub Variables. Trước deploy phiên bản form, owner thêm `PUBLIC_CONTACT_API_ORIGIN` cho môi trường đích; workflow `Verify` từ chối deploy `main` nếu biến này thiếu hoặc không phải HTTPS origin hợp lệ. Blog SSR cũng cần `PUBLIC_BLOG_API_ORIGIN` trỏ tới API public của cùng môi trường; workflow xác thực HTTPS origin này và inject vào Worker lúc deploy.

## Trạng thái triển khai ngày 2026-10-05

Nhánh `main`, commit `0095df9c0d4a17ab50123de1b7f74ddfff08ca2f`, đã deploy thành công qua [GitHub Actions run 37306184240](https://github.com/signapse-group/signapse-landing/actions/runs/37306184240). Source checks, build, 14 model tests và 31 browser tests đều pass trước upload. Worker **signapse-landing** đang phục vụ [signapse.cloud](https://signapse.cloud/vi) qua Custom Domain.

Apex dùng record do Workers quản lý. `www` là CNAME proxied về `signapse.cloud`; redirect `www` → HTTPS apex và HTTP apex → HTTPS đều trả 301, giữ path/query. `/vi/` và `/en/` trả 307 về URL không slash cuối; locale hoặc path không tồn tại trả 404. [Bằng chứng hosted](../verification/cloudflare-hosted-release.json) ghi metadata, assets, redirects và nội dung khớp Workers; [ảnh domain thật](../verification/signapse-cloud-desktop.png).

GitHub đã có hai Secrets `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN` và hai Variables `PUBLIC_APP_ORIGIN=https://dev.signapse.cloud`, `SIGNAPSE_PUBLIC_ORIGIN=https://signapse.cloud`. Release đầu giữ **noindex**, `workers_dev=true`, `preview_urls=false`. Bước 6 là lần chuyển sang origin dashboard, bật indexing và đóng hostname Workers phụ sau khi ứng dụng go-live.

Dashboard VI đã mở được trong phiên Chrome đăng nhập hiện tại. HTTP tự động không có session tới các route app trả 429; kiểm chứng này không xác nhận auth/backend hoặc mọi trang ứng dụng. Mapping Vercel cũ trước cutover được lưu local trong ignored `test-results/cloudflare-before-cutover.json` để rollback.

## 1. Chốt origin ứng dụng và đưa cấu hình lên main

Landing sẽ sở hữu mọi path trên `signapse.cloud`. Dashboard, authentication và Articles phải có origin ứng dụng thực riêng. Nếu app hiện dùng apex, chuẩn bị origin đó và kế hoạch giữ URL cũ trước bước nối domain. Repo landing không thay đổi ứng dụng sản phẩm.

Origin app hiện tại đã được xác nhận là **https://dev.signapse.cloud**; origin dự kiến khi go-live là **https://dashboard.signapse.cloud**. Dùng dev cho lần thử; chuẩn bị app/DNS/certificate ở dashboard trước khi đổi production origin. Tra DNS công khai ngày 2026-10-05 hiện chưa có record cho `dashboard.signapse.cloud`.

Không đặt `PUBLIC_APP_ORIGIN=https://signapse.cloud` hoặc hostname `www.signapse.cloud` dẫn về landing.

Đưa các thay đổi lên nhánh `main` của [signapse-group/signapse-landing](https://github.com/signapse-group/signapse-landing) để tự chạy CI/deploy. Nút **Run workflow** vẫn có sẵn cho lần deploy thủ công; chỉ chọn `main`. [GitHub manual workflows](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow).

## 2. Cấu hình Cloudflare credentials và GitHub Variables

Trong Cloudflare, chọn account chứa zone **signapse.cloud** đang active. Copy **Account ID**; đây là account ID, không phải zone ID.

Token hiện dùng tên **signapse-landing-github-deploy**, với phạm vi:

- Account triển khai: **Workers Scripts — Edit**, **Account Settings — Read**.
- Chỉ zone `signapse.cloud`: **Workers Routes — Edit**, **Zone — Read**.

Lưu token vào GitHub Secrets; không ghi giá trị vào repository. Token này không có quyền sửa DNS hoặc Redirect Rules: cutover DNS và rules được thực hiện trong Cloudflare dashboard. Các lần deploy nội dung tiếp theo dùng GitHub Actions. [Cloudflare GitHub Actions authentication](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/).

Trong repository GitHub → **Settings → Secrets and variables → Actions**, tạo:

| Tab | Tên | Giá trị |
| --- | --- | --- |
| Secrets | `CLOUDFLARE_API_TOKEN` | API token vừa tạo. |
| Secrets | `CLOUDFLARE_ACCOUNT_ID` | Account ID chứa Worker và zone. |
| Variables | `PUBLIC_APP_ORIGIN` | Lần thử: `https://dev.signapse.cloud`; go-live: `https://dashboard.signapse.cloud` sau khi app đã hoạt động. |
| Variables | `PUBLIC_CONTACT_API_ORIGIN` | Origin public API contact cho môi trường landing; hiện dev dùng `https://dev-api.signapse.cloud`. API phải cho phép CORS từ `https://signapse.cloud`. |
| Variables | `PUBLIC_BLOG_API_ORIGIN` | HTTPS origin của API có `GET /blogs/public` và `GET /blogs/public/{slug}` cho môi trường landing. Không thêm path/query/credential; public reading không cần token. |
| Variables | `SIGNAPSE_PUBLIC_ORIGIN` | `https://signapse.cloud` |
| Variables | `SIGNAPSE_LANDING_INDEXABLE` | `false` hiện tại; chỉ đổi `true` khi sẵn sàng indexing. Thiếu variable cũng giữ noindex. |

Workflow tự đặt `SIGNAPSE_VERCEL_ANALYTICS=false`. Push `main` và deploy thủ công đều đọc `SIGNAPSE_LANDING_INDEXABLE` từ GitHub Variables; không còn checkbox indexing trên **Run workflow**. App/contact/landing metadata được dùng lúc build; `PUBLIC_BLOG_API_ORIGIN` được kiểm tra và truyền bằng Wrangler `--var` thành Worker runtime binding, không được bundle vào browser.

## 3. Deploy lần đầu với noindex

Đặt GitHub Variable `SIGNAPSE_LANDING_INDEXABLE=false`, rồi push/merge vào `main`. Muốn deploy lại mà không tạo commit: GitHub → **Actions → Verify → Run workflow**:

1. Chọn branch **main**.
2. Bấm **Run workflow**; pipeline dùng GitHub Variables hiện tại.

Workflow cài Node/pnpm đúng pin, install frozen lockfile, kiểm tra application, contact API, blog API và landing origins, types/lint/format/build, model tests và Chromium browser tests, rồi chạy `pnpm exec wrangler deploy` với `PUBLIC_BLOG_API_ORIGIN` từ GitHub Variables. Deploy yêu cầu biến blog API được cấu hình và phải là HTTPS origin hợp lệ.

Khi thành công, Cloudflare có Worker **signapse-landing**. Mở URL `signapse-landing.<account-subdomain>.workers.dev` được in ở deploy log. Kiểm `/`, `/vi`, `/en`, `/fr` (404), `/vi/` (redirect về `/vi`), locale switch, assets và CTA. HTML ở lần deploy này vẫn noindex.

Nếu job bị skipped, kiểm tra đã chọn `main`. Nếu origin validation fail, sửa Variables; nếu deploy fail, kiểm Account ID, quyền token và Workers đã được kích hoạt trong account. Build hoặc tests fail thì bước deploy không chạy.

Không cần nối GitHub với Workers Builds để dùng pipeline này; GitHub Actions đã thực hiện build và deploy.

## 4. Nối signapse.cloud

Trước cutover, ghi lại DNS record apex, Worker routes và redirect rules hiện có trong Cloudflare. IP công khai của domain proxied là IP Cloudflare, không cho biết origin cũ; xem record trong dashboard.

Cloudflare → **Workers & Pages → signapse-landing → Domains → Add Domain** → chọn **signapse.cloud** → để trống subdomain, chọn **Production** → **Add domain**. Với giao diện cũ, chức năng tương ứng nằm tại **Settings → Domains & Routes → Add → Custom Domain**.

Cloudflare tạo record và certificate cho hostname. Nếu apex có CNAME cũ, xử lý record xung đột tại cutover; giữ lại mapping để có thể khôi phục. Không đổi nameservers nếu zone đã active; không sửa records mail hoặc subdomain ứng dụng. [Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/).

Mở [VI](https://signapse.cloud/vi) và [EN](https://signapse.cloud/en); kiểm HTTPS, assets, locale, Contact, Blog và 404. Dashboard chưa mở quyền user access nên không có dashboard CTA/link trên landing; xác nhận Header/Footer không render entry này. Tests trong repo không kiểm backend/auth/Articles của ứng dụng sản phẩm.

## 5. Cấu hình www và HTTPS

Nếu chưa có DNS cho `www`, thêm record **CNAME**, name **www**, target **signapse.cloud**, bật **Proxied**. Nếu đã có record, kiểm tra dịch vụ đang dùng nó trước khi thay.

Trong zone `signapse.cloud` → **Rules → Redirect Rules**, tạo redirect **WWW to apex**:

- Match hostname đúng **www.signapse.cloud**.
- Target dynamic expression: `concat("https://signapse.cloud", http.request.uri.path)`.
- Status **301**, bật **Preserve query string**.

Rule này áp dụng cho cả HTTP/HTTPS của `www`. Rule HTTP apex hiện dùng filter `(http.host eq "signapse.cloud" and not ssl)`, cùng target dynamic expression phía trên, status 301 và giữ query. Các rule chỉ match hai hostname landing. Trường `ssl` xác định kết nối client có mã hoá hay không. [WWW redirect](https://developers.cloudflare.com/rules/url-forwarding/examples/redirect-www-to-root/), [Single Redirects](https://developers.cloudflare.com/rules/url-forwarding/single-redirects/), [ssl field](https://developers.cloudflare.com/ruleset-engine/rules-language/fields/reference/ssl/).

Kiểm `https://www.signapse.cloud/en?source=www` về `https://signapse.cloud/en?source=www`, và `http://signapse.cloud/vi` về HTTPS.

## 6. Bật indexing và đóng hostname phụ

Sau khi domain chính hoạt động và app ở `dashboard.signapse.cloud` đã sẵn sàng, đổi GitHub Variable `PUBLIC_APP_ORIGIN` thành `https://dashboard.signapse.cloud`. Kiểm trực tiếp `/vi/dashboard`, `/en/dashboard`, `/vi/articles`, `/en/articles` trên origin app; ứng dụng đích xử lý đăng nhập. Đổi origin không tự khôi phục dashboard CTA/link trên landing; chỉ thêm lại entry sau khi người dùng cho phép rõ ràng.

Sửa `workers_dev` từ `true` thành `false` trong [wrangler.jsonc](../../wrangler.jsonc), đưa thay đổi lên `main`.

Đổi GitHub Variable `SIGNAPSE_LANDING_INDEXABLE=true` trước khi đưa thay đổi go-live lên `main`; push này tự chạy CI/deploy. Nếu chỉ đổi Variables mà không có code mới, dùng **Run workflow** trên `main` để build/deploy lại. Lần này VI/EN là `index, follow`, canonical/hreflang dùng `https://signapse.cloud`; root `/` tiếp tục noindex.

`preview_urls` đã là `false`. `workers_dev=false` tắt URL production phụ trên workers.dev ở lần deploy này; nó không tự tắt các Preview/Deployment URLs khác nếu account đã tạo chúng riêng. [workers.dev configuration](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/), [Wrangler configuration](https://developers.cloudflare.com/workers/wrangler/configuration/).

## 7. Kiểm sau release và các lần deploy tiếp theo

```powershell
curl.exe -I https://signapse.cloud/vi
curl.exe -I https://signapse.cloud/en
curl.exe -I https://signapse.cloud/vi/
curl.exe -I https://signapse.cloud/fr
curl.exe -I "https://www.signapse.cloud/en?source=www"
```

Kỳ vọng lần lượt: **200**, **200**, redirect về `/vi`, **404**, **301** về apex và giữ query. Xem page source VI/EN để xác nhận robots, canonical và app links; kiểm mobile, keyboard, reduced motion và các demo.

Những lần sau: push/merge vào `main`, theo dõi **Actions → Verify**. CI pass thì pipeline tự deploy. Hiện tại `SIGNAPSE_LANDING_INDEXABLE=false`; chỉ đổi `true` sau bước 6. Đổi GitHub Variables cần một lần build/deploy mới, bằng push `main` hoặc **Run workflow**. Không cần sửa DNS lần nữa. Hosted deployment chỉ được xác nhận khi workflow và kiểm tra domain thật thành công.

Rollback nội dung bằng đưa commit tốt trước đó về `main` rồi chạy workflow với env tương ứng. Nếu lỗi cutover, tháo Custom Domain và khôi phục mapping apex đã lưu. Giữ domain/app env đúng với bản rollback.

## Blog API runtime

`wrangler.jsonc` đặt API dev công khai làm giá trị mặc định cho local preview. Để dùng API origin khác, ghi `PUBLIC_BLOG_API_ORIGIN` vào ignored `.dev.vars` trước khi chạy `pnpm preview`; `scripts/preview.mjs` chuyển biến vào Worker output sau build. Production deploy lấy giá trị riêng từ GitHub Variable và không phụ thuộc `.dev.vars`. Không đặt credential vào biến này: hai GET public không cần xác thực.

Browser suite khởi động HTTP fixture API local và ghi fixture origin tạm thời vào `dist/server/.dev.vars`. Fixture kiểm tra fetch server-side, trạng thái lỗi và freshness; nó không xác nhận deployment hoặc dữ liệu sống của producer. Coordinator xác nhận public origin và API environment trên môi trường nghiệm thu sau khi deploy được authorize.

## Chạy kiểm tra local nếu cần

Dùng Node **24.21.0**, pnpm **10.34.5**. Copy `.env.example` sang ignored `.env` cho build-time settings. Với Worker preview, copy `.dev.vars.example` sang ignored `.dev.vars` và đặt `PUBLIC_BLOG_API_ORIGIN` nếu cần override API dev. Sau đó:

```powershell
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm check
pnpm lint
pnpm format:check
pnpm build
pnpm test
pnpm exec wrangler deploy --dry-run
```

Browser CLI đọc `.env`; process env có ưu tiên cao hơn. Dry-run kiểm Wrangler config/output ở local, không chứng minh token, DNS hoặc hosted deployment.
