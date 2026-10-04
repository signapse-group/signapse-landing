# Kiến trúc landing Astro

## Ownership

| Trách nhiệm                   | Source trong repo                                                                                                                                    |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Static routes VI/EN           | src/pages/[lang]/index.astro, SUPPORTED_LOCALES trong src/i18n/config.ts                                                                             |
| Root entry                    | src/pages/index.astro, landing tiếng Việt; noindex để tránh duplicate                                                                                |
| HTML/head/analytics           | src/layouts/BaseLayout.astro, src/lib/landing-metadata.ts                                                                                            |
| Bố cục/static copy            | src/components/landing/LandingPage.astro                                                                                                             |
| Header/menu/locale            | landing-header.tsx, landing-header-shell.tsx, landing-navigation-disclosure.tsx, landing-locale-links.tsx                                            |
| Capability/deep links         | landing-capability-strip.tsx, native details trước hydration, Base UI Popover sau hydration                                                          |
| Hero decoration               | LandingCurrencyBackground.astro; SVG glyph tiền tệ tĩnh, aria-hidden                                                                                 |
| Hero WebGL                    | landing-context-figure.tsx + CSS module; SVG cùng footprint, Three.js dynamic import                                                                 |
| Showcase chung                | landing-feature-showcase.tsx + CSS module; ownership active step/scroll và progress refs                                                             |
| Bốn demo                      | landing-knowledge-graph-demo*, landing-market-chart-demo*, landing-ai-conversation-_, landing-scheduled-telegram-demo_, landing-telegram-windows.tsx |
| Playback conditions           | landing-playback.ts; viewport, active, document visibility và reduced motion                                                                         |
| Audience                      | landing-audience-section.tsx, landing-audience-figure.tsx; four choices, canvas + SVG fallback                                                       |
| Provider/footer/CTA           | LandingProviderMarquee.astro, LandingFooter.astro, LandingActionButton.astro, landing-access.ts                                                      |
| External app URLs/locale URLs | src/i18n/routing.ts; appHref/withLocalePath/buildLandingLocaleHref                                                                                   |
| Copy                          | src/i18n/messages.ts; typed VI/EN, fixture labels và metadata                                                                                        |
| Tokens/font faces             | src/components/landing/landing-page.module.css, src/styles/global.css, src/styles/fonts.css                                                          |
| Verification                  | tests/models/, tests/e2e/, playwright.config.ts                                                                                                      |

## Rendering và hydration

Astro prerender HTML ở build time. Header và capability dùng client:load để navigation/deep link sẵn sàng sớm. Context, Audience và showcase dùng client:idle, giữ SSR hoàn chỉnh; observer bên trong quyết định tải/run khi cần. Không phụ thuộc directive client:visible vì browser thiếu IntersectionObserver vẫn cần fallback không lỗi.

Header dùng native details/summary nên menu cơ bản dùng được trước hydration. Capability dùng native details ở SSR/noJS và cùng dictionary để dựng Popover sau hydration. Showcase SSR giữ bốn copy/proof trong luồng tự nhiên; khi có observer, desktop từ 1024px dùng một vị trí sticky cho demo active. AI/Telegram runner tải bằng dynamic import bên trong showcase; code preview tồn tại khi đang tải hoặc tải lỗi.

## Demo và playback

Dữ liệu mẫu và timeline là source trực tiếp trong repo. Không fetch backend hoặc tạo tác động gửi tin/giao dịch. Các form minh họa inert; Market Chart có nút đóng detail, còn step selection và Hero interaction là các controls thực.

| Demo               | Chu kỳ    | Các trạng thái chính                                                                              |
| ------------------ | --------- | ------------------------------------------------------------------------------------------------- |
| Knowledge Graph    | 22.5 giây | Ingestion → extracting/resolving/linking → graph updated → inspect narrative/event/news.          |
| Market Chart       | 26 giây   | Tick giá mỗi 0.5 giây → nguồn tin/annotation → detail → ba outcome.                               |
| AI Conversation    | 27 giây   | Hai lượt nhập/gửi câu hỏi, thinking, streamed response, evidence/scenarios và complete.           |
| Scheduled Telegram | 20 giây   | Chọn asset/time/language → schedule → analysis → sending/delivered, giữ final state từ 12.2 giây. |

canPlay = active && inView && pageVisible && !reducedMotion. Ngưỡng observer renderer là 0.2. Graph/AI/Telegram reset clock khi inactive/offscreen; tab visibility pause/resume giữ elapsed. Market Chart giữ elapsed qua pause/reselection. Tiến trình badge dùng clock playback; không chuyển thành scroll progress.

Reduced motion giữ final proof, không autoplay. Không IntersectionObserver giữ toàn bộ proof trong natural flow. Các effect cleanup animation controls, observers, listeners và requestAnimationFrame. Three renderer cap pixel ratio ở 1.75, dừng khi ngoài viewport/tab ẩn hoặc reduced-motion idle, dispose geometry/material/texture/renderer.

## Assets và integration

public/ chỉ chứa logo, favicon, provider SVG + NOTICE, Telegram icon, WOFF2 + OFL và social PNG. Font được self-host; font-face declarations là nguồn cấu hình, không cần tải font từ app khác. Hai social card 1200×630 theo locale nằm trong public/social/; cập nhật ở đây khi brand/metadata đổi.

PUBLIC_APP_ORIGIN là origin ứng dụng sản phẩm, không phải origin landing. Dashboard và Articles mở trên origin đó; auth nằm ở ứng dụng đích. SIGNAPSE_PUBLIC_ORIGIN và SIGNAPSE_LANDING_INDEXABLE kiểm soát metadata tại build time; env thật nằm ngoài Git. Vercel integrations chỉ bật khi hosting có endpoints tương ứng.
