# Kiểm chứng landing Astro

Repo này giữ implementation và bằng chứng chạy landing; baseline đã được người dùng xác nhận ngày **2026-10-04**. Kiểm chứng dựa trên task/AC và [contract tại planning](../../../signapse-planing/ui-design/references/landing/LANDING.md), code và tests trong repo. [README](../../README.md) mô tả cách chạy; [summary.json](summary.json) ghi kết quả local gần nhất.

## Checks và bằng chứng

| Nhóm              | Cách kiểm chứng                                                                                                   |
| ----------------- | ----------------------------------------------------------------------------------------------------------------- |
| Toolchain         | Node 24.21.0 / pnpm 10.34.5 theo pin repository                                                                   |
| Source/config     | `pnpm check`, `pnpm lint`, `pnpm format:check`, `pnpm build`                                                      |
| Models            | `pnpm test:models`: 14 tests, 4 suites cho timeline/stream/tick/cursor và Telegram VI/EN                          |
| Browser           | `pnpm test:browser`: browser coverage Chromium trên Cloudflare Worker production preview; [kết quả](browser-results.json) |
| Blog SIGN-136     | [Handoff/evidence local](public-blog/sign-136/README.md): SSR/API fixture coverage, design captures và giới hạn xác nhận |
| Ảnh               | [capture report](preview/results.json), [capture script](capture-preview.mjs); [contact VI](preview/contact-form-vi-desktop.png) và [contact EN](preview/contact-form-en-desktop.png) được chụp từ built output ở 1440 px |
| Boundary 1024     | [Report](preview/boundary-1024.json), hai locale, bốn sticky stages                                               |
| Theme             | [OS/class dark isolation](preview/theme-isolation.json)                                                           |
| Env               | [Policy report](environment-policy.json): canonical/hreflang, indexable validation, app URLs và analytics default |
| Runtime preview   | [Smoke](final-preview-smoke.json): root/VI/EN, robots và metadata                                                 |
| Cloudflare release | [Local checks](cloudflare-release-local.json): source checks, 14 model tests, 31 browser tests production, 3 metadata tests preview và validation origins |
| Cloudflare routing | [Wrangler local](cloudflare-local-routing.json): 10 endpoint checks, URL không slash cuối và 404 thật; không phải hosted deployment |
| Cloudflare hosted | [Release 2026-10-05](cloudflare-hosted-release.json): main deploy qua GitHub Actions, Custom Domain, nội dung khớp Workers, metadata/assets và redirects; [ảnh domain thật](signapse-cloud-desktop.png) |
| Cloudflare hosted mới nhất | [Release 2026-10-07](cloudflare-hosted-release-2026-10-07.json): main `2ea7124`, nội dung VI/EN mới khớp Workers, 12 assets và redirects; CI success với 30 browser tests pass ngay, 1 pass sau retry |
| Cleanup           | [Audit](cleanup-audit.json): copy còn dùng giữ nguyên, bytes runtime assets giữ nguyên, liên kết tài liệu hợp lệ  |
| Native visibility | [Diagnostic](native-visibility.json): giới hạn của automation khi đổi tab/window                                  |

Model và browser tests assert hành vi thay vì dùng screenshot equality làm gate. Build có cảnh báo kích thước dynamic Three chunk; renderer chỉ được tải khi cần.

Blog SSR coverage dùng fixture API HTTP cục bộ qua chính server-to-API fetch path của Worker preview. Nó kiểm tra status/HTML/metadata, `no-store`, pagination và locale links trong HTML không JavaScript, renderer structured content v1, empty/missing/nonpublic/upstream/schema states, ảnh lỗi, cập nhật trạng thái khi đọc lại, navigation từ menu đến list/page/detail/locale/home, mobile overflow và axe. Browser runner tạm ghi fixture origin vào `dist/server/.dev.vars` rồi khôi phục trạng thái trước test; fixture không xác nhận producer deployment hoặc live content. Handoff cho SIGN-136 lưu thời gian chạy và evidence folder dưới Symphony evidence root khi các gate hoàn tất.

Ngày **2026-10-07**, cập nhật placeholder tên/email/lời nhắn VI/EN theo yêu cầu người dùng. Node 24.21.0 / pnpm 10.34.5: check, lint, format:check và build pass; 8 browser tests liên quan pass, không retry, trên built preview với API mock. Phạm vi gồm labels/placeholders và giá trị ban đầu rỗng, validation/focus/axe, payload/201, no-JS email path, responsive 375/768/1024/1440 px và zoom 200%. Chạy lại bằng `pnpm test:browser --grep 'contact form exposes labels|contact form sends the producer|contact form keeps a useful|contact layout fits'`. Hai ảnh contact desktop được cập nhật; ảnh EN được chụp lại trên page mới sau khi đợi paint ổn định vì capture ngay sau vòng zoom chưa paint đủ nền/viền. Lượt này kiểm chứng local UI, không xác nhận backend thật hoặc hosted deployment.

Lượt chuẩn bị Cloudflare ngày 2026-10-05 dùng Node 24.21.0 / pnpm 10.34.5 / Wrangler 4.143.0, public origin `https://signapse.cloud` và application origin fixture `https://app.example.test`. Browser navigation vẫn intercept app; kết quả không xác nhận dev/dashboard backend. Wrangler config pin compatibility date 2026-10-03 phù hợp runtime local. Hướng dẫn release ở [deploy signapse.cloud](../deployment/signapse-cloud.md).

Hosted release ngày 2026-10-05 dùng commit `0095df9` trên `main`, application origin thực `https://dev.signapse.cloud` và noindex. [Workflow 37306184240](https://github.com/signapse-group/signapse-landing/actions/runs/37306184240) đã pass checks/build, 14 model tests và 31 browser tests trước deploy. Kiểm tra HTTP trên domain thật xác nhận HTTPS, canonical VI/EN, assets, 404, redirect slash/www/HTTP và nội dung khớp Workers. Dashboard VI mở được trong phiên Chrome đăng nhập; HTTP tự động không có session tới app trả 429. Auth/backend và các trang ứng dụng còn lại chưa được kiểm chứng.

Hosted release ngày 2026-10-07 dùng commit `2ea7124`, giữ app origin dev và noindex. [Workflow 37591390406](https://github.com/signapse-group/signapse-landing/actions/runs/37591390406) kết thúc success: source checks/build, 14 model tests, 30 browser tests pass ngay và 1 test reset Graph/Telegram pass sau retry. Kiểm tra sau deploy xác nhận nội dung welcome mới trong VI/EN, output khớp Workers, 12 assets, 404 và 5 redirects. Lỗi assertion trạng thái `incoming` ở lần chạy đầu được ghi trong report; chưa kết luận nguyên nhân. Lượt này không kiểm lại auth/backend ứng dụng.

## Ma trận browser

| Surface/hành vi     | Điều kiện kiểm tra                                                                                                   |
| ------------------- | -------------------------------------------------------------------------------------------------------------------- |
| VI/EN responsive    | 1440×900, 768×1024, 375×800, 1440×620; bốn demo đọc được, không horizontal overflow                                  |
| Boundary desktop    | 1024×768, hai locale; sticky stages và hai Telegram panels                                                           |
| Root/routing        | Landing VI, noindex; locale switch giữ query/hash; unsupported `/fr` 404                                             |
| Desktop navigation  | Hover submenu, keyboard Enter/Escape, focus restore, outside click, anchor selection                                 |
| Mobile navigation   | Native details Enter/touch, group/submenu, chọn capability, close và viewport containment                            |
| Locale/URL          | VI↔EN, encoded query, lang/hreflang, supported hashes; hash ngoài contract bị bỏ; không locale cookie                |
| Capability          | Năm popover, Enter/Space/Escape/focus restore, touch toggle, deep links/footer links, noJS native details            |
| App/contact         | Dashboard đúng origin/locale; Hero `#access`, footer mailto; public Blog dùng route landing riêng                  |
| Form liên hệ        | VI/EN labels/placeholders đúng locale và giá trị ban đầu rỗng; validation, JSON body/locale, 201 rỗng, 400/413/415/429/500, network/body failure, duplicate submit, no-JS và responsive; API mock nằm ở consumer boundary |
| Showcase            | Scroll hai hướng, ArrowUp/Down/Home/End, buttons/focus, progress theo playback                                       |
| Graph               | Ingestion/relationship phases, final inspector, animated incoming/restart và model order                             |
| Chart               | Tick 500 ms, annotation trước outcome, final frame, nút đóng event detail                                            |
| AI                  | Typing/submission/thinking/streaming, follow-up/scenario/complete, composer và static transcript                     |
| Telegram            | Asset/time/language/menu/cursor/analysis/sending/delivered; restart, VI/EN output độc lập locale trang, mobile/short |
| Lifecycle           | Pause khi inactive/offscreen/tab hidden; re-entry/reset policies; controlled visibilitychange pause/resume           |
| Hero/Audience       | Keyboard/pointer interaction, bốn Audience choices, SVG/WebGL ready/fallback, reduced idle                           |
| Fallback            | JavaScript tắt, WebGL blocked, thiếu IntersectionObserver: HTML/proofs/navigation và natural flow                    |
| Accessibility/theme | Axe VI/EN và bốn demo, reduced motion, skip link, CSS zoom 200%, OS/class dark palette                               |
| Runtime errors      | Không pageerror, console error, hydration mismatch, font/asset HTTP failure trong các browser journeys               |

## Tái tạo bằng chứng

```powershell
pnpm check
pnpm lint
pnpm format:check
pnpm build
pnpm test
```

Playwright tự mở production preview khi chưa có server. Các test blog khởi chạy fixture HTTP API tự động; `pnpm preview` dùng Cloudflare Worker SSR. Để chụp ảnh landing, mở preview trong terminal riêng rồi chạy:

```powershell
pnpm preview --host 127.0.0.1 --port 4321
node docs/verification/capture-preview.mjs http://127.0.0.1:4321
```

Script chỉ dùng source/dependencies của repo này và một origin landing. Ảnh chụp ở reduced-motion final state, lỗi browser/HTTP và overflow được ghi vào report. Cập nhật ảnh/report khi contract hoặc giao diện thay đổi.

Trace/HTML report nằm trong ignored `test-results/`; chạy `pnpm exec playwright show-report test-results/report` để xem lần mới nhất. JSON trong thư mục này là bằng chứng được lưu; attachment paths bên trong browser report có thể trỏ tới artifact ignored đã được thay thế ở lần chạy sau.

- [VI Hero](preview/vi-desktop-hero.png), [EN Hero](preview/en-desktop-hero.png).
- [Graph](preview/en-desktop-knowledge-graph.png), [Chart](preview/en-desktop-market-chart.png), [AI](preview/en-desktop-ai-conversation.png), [Telegram](preview/en-desktop-scheduled-telegram.png).
- [Contact form VI](preview/contact-form-vi-desktop.png), [Contact form EN](preview/contact-form-en-desktop.png) (`#access`, 1440 px).
- [Mobile](preview/vi-mobile-full.png), [noJS](preview/en-nojs-full.png).

## Giới hạn kiểm chứng

Pause/resume được assert qua controlled `visibilitychange` trong Chromium. Diagnostic Edge headed vẫn thấy document `visible` khi đổi tab/window, nên không chứng minh native hidden-tab hoặc GPU throttling vật lý. CSS zoom và mobile emulation không đại diện mọi thiết bị.

Navigation tests intercept đích ứng dụng sản phẩm, không kiểm auth/backend/Articles tại đích. Contact form tests intercept API tại consumer boundary; chúng không thay thế OpenAPI/CORS check hoặc xác nhận record trên producer. `PUBLIC_CONTACT_API_ORIGIN` phải là origin HTTPS riêng với `PUBLIC_APP_ORIGIN`, và landing origin thực phải nằm trong CORS policy của producer. Analytics ingestion, request-language negotiation, domain redirects, hosted CI và deployment cần kiểm trên hosting thực tế.
