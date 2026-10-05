# Signapse Public Landing Contract

Trạng thái: implementation Astro đã được người dùng xác nhận ngày **2026-10-04**. Repository này sở hữu code, copy, assets, giao diện và hành vi landing. [Architecture](../architecture.md) mô tả ownership theo file; [verification](../verification/README.md) mô tả kiểm tra. Quyết định mới của người dùng được ưu tiên; mọi thay đổi contract phải cập nhật source/tài liệu/test tương ứng.

## Routes và nội dung

- Landing công khai tại /vi và /en; root / là entry tiếng Việt tĩnh.
- SUPPORTED_LOCALES và Locale trong src/i18n/config.ts là khai báo locale duy nhất.
- src/i18n/messages.ts là nguồn copy/fixture labels/accessible text/metadata của cả hai locale, cùng typed shape. Không giữ một bản marketing copy cạnh tranh trong docs.
- Trang chỉ có một h1, skip link tới main-content và landmarks có tên. Nội dung quan trọng render trong HTML build; JavaScript là enhancement.

## Bố cục hiện hành

| Thứ tự | Vùng                           | Hành vi/source                                                                                                                                       |
| ------ | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1      | Header                         | Logo, ba mega-menu desktop hoặc native mobile disclosure, contact, dashboard CTA, locale menu. Sticky surface đổi theo section đang nằm dưới header. |
| 2      | Hero (#top)                    | H1/supporting copy, Contact → #access, một proof AI; Context Figure; SVG nền glyph tiền tệ tĩnh.                                                     |
| 3      | Capability (#capability-strip) | MARKET VIEW, IMPACT GRAPH, AI CONVERSATION, TELEGRAM, STRATEGY CODING; năm outcome/body popover.                                                     |
| 4      | Showcase (#showcase)           | Bốn bước: Knowledge Graph → Market Chart → AI Conversation → Scheduled Telegram. Mỗi bước có label/title/body và proof bằng code.                    |
| 5      | Audience (#audiences)          | Bốn lựa chọn trader/analyst/strategy developer/team & fund; nội dung localized và graph figure thích ứng.                                            |
| 6      | Providers (#trust)             | OpenAI, Gemini, Anthropic, DeepSeek, Groq, Z.AI; logo marquee và nội dung integration.                                                               |
| 7      | Final CTA (#access)            | Outcome/copy của locale và nút dashboard.                                                                                                            |
| 8      | Footer                         | Brand/description, năm capability anchors, contact, dashboard, email và disclaimer.                                                                  |

Không thêm section, claim, form, placeholder hoặc screenshot thay renderer chỉ để làm đầy bố cục. Các mục roadmap trong menu giữ trạng thái disabled có nhãn; chỉ bật khi có destination thực được chốt.

## Navigation và CTA

Mọi CTA vào sản phẩm dẫn thẳng tới {PUBLIC_APP_ORIGIN}/{locale}/dashboard; không đọc phiên đăng nhập. Articles dẫn tới {PUBLIC_APP_ORIGIN}/{locale}/articles. Landing không sở hữu auth/Articles hoặc yêu cầu application checkout để chạy. Hero/contact links tới #access; mailto access@signapse.cloud giữ chức năng liên hệ.

Năm capability anchors: #knowledge-graph, #live-charts, #ai-assistant, #telegram, #strategy-coding. Click menu/footer và URL trực tiếp mở đúng detail. Desktop hỗ trợ hover giữ nội dung khi pointer vào popup; touch toggle; Enter/Space mở, Escape đóng và trả focus. Một popup tại một thời điểm, không đổi chiều cao Hero. Native details giữ nội dung trước hydration/noJS.

Locale switch giữ query và các hash trong SUPPORTED_LANDING_HASHES: top, capability-strip, năm capability, trust, access. Hash ngoài tập này bị bỏ. URL locale là source of truth, không ghi cookie locale. Locale links có lang/hreflang/aria-current; JavaScript đọc query/hash hiện tại, SSR/noJS giữ link locale cơ bản.

Audience anchors: #audience-trader, #audience-analyst, #audience-strategy-developer, #audience-team-fund. Direct hash chọn đúng audience. Native buttons hỗ trợ Tab và Enter/Space; lựa chọn/scroll không áp đặt một focus model mới.

## Showcase và demo

Bốn demo nằm trong một React island. Giữ renderer DOM/SVG, fixture, timeline và controls theo model trong repo; chỉ nhãn/nội dung demo định nghĩa ở dictionary. Không dùng ảnh chụp, placeholder, backend hoặc một renderer đơn giản hơn thay proof bằng code. Demo được nhận diện rõ là nội dung mẫu.

Từ 1024px, copy cuộn bên trái và active stage ở cùng vị trí sticky bên phải. Không dùng height threshold để tắt sticky; stage thích ứng cửa sổ thấp. Copy measure tối đa 22rem, title desktop 20px, body 15px; badge số nối bằng đường nét đứt. Dưới 1024px, copy và proof từng bước liên tiếp; không scroll-lock hoặc scale toàn bộ chữ. Thiếu JavaScript/IntersectionObserver: natural flow với đủ bốn proof.

Step buttons dùng aria-current=step và aria-controls/labelled region; không tablist/tabpanel. Click/Tab/Enter/Space và ArrowUp/Down/Home/End được hỗ trợ. Scroll lựa chọn bước không lấy focus. Progress quanh badge theo thời gian playback.

Graph/Chart SSR render final frame và inspector/detail hữu ích; AI giữ transcript bằng code, Telegram giữ schedule/message trong cùng browser frame. Runner và decorative loops dừng theo active/viewport/tab visibility; reduced motion giữ final frame. Pause/re-entry policy và timing theo [architecture](../architecture.md) và các model files.

Telegram dùng browser chrome chung, hai panel Signapse/Telegram. Panel cạnh nhau khi container đạt 38rem, nếu hẹp thì xếp dọc. Chỉ outer browser có shadow. Form minh họa inert: label 11px, control text 12px, height 28px; không sửa generic UI primitives vì ngoại lệ demo. Desktop browser content tối thiểu 31rem; phần dư ở cửa sổ thấp tiếp tục trong natural scroll, không cắt bản tin. Cursor gắn vị trí control thật trong DOM minh họa.

## Visual và assets

Tokens nằm trong landing-page.module.css, palette navy #03141D / surface #08232E, mint #12D6B1 / strong #006F66, white #FFFFFF, muted #A6C4BF, boundary #3C6A70. Header/Hero/Audience/final CTA/footer là dark family; showcase/provider là light family. Palette cố định, không đọc/ghi theme preference. Logo/Three colors chọn theo surface; không chuyển màu theo OS theme.

Geist, Geist Mono và Inter tự host từ public/fonts/; font faces/fallback metrics trong src/styles/fonts.css. Giữ typography, spacing, border, shadow và CSS module của implementation hiện tại. Glyph tiền tệ trong Hero là texture decorative tĩnh, aria-hidden/focusable=false, không phải dữ liệu live.

Hero Context Figure biểu diễn hai góc nhìn graph/price bổ sung, có localized summary và SVG fallback cùng footprint. Enter/Space đổi mode; arrows xoay; fine pointer hover preview/click pin/drag. Three.js dynamic enhancement không thay accessible content; cleanup đầy đủ và bounded frames.

Chỉ runtime brand/provider/icon/font/social assets vào public/. Provider và font licenses/NOTICE phải được giữ. Screenshots phục vụ verification ở docs/verification/preview/, tách khỏi runtime assets.

## Accessibility, metadata và hosting

- Không page-level overflow ở 375/768/1024/1440px, cửa sổ thấp và zoom; copy/control reflow, không cắt demo.
- Native controls có localized accessible name, focus-visible rõ, keyboard/Escape/touch phù hợp; không dựa chỉ vào màu/hover.
- Canvas/geometry decorative ẩn khỏi accessibility tree; summary hữu ích tồn tại khi không có GPU hoặc JavaScript.
- Reduced motion giữ toàn bộ ý nghĩa; provider và playback không autoplay. Không hydration mismatch hoặc asset/font errors mới.
- Metadata/lang/title/description/social alt từ dictionary. Preview noindex; explicit HTTPS landing origin mới sinh canonical/hreflang/OG absolute URL. Indexable build thiếu valid origin phải fail; root luôn noindex.
- Social card brand-only 1200×630 ở public/social/{locale}.png. Analytics default off, chỉ bật khi endpoints hosting đã được cấu hình.
- Accept-Language theo request và domain redirects/cutover là hosting scope; static output không ngầm tuyên bố hỗ trợ chúng.

## Kiểm chứng khi thay đổi

Chạy check/lint/format/build cho source/config. Chạy browser coverage của menu/locale/CTA/deep links khi đổi navigation; four demo/scroll/viewport/reduced/noJS/WebGL khi đổi renderer/layout; model tests khi đổi timeline. So với implementation/bằng chứng Astro trong repo và cập nhật tài liệu cùng change. Không thêm snapshot/test chỉ lặp lại implementation. [Verification](../verification/README.md) ghi kết quả thật và giới hạn.
