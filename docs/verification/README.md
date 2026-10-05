# Kiểm chứng landing Astro

Repo này là nguồn chuẩn của landing đã được người dùng xác nhận ngày **2026-10-04**. Kiểm chứng dựa trên [contract hiện hành](../design/LANDING.md), code và tests trong repo. [README](../../README.md) mô tả cách chạy; [summary.json](summary.json) ghi kết quả local gần nhất.

## Checks và bằng chứng

| Nhóm              | Cách kiểm chứng                                                                                                   |
| ----------------- | ----------------------------------------------------------------------------------------------------------------- |
| Toolchain         | Node 24.21.0 / pnpm 10.34.5 theo pin repository                                                                   |
| Source/config     | `pnpm check`, `pnpm lint`, `pnpm format:check`, `pnpm build`                                                      |
| Models            | `pnpm test:models`: 14 tests, 4 suites cho timeline/stream/tick/cursor và Telegram VI/EN                          |
| Browser           | `pnpm test:browser`: 31 tests Chromium trên production preview; [kết quả](browser-results.json)                   |
| Ảnh               | [capture report](preview/results.json), [capture script](capture-preview.mjs); 30 ảnh VI/EN của chính landing này |
| Boundary 1024     | [Report](preview/boundary-1024.json), hai locale, bốn sticky stages                                               |
| Theme             | [OS/class dark isolation](preview/theme-isolation.json)                                                           |
| Env               | [Policy report](environment-policy.json): canonical/hreflang, indexable validation, app URLs và analytics default |
| Runtime preview   | [Smoke](final-preview-smoke.json): root/VI/EN, robots và metadata                                                 |
| Cleanup           | [Audit](cleanup-audit.json): copy còn dùng giữ nguyên, bytes runtime assets giữ nguyên, liên kết tài liệu hợp lệ  |
| Native visibility | [Diagnostic](native-visibility.json): giới hạn của automation khi đổi tab/window                                  |

Model và browser tests assert hành vi thay vì dùng screenshot equality làm gate. Build có cảnh báo kích thước dynamic Three chunk; renderer chỉ được tải khi cần.

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
| App/contact         | Dashboard và Articles đúng origin/locale; Hero `#access`, footer mailto                                              |
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

Playwright tự mở production preview khi chưa có server. Để chụp ảnh, mở preview trong terminal riêng rồi chạy:

```powershell
pnpm preview --host 127.0.0.1 --port 4321
node docs/verification/capture-preview.mjs http://127.0.0.1:4321
```

Script chỉ dùng source/dependencies của repo này và một origin landing. Ảnh chụp ở reduced-motion final state, lỗi browser/HTTP và overflow được ghi vào report. Cập nhật ảnh/report khi contract hoặc giao diện thay đổi.

Trace/HTML report nằm trong ignored `test-results/`; chạy `pnpm exec playwright show-report test-results/report` để xem lần mới nhất. JSON trong thư mục này là bằng chứng được lưu; attachment paths bên trong browser report có thể trỏ tới artifact ignored đã được thay thế ở lần chạy sau.

- [VI Hero](preview/vi-desktop-hero.png), [EN Hero](preview/en-desktop-hero.png).
- [Graph](preview/en-desktop-knowledge-graph.png), [Chart](preview/en-desktop-market-chart.png), [AI](preview/en-desktop-ai-conversation.png), [Telegram](preview/en-desktop-scheduled-telegram.png).
- [Mobile](preview/vi-mobile-full.png), [noJS](preview/en-nojs-full.png).

## Giới hạn kiểm chứng

Pause/resume được assert qua controlled `visibilitychange` trong Chromium. Diagnostic Edge headed vẫn thấy document `visible` khi đổi tab/window, nên không chứng minh native hidden-tab hoặc GPU throttling vật lý. CSS zoom và mobile emulation không đại diện mọi thiết bị.

Navigation tests intercept đích ứng dụng sản phẩm, không kiểm auth/backend/Articles tại đích. Origin trong env policy là fixture. Analytics ingestion, request-language negotiation, domain redirects, hosted CI và deployment cần kiểm trên hosting thực tế.
