# Deploy landing lên signapse.cloud

Stack: **Astro static → GitHub Actions → Cloudflare Workers Static Assets → Custom Domain signapse.cloud**. [Wrangler config](../../wrangler.jsonc), [workflow Verify](../../.github/workflows/ci.yml) và [browser metadata tests](../../tests/e2e/landing.spec.ts) đã được chuẩn bị trong repo.

Deploy chạy khi bấm **Run workflow** trên `main`, sau toàn bộ checks và tests. Push/PR vẫn chạy verification với noindex. Workflow dùng chính `dist/` đã kiểm tra để publish.

## 1. Chốt origin ứng dụng và đưa cấu hình lên main

Landing sẽ sở hữu mọi path trên `signapse.cloud`. Dashboard, authentication và Articles phải có origin ứng dụng thực riêng. Nếu app hiện dùng apex, chuẩn bị origin đó và kế hoạch giữ URL cũ trước bước nối domain. Repo landing không thay đổi ứng dụng sản phẩm.

Origin app hiện tại đã được xác nhận là **https://dev.signapse.cloud**; origin dự kiến khi go-live là **https://dashboard.signapse.cloud**. Dùng dev cho lần thử; chuẩn bị app/DNS/certificate ở dashboard trước khi đổi production origin. Tra DNS công khai ngày 2026-10-05 hiện chưa có record cho `dashboard.signapse.cloud`.

Không đặt `PUBLIC_APP_ORIGIN=https://signapse.cloud` hoặc hostname `www.signapse.cloud` dẫn về landing.

Đưa các thay đổi deploy của lượt này lên nhánh `main` của [signapse-group/signapse-landing](https://github.com/signapse-group/signapse-landing). Nút **Run workflow** cần file workflow có `workflow_dispatch` trên default branch. [GitHub manual workflows](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow).

## 2. Cấu hình Cloudflare credentials và GitHub Variables

Trong Cloudflare, chọn account chứa zone **signapse.cloud** đang active. Copy **Account ID**; đây là account ID, không phải zone ID.

Tạo API token theo template **Edit Cloudflare Workers**, giới hạn account triển khai và zone `signapse.cloud`. Lưu token vào GitHub Secrets. [Cloudflare GitHub Actions authentication](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/).

Trong repository GitHub → **Settings → Secrets and variables → Actions**, tạo:

| Tab | Tên | Giá trị |
| --- | --- | --- |
| Secrets | `CLOUDFLARE_API_TOKEN` | API token vừa tạo. |
| Secrets | `CLOUDFLARE_ACCOUNT_ID` | Account ID chứa Worker và zone. |
| Variables | `PUBLIC_APP_ORIGIN` | Lần thử: `https://dev.signapse.cloud`; go-live: `https://dashboard.signapse.cloud` sau khi app đã hoạt động. |
| Variables | `SIGNAPSE_PUBLIC_ORIGIN` | `https://signapse.cloud` |

Workflow tự đặt `SIGNAPSE_VERCEL_ANALYTICS=false`. Biến `SIGNAPSE_LANDING_INDEXABLE` do checkbox của **Run workflow** quyết định; không cần thêm variable cùng tên. Origins được dùng khi build, không phải Worker runtime variables.

## 3. Deploy lần đầu với noindex

GitHub → **Actions → Verify → Run workflow**:

1. Chọn branch **main**.
2. Giữ **Allow indexing after signapse.cloud is connected** tắt.
3. Bấm **Run workflow**.

Workflow cài Node/pnpm đúng pin, install frozen lockfile, kiểm tra origins, types/lint/format/build, model tests và Chromium browser tests, rồi chạy `pnpm exec wrangler deploy`.

Khi thành công, Cloudflare có Worker **signapse-landing**. Mở URL `signapse-landing.<account-subdomain>.workers.dev` được in ở deploy log. Kiểm `/`, `/vi`, `/en`, `/fr` (404), `/vi/` (redirect về `/vi`), locale switch, assets và CTA. HTML ở lần deploy này vẫn noindex.

Nếu job bị skipped, kiểm tra đã chọn `main`. Nếu origin validation fail, sửa Variables; nếu deploy fail, kiểm Account ID, quyền token và Workers đã được kích hoạt trong account. Build hoặc tests fail thì bước deploy không chạy.

Không cần nối GitHub với Workers Builds để dùng pipeline này; GitHub Actions đã thực hiện build và deploy.

## 4. Nối signapse.cloud

Trước cutover, ghi lại DNS record apex, Worker routes và redirect rules hiện có trong Cloudflare. IP công khai của domain proxied là IP Cloudflare, không cho biết origin cũ; xem record trong dashboard.

Cloudflare → **Workers & Pages → signapse-landing → Settings → Domains & Routes → Add → Custom Domain** → nhập **signapse.cloud** → **Add Custom Domain**.

Cloudflare tạo record và certificate cho hostname. Nếu apex có CNAME cũ, xử lý record xung đột tại cutover; giữ lại mapping để có thể khôi phục. Không đổi nameservers nếu zone đã active; không sửa records mail hoặc subdomain ứng dụng. [Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/).

Mở [VI](https://signapse.cloud/vi) và [EN](https://signapse.cloud/en); kiểm HTTPS, assets, locale, CTA và 404. Đích dashboard/Articles cần kiểm thực tế riêng: tests trong repo intercept navigation và không kiểm backend/auth.

## 5. Cấu hình www và HTTPS

Nếu chưa có DNS cho `www`, thêm record **CNAME**, name **www**, target **signapse.cloud**, bật **Proxied**. Nếu đã có record, kiểm tra dịch vụ đang dùng nó trước khi thay.

Trong zone `signapse.cloud` → **Rules → Redirect Rules**, tạo redirect **WWW to apex**:

- Match hostname đúng **www.signapse.cloud**.
- Target dynamic expression: `concat("https://signapse.cloud", http.request.uri.path)`.
- Status **301**, bật **Preserve query string**.

Rule này áp dụng cho cả HTTP/HTTPS của `www`. Với HTTP apex, tạo thêm rule wildcard `http://signapse.cloud/*` → `https://signapse.cloud/${1}`, status 301, giữ query. Các rule chỉ match hai hostname landing. [WWW redirect](https://developers.cloudflare.com/rules/url-forwarding/examples/redirect-www-to-root/), [Single Redirects](https://developers.cloudflare.com/rules/url-forwarding/single-redirects/).

Kiểm `https://www.signapse.cloud/en?source=www` về `https://signapse.cloud/en?source=www`, và `http://signapse.cloud/vi` về HTTPS.

## 6. Bật indexing và đóng hostname phụ

Sau khi domain chính hoạt động và app ở `dashboard.signapse.cloud` đã sẵn sàng, đổi GitHub Variable `PUBLIC_APP_ORIGIN` thành `https://dashboard.signapse.cloud`. Kiểm trực tiếp `/vi/dashboard`, `/en/dashboard`, `/vi/articles`, `/en/articles` trên origin app; ứng dụng đích xử lý đăng nhập.

Sửa `workers_dev` từ `true` thành `false` trong [wrangler.jsonc](../../wrangler.jsonc), đưa thay đổi lên `main`.

GitHub → **Actions → Verify → Run workflow**, chọn **main**, bật **Allow indexing after signapse.cloud is connected**, chạy lại. Lần này VI/EN là `index, follow`, canonical/hreflang dùng `https://signapse.cloud`; root `/` tiếp tục noindex.

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

Những lần sau: đưa thay đổi lên `main`, mở **Run workflow**, bật indexing rồi deploy. Không cần sửa DNS lần nữa. Hosted deployment chỉ được xác nhận khi workflow và kiểm tra domain thật thành công.

Rollback nội dung bằng đưa commit tốt trước đó về `main` rồi chạy workflow với env tương ứng. Nếu lỗi cutover, tháo Custom Domain và khôi phục mapping apex đã lưu. Giữ domain/app env đúng với bản rollback.

## Chạy kiểm tra local nếu cần

Dùng Node **24.21.0**, pnpm **10.34.5**. Copy `.env.example` sang ignored `.env`, điền origins HTTPS và indexability đúng chế độ muốn kiểm, sau đó:

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
