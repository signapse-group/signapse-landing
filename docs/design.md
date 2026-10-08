# Quy tắc thiết kế cho implementation landing

Tài liệu tổng hợp rule UI của `signapse-landing`, dùng khi triển khai hoặc review visual, layout, interaction và copy. Khảo sát ngày **2026-10-07** trên landing `8c5bd7d`, planning `5d0fb67` và FE `signapse-ui` `5393a49`.

Đặt tại `docs/design.md` để đi cùng [architecture](architecture.md) và [verification](verification/README.md). Đây là tài liệu thực thi; requirement/design, Pen, copy contract và ADR vẫn thuộc planning. Các bảng số đo bên dưới ghi nhận source hiện hành, không tự tạo contract mới hoặc chứng nhận mọi state đã được kiểm thử.

## Nguồn và cách áp dụng

| Nguồn | Vai trò |
| --- | --- |
| [Landing contract](../../signapse-planing/ui-design/references/landing/LANDING.md) | Quy tắc được duy trì tại planning về composition, navigation, demo, responsive và accessibility. |
| [Design handoff](../../signapse-planing/ui-design/references/landing/README.md) và [Pen handoff](../../signapse-planing/ui-design/pen/landing/README.md) | Design/revision, Foundation, shared compositions, interaction states và reference của task. |
| [ADR-0011](../../signapse-planing/docs/adr/landing/0011-fixed-branded-public-landing-composition.md) và [ADR-0010](../../signapse-planing/docs/adr/landing/0010-use-progressive-webgl-for-landing-context-figure.md) | Palette cố định và progressive WebGL. |
| [Landing composition](../src/components/landing/LandingPage.astro), [landing CSS](../src/components/landing/landing-page.module.css), [showcase CSS](../src/components/landing/landing-feature-showcase.module.css) | Bố cục, token và treatment đang triển khai. |
| [Global styles](../src/styles/global.css), [font faces](../src/styles/fonts.css), [dictionary](../src/i18n/messages.ts) | Font roles, copy VI/EN, fixture labels, accessible text và metadata. |
| [FE design](../../signapse-ui/docs/design/DESIGN.md) | Tham khảo hierarchy, semantic tokens, trạng thái và accessibility; không áp dụng nguyên bộ dashboard rules cho landing. |

Áp dụng requirement/AC và design revision được giao cùng contract tại planning. Nếu chúng xung đột với tài liệu này hoặc code, ghi rõ điểm lệch và đưa về coordinator/planning; không suy ra requirement từ giao diện đang chạy. [Design-system review](../../signapse-planing/ui-design/pen/landing/design-system-review.md) giữ lịch sử finding trước sửa; dùng handoff hiện hành để xác định trạng thái mới.

## Ngôn ngữ visual

- Giữ hierarchy rõ: heading → supporting copy → action → proof. Hero có một primary Contact action và một proof AI; không thêm claim, badge, card hoặc section chỉ để lấp khoảng trống.
- Nội dung sản phẩm và proof là phần chính. Texture glyph, gradient và figure hỗ trợ bối cảnh, không cạnh tranh với chữ hoặc giả làm dữ liệu thị trường live.
- Dark/light là nhịp composition cố định: Header, Hero/capability, Audience, contact và Footer dùng dark family; Showcase và Providers dùng light family.
- Surface, border và shadow thể hiện nhóm nội dung hoặc control thật. Không bọc thêm card chỉ để lấy radius/shadow; giữ ngoại lệ của các giao diện sản phẩm minh họa trong scope demo.
- Claim theo copy contract. Giữ disclaimer về phân tích/tự động hóa; không suy diễn thành cam kết lợi nhuận, dự báo giá hoặc tính năng đã hoạt động ngoài fixture.

## Palette và semantic surfaces

Nguồn token là `.landingRoot` trong [landing CSS](../src/components/landing/landing-page.module.css).

| Token | Giá trị hiện hành | Vai trò |
| --- | --- | --- |
| `--landing-navy` | `#03141D` | Nền brand dark; chữ/chrome chính trên light surface. |
| `--landing-navy-surface` | `#08232E` | Card/popover trên dark surface. |
| `--landing-mint` | `#12D6B1` | Accent, focus và tín hiệu trên dark surface. |
| `--landing-mint-strong` | `#006F66` | Accent/focus trên light surface. |
| `--landing-off-white` | `#FFFFFF` | Light surface; chữ và primary action trên dark. |
| `--landing-muted` | `#A6C4BF` | Supporting text trên dark. |
| `--landing-boundary` | `#3C6A70` | Boundary/input và chi tiết phụ. |
| `--landing-light-muted-surface` | `#E7E6E0` | Muted/secondary/selected treatment trên light. |
| `--landing-light-muted-foreground` | `#565D60` | Supporting text trên light. |
| `--landing-dark-muted-surface` | `#123D43` | Muted/secondary/selected treatment trên dark. |

- Component dùng các vai trò `--background`, `--foreground`, `--card`, `--popover`, `--primary`, `--muted`, `--border`, `--input`, `--ring` và `--chart-*` do surface owner ánh xạ. Không thêm raw palette để sửa một control cục bộ.
- Giữ `data-landing-theme="fixed-signapse"`; OS theme, class `.dark` và dashboard preference không được đổi composition hoặc bị landing đọc/ghi lại.
- Popup render qua portal phải có palette owner riêng. Capability popup hiện mang cả `.landingRoot` và `.darkSurface`; không dựa vào kế thừa từ Hero sau khi ra ngoài DOM của section.
- Header chọn surface theo section nằm bên dưới, logo theo surface. Figure/Three colors cũng theo section; không thêm theme provider của dashboard.
- Provider brand colors, Telegram chrome và màu trạng thái/proof hiện có là treatment cục bộ. Không đưa chúng vào palette chung hoặc đổi toàn bộ token để sửa một demo. Trạng thái luôn có text/icon/pattern bổ sung cho màu.

## Typography

Fonts tự host, có subset tiếng Việt và fallback metrics trong [fonts.css](../src/styles/fonts.css); giữ `font-display: swap` và license. `--font-sans` cấu hình Geist, `--font-mono` cấu hình Geist Mono; `--font-display` cấu hình Inter cho `.landingDisplayHeading` và showcase titles. Renderer có mono/fallback treatment riêng trong CSS của demo.

Các số đo sau là baseline trong source; px được quy đổi với root font 16 px, còn implementation dùng rem/responsive classes. Không dùng size của chữ minh họa làm default cho trang public.

| Vai trò | Treatment hiện hành |
| --- | --- |
| Hero H1 | Inter; 36 → 60 → 72 px tại base/`sm`/`lg`; line-height `1.02`. |
| Display heading | `.landingDisplayHeading`: weight `510`, letter-spacing `-0.022em`; size/line-height theo từng section. |
| Audience heading | 36 → 48 → 60 px; line-height `1.04`. |
| Providers/contact heading | 30 → 36 px; `leading-tight`. |
| Hero/Audience supporting copy | Geist; 16 → 18 px; line-height 28 px. |
| Page eyebrow | 12 px, semibold, uppercase, tracking `0.18em`. |
| Showcase title/body | Title 18 px, 20 px ở desktop enhanced; body 15 px; line-height `1.35`/`1.6`; measure tối đa `22rem`. |
| Telegram form minh họa | Label 11 px, control text 12 px, control height 28 px; chỉ dùng trong demo inert. |

Heading hierarchy theo nội dung: một H1 ở Hero, H2 cho các vùng chính, heading nhỏ hơn cho nội dung con. Giữ text wrap theo container và đủ copy VI/EN; không scale toàn bộ demo, ép mọi heading cùng size hoặc dùng truncate để che vấn đề responsive.

## Spacing, geometry và chrome

| Vai trò | Baseline source |
| --- | --- |
| Header height | `--landing-header-height: 4.5rem` (72 px). |
| Landing control | `--landing-control-height: 2.75rem` (44 px); control radius `0.5rem` (8 px). |
| Card/popover token | Radius `0.75rem` (12 px), padding token `1.5rem` (24 px); một số composition có treatment riêng. |
| Page gutters | 16 / 24 / 32 px tại base / `sm` / `lg`. |
| Header container | Tối đa `120rem`. |
| Hero/capability/Showcase/Audience/Providers container | Tối đa `100rem`; inner showcase cap `79rem`. |
| Contact container | Tối đa `88rem`; copy measure `34rem`. |
| Footer container | `max-w-7xl` (`80rem`). |
| Section spacing | Showcase/Audience/Providers 64 → 96 px theo trục dọc; contact 80 → 112 px. Hero có spacing riêng theo header và viewport. |

Các cap trên ghi nhận implementation, không phải một container mới áp cho mọi trang. Pen Public Page Starter có container mặc định 1280 px; khi task chỉ định composition/revision khác, đối chiếu reference và ghi nhận lệch thay vì tự thay cap của toàn landing.

Ưu tiên reuse spacing/treatment tại composition đang sửa. Không làm tròn geometry, icon/path hoặc mọi giá trị lẻ về bội số 4 chỉ để tạo scale. Giữ border mảnh, shadow có mức độ; riêng Telegram chỉ outer browser có shadow, hai panel bên trong không tạo thêm tầng shadow.

## Composition và responsive

Nguồn composition là [LandingPage.astro](../src/components/landing/LandingPage.astro), [Audience](../src/components/landing/landing-audience-section.tsx) và [Footer](../src/components/landing/LandingFooter.astro).

| Thứ tự | Surface | Quy tắc |
| --- | --- | --- |
| 1 | Header | Logo, ba nhóm navigation, Contact, dashboard CTA và locale; bám trên cùng bằng `position: fixed`, đổi surface theo section. |
| 2 | Hero `#top` | H1/copy/Contact/proof AI, Context Figure và texture decorative; một cột ở màn hẹp, hai cột từ `lg`. |
| 3 | Capability `#capability-strip` | Năm capability trong cuối Hero; detail/popover không đổi chiều cao Hero. |
| 4 | Showcase `#showcase` | Knowledge Graph → Market Chart → AI Conversation → Scheduled Telegram; mỗi bước giữ copy và proof bằng code. |
| 5 | Audience `#audiences` | Bốn lựa chọn trader/analyst/strategy developer/team & fund. Mobile đặt figure ngay sau lựa chọn active; no-JS có đủ nội dung qua fallback. |
| 6 | Providers `#trust` | Đủ OpenAI, Gemini, Anthropic, DeepSeek, Groq, Z.AI; bản lặp marquee ẩn khỏi accessibility tree. |
| 7 | Contact `#access` | Nội dung/email bên trái, form thật bên phải khi đủ rộng; reflow một cột trên màn hẹp. |
| 8 | Footer | Brand/copy, năm capability links, contact, dashboard, email và disclaimer. |

`#access` hiện triển khai contribution form theo [SIGN-113 reference](../../signapse-planing/ui-design/pen/landing/README.md#form-liên-hệ-công-khai). Bảng baseline trong `LANDING.md` còn mô tả vùng này là Final CTA; đọc cùng phần form của contract và AC/revision được giao, không tự khôi phục nút dashboard tại đây. Header/Footer vẫn giữ dashboard CTA.

Responsive dùng threshold theo từng surface; không coi tất cả là một breakpoint desktop chung.

| Ngưỡng hiện hành | Thay đổi |
| --- | --- |
| Base dưới 640 px | Gutter 16 px, natural flow, CTA Hero full width, form fields một cột. |
| `sm`: 640 px | Gutter 24 px; name/email trong contact form thành hai cột. |
| 768 px | Capability rail và một số nhóm nội dung demo có layout rộng hơn. |
| `lg`: 1024 px | Gutter 32 px; Hero/Audience layout desktop; showcase có thể dùng sticky enhancement. |
| 1152 px (`72rem`) | Contact copy/form thành hai cột với tỷ lệ `0.84fr / 1.16fr`. |
| `xl`: 1280 px | Header chuyển từ native mobile menu sang ba mega-menu và locale menu desktop. |
| Telegram container 608 px (`38rem`) | Hai panel Signapse/Telegram nằm cạnh nhau; dưới ngưỡng xếp dọc. Đây là container query, không phải viewport breakpoint. |

- Không page-level horizontal overflow. Dùng `min-width: 0`, wrap và reflow đúng surface; không che nội dung bị tràn bằng clipping để coi là đã sửa.
- Header/menu/popup vừa viewport và cửa sổ thấp; anchor/focus có scroll margin theo header để nội dung không bị che.
- Showcase từ 1024 px giữ copy cuộn bên trái và active stage tại cùng vị trí sticky bên phải khi có enhancement. Không dùng height threshold để tắt sticky hoặc scroll-lock.
- Dưới 1024 px, thiếu JavaScript hoặc thiếu IntersectionObserver: mỗi copy/proof đi liên tiếp trong natural flow. Cửa sổ thấp giữ đủ nội dung; Telegram desktop content tối thiểu `31rem`, phần dư vẫn đọc được qua scroll tự nhiên.

## Components, navigation và copy

- Dùng anchor cho điều hướng, button cho action/selection và native disclosure cho menu fallback. Reuse [LandingActionButton](../src/components/landing/LandingActionButton.astro), `buttonVariants` và primitives trong [components/ui](../src/components/ui/); icon dùng Lucide.
- Palette và chrome của landing nằm ở CSS module/surface owner. Giữ variants/sizes sẵn có của primitive; không sửa generic Input/Select/Button vì compact treatment của một demo hoặc sao chép wrapper từ FE.
- Header/capability hydrate `client:load`. Header dùng `details/summary`; capability có native details trước hydration/no-JS và Base UI Popover sau hydration.
- Desktop disclosure hỗ trợ hover, giữ popup khi pointer đi vào nội dung; keyboard Enter/Space, Escape, focus restore và outside click. Touch dùng toggle, không phụ thuộc hover. Capability chỉ mở một popup tại một thời điểm.
- Capability anchors giữ nguyên `#knowledge-graph`, `#live-charts`, `#ai-assistant`, `#telegram`, `#strategy-coding`; menu/footer/direct hash cùng mở đúng detail. Roadmap items có nhãn disabled; chỉ bật khi destination đã được chốt.
- Audience dùng native buttons với `aria-pressed`; direct audience hash chọn đúng option. Selection và scroll không tự cướp focus.
- Dashboard và các đích Articles thuộc ứng dụng sản phẩm dùng `appHref()` từ [routing.ts](../src/i18n/routing.ts): `{PUBLIC_APP_ORIGIN}/{locale}/dashboard` và `{PUBLIC_APP_ORIGIN}/{locale}/articles`. Public Blog list/detail dùng route landing được localize trong `src/pages/[lang]/blogs/`. Contact dẫn `#access`; email dùng [landing-access.ts](../src/components/landing/landing-access.ts). Auth nằm ở ứng dụng đích.
- `/vi`, `/en` và root entry VI dùng `SUPPORTED_LOCALES`. Locale switch giữ query và chỉ những hash trong `SUPPORTED_LANDING_HASHES`; không mặc định giữ mọi section/audience hash, không ghi cookie locale. Links giữ `lang`, `hreflang`, `aria-current` phù hợp.
- Text, accessible names, metadata và fixture labels từ [dictionary VI/EN](../src/i18n/messages.ts), cùng typed shape. Copy tiếng Việt đúng dấu và tự nhiên; tên riêng/feature/eyebrow tiếng Anh đã được duyệt không tạo quy tắc English-only cho landing.
- Không thêm technical implementation copy vào user flow, sửa claim từ screenshot, hoặc prefill dữ liệu mẫu của reference vào form thật.

## Form liên hệ và feedback

Nguồn: [contact form](../src/components/landing/landing-contact-form.tsx), nhóm `landing.contact` trong dictionary và [reference frame `RNiDl`](../../signapse-planing/ui-design/pen/landing/validation/contact-requests/landing-desktop.png). Schema/limits theo producer OpenAPI và task, không do tài liệu design này định nghĩa.

Rule placeholder được bổ sung theo yêu cầu người dùng ngày **2026-10-07**, áp dụng cho các field có thể chỉnh sửa trong landing.

- Giữ ba field: tên tùy chọn, email bắt buộc, lời nhắn bắt buộc; một thao tác gửi. Visible labels và required guidance tồn tại trước submit; input type/autocomplete hỗ trợ mobile và autofill.
- Mọi field nhập text hoặc số có thể chỉnh sửa, gồm `input` và `textarea`, phải có placeholder phù hợp ngữ cảnh. Ngoại lệ: field readonly, input kỹ thuật ẩn và native control không hỗ trợ placeholder như date/time/file; demo inert không phải field nhập liệu thật.
- Placeholder cung cấp ví dụ hoặc gợi ý ngắn, lấy từ dictionary VI/EN và không thay visible label. Hướng dẫn quan trọng vẫn nằm trong helper text riêng; kiểm placeholder khi field rỗng hoặc sau khi người dùng xóa giá trị.
- Form bắt đầu rỗng. Giá trị mẫu trong Pen/PNG chỉ minh họa, đưa vào placeholder nếu phù hợp thay vì tự điền `value`/`defaultValue`. Form liên hệ dùng `namePlaceholder`, `emailPlaceholder` và `messagePlaceholder` trong `landing.contact`.
- Lỗi validation nằm cạnh field, nối bằng `aria-invalid`/`aria-describedby`; submit lỗi đưa focus tới field lỗi đầu tiên. Lỗi gửi dùng `role="alert"`, thành công dùng `role="status"`.
- Pending giữ control footprint, khóa fieldset và submit, có localized “Đang gửi…”/“Sending…” và `aria-busy`; chặn submit lặp.
- Lỗi API/network giữ input để sửa hoặc thử lại, hiển thị recovery copy gần form. Chỉ sau response thành công mới xóa input và báo đã lưu; không thông báo thành công trước xác nhận producer.
- Form hiện dùng `client:only="react"`. Copy/email và hướng dẫn no-JS vẫn nằm trong HTML Astro; email `access@signapse.cloud` phải dùng được khi form không khả dụng. Không suy từ rule SSR của demo rằng form hiện được SSR.
- `PUBLIC_CONTACT_API_ORIGIN` riêng với origin ứng dụng. Consumer tests mock API; kết quả đó không chứng nhận CORS, record producer hoặc backend thực.

## Demo, motion và progressive enhancement

- Bốn demo giữ chung [showcase island](../src/components/landing/landing-feature-showcase.tsx). Giữ DOM/SVG renderers, fixtures/models và transcript/proof bằng code; không thay bằng ảnh, placeholder hoặc UI đơn giản làm mất proof.
- Fixtures được nhận diện là demo; composer/form/schedule minh họa inert. Không biến playback thành gửi tin, tạo lịch hoặc giao dịch thật.
- Step controls là buttons, `aria-current="step"`, `aria-controls` và labelled regions; không chuyển thành tablist/tabpanel. Hỗ trợ Click/Tab/Enter/Space và ArrowUp/Down/Home/End; scroll chọn bước không lấy focus.
- Viền progress quanh badge dùng thời gian playback, không phần trăm scroll. Điều kiện chạy theo [landing-playback.ts](../src/components/landing/landing-playback.ts): `active && inView && pageVisible && !reducedMotion`.
- Graph/Chart SSR có final frame và inspector/detail hữu ích; AI có static transcript; Telegram giữ schedule/message trong một browser frame. Runner tải chậm/lỗi vẫn giữ proof.
- Reduced motion giữ final proof, dừng autoplay/decorative loops và marquee; không xóa nội dung để tắt animation. Pause/re-entry/timing theo [architecture](architecture.md#demo-và-playback) và model, không tự thống nhất các policy khác nhau.
- Hero Context Figure là hai góc nhìn graph/price bổ sung, có localized summary và SVG fallback cùng footprint. Enter/Space đổi mode, arrows xoay; fine pointer hỗ trợ preview/pin/drag. Đây không phải phép biến đổi graph thành dự báo giá.
- Context, Audience và showcase dùng `client:idle` với viewport gate nội bộ. WebGL/Three là enhancement tải khi cần; canvas/decorative geometry ẩn khỏi accessibility tree. Giữ cleanup observers, listeners, timers, frames và GPU resources.
- Pen `Visual Placeholder` là slot cho minh họa Hero/Audience trong thư viện thiết kế, không phải yêu cầu bỏ figure hoặc code fallback đang hoạt động ở runtime.

## Accessibility và assets

Contract yêu cầu keyboard/touch, visible focus, semantics và fallback hữu ích. Các chỉ tiêu contrast/target sau tham khảo [FE accessibility rules](../../signapse-ui/docs/design/DESIGN.md#accessibility-and-responsive-behavior) để review, không phải tuyên bố landing đã được chứng nhận WCAG.

- Review theo WCAG 2.2 AA: normal text tối thiểu `4.5:1`; large text và non-text indicators/boundaries cần thiết tối thiểu `3:1`. Kiểm trên surface thực, bao gồm hover, selected, focus và error.
- Interactive targets đạt ít nhất `24×24` CSS px theo điều kiện WCAG; ưu tiên `44×44` cho mobile/coarse pointer. Chữ/control compact của demo inert không làm giảm kích thước control tương tác thật.
- Một H1, heading hierarchy có thứ tự, named landmarks và skip link tới `#main-content`. Focus thấy rõ, không bị fixed/sticky surface che; icon-only control có accessible name.
- Meaningful image có alt; decorative glyph/image/canvas ẩn đúng semantics. Live/error/status feedback dùng text và announcement phù hợp, không dựa chỉ vào màu hoặc liên tục đọc mọi frame animation.
- Kiểm VI/EN ở desktop/tablet/mobile, cửa sổ thấp, zoom 200%, keyboard, touch, reduced motion, no-JS, WebGL unavailable và thiếu IntersectionObserver.
- [public](../public/) chỉ chứa runtime logo/provider/icon/font/social assets; giữ NOTICE/OFL và media bytes. Logo chọn đúng dark/light surface, không theo dashboard theme.
- Social cards 1200×630 theo locale; lang/title/description/social alt từ dictionary. Metadata/indexability theo [README](../README.md#cấu-hình), không bật indexing chỉ vì thay visual.
- Design exports/backups ở planning; ảnh và runtime reports ở `docs/verification/`, không đưa screenshots kiểm chứng vào `public/` hoặc dùng chúng thay renderer.

## Phần tham khảo từ FE

| Rule FE có ích | Cách áp dụng ở landing |
| --- | --- |
| Hierarchy, semantic tokens, surface có vai trò | Dùng landing palette owner và composition hiện có. |
| Reuse primitives, tránh sửa wrapper vì feature cục bộ | Dùng primitives local; ngoại lệ demo nằm trong CSS/composition của demo. |
| Labels, placeholders theo ngữ cảnh, announced errors, pending ổn định, giữ input khi lỗi | Áp dụng cho contact form; rule placeholder bổ sung theo yêu cầu người dùng, các state theo AC/copy và producer contract. |
| Contrast, non-color cues, keyboard/focus, responsive/reduced motion | Dùng làm tiêu chí review trên fixed dark/light sections và code proofs. |

FE là dashboard có theme switching, app shell/sidebar, content-width modes, CRUD forms và quick-detail overlays. Những rule đó, preset/chrome của FE, spinner riêng và auth/localization providers không tự trở thành rule landing. Landing tiếp tục dùng Astro/static shell, islands, fonts/token local và URL integration; không thêm dependency/runtime của FE để build hoặc kiểm thử.

## Review và cập nhật

- [ ] Đối chiếu task/AC, contract, design revision và copy VI/EN; nêu rõ sai khác thay vì tự đổi contract theo code.
- [ ] Giữ composition, palette ownership, typography/spacing và component reuse; kiểm cả popup qua portal và header khi đổi surface.
- [ ] Kiểm wrap/reflow, các threshold liên quan ở cả hai phía, cửa sổ thấp và zoom; không mất nội dung/proof hoặc page overflow.
- [ ] Kiểm keyboard/touch/Escape/focus, locale/query/hash, CTA và form states nếu bị ảnh hưởng.
- [ ] Field text/số có thể chỉnh sửa có placeholder VI/EN đúng ngữ cảnh khi rỗng; label vẫn hiển thị và không prefill giá trị mẫu.
- [ ] Kiểm fallback, reduced motion, playback/progress và cleanup nếu đổi figure/demo/layout.
- [ ] Source/config: chạy `pnpm check`, `pnpm lint`, `pnpm format:check`, `pnpm build`; navigation/layout/demo chạy browser coverage liên quan, model changes chạy `pnpm test:models` theo [verification](verification/README.md).
- [ ] Chỉ đổi tài liệu: kiểm Markdown, UTF-8/LF, links và tính đúng với source; không ghi checks/runtime chưa chạy thành evidence.
- [ ] Cập nhật tài liệu thực thi cùng source/tests bị ảnh hưởng. Design-system/requirement/copy contract changes được chốt tại planning trước; lịch sử runtime evidence ở landing.
