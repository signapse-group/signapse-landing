# Signapse Landing

Repository Astro này là **source of truth** của landing Signapse: giao diện, nội dung VI/EN, assets và các demo. Bản hiện tại đã được người dùng xác nhận ngày **2026-10-04**. Mọi thay đổi landing được thực hiện và kiểm chứng tại đây.

Astro dựng HTML tĩnh cho `/`, `/vi` và `/en`; root hiển thị tiếng Việt. React islands sở hữu header/capability, Hero WebGL, bốn demo và Audience. Nội dung SSR, SVG fallback và native navigation vẫn hữu ích khi JavaScript hoặc WebGL không khả dụng. Các demo dùng dữ liệu mẫu và timeline trong repo, không gọi backend.

Đọc [mục lục tài liệu](docs/README.md), [contract landing](docs/design/LANDING.md), [kiến trúc](docs/architecture.md) và [kiểm chứng](docs/verification/README.md). Source nằm trong `src/`, runtime assets trong `public/`, model/browser tests trong `tests/`.

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

## Kiểm tra

| Lệnh                | Mục đích                                                                                          |
| ------------------- | ------------------------------------------------------------------------------------------------- |
| `pnpm check`        | Astro / strict TypeScript                                                                         |
| `pnpm lint`         | Source/config ESLint                                                                              |
| `pnpm format:check` | Format source/config/test; loại docs và runtime assets                                            |
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

Playwright tự mở `pnpm preview` tại 4321 khi chưa có server. Có thể đổi port bằng `PLAYWRIGHT_PORT`; nếu build dùng origin app khác, đặt `PLAYWRIGHT_APP_ORIGIN` khớp env build. Navigation tests intercept đích dashboard/Articles để kiểm URL và locale mà không yêu cầu backend. Trace/report và kết quả JSON nằm trong ignored `test-results/`.

CI khai báo install frozen, check/lint/format/build, model tests và browser tests. [Verification](docs/verification/README.md) lưu kết quả và giới hạn của các lần chạy thực tế. Chụp lại ảnh của landing bằng `node docs/verification/capture-preview.mjs http://127.0.0.1:4321` khi production preview đang chạy; script dùng riêng repo này.

Fonts Geist, Geist Mono và Inter được self-host; giấy phép đi kèm trong `public/fonts/`. Provider assets có NOTICE trong `public/images/providers/`.
