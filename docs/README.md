# Tài liệu landing Signapse

Ngày gom tài liệu: **2026-10-04**. Đây là nơi sở hữu tài liệu riêng của landing: thiết kế, copy, nghiên cứu và quyết định kiến trúc. Các tài liệu được chuyển từ `signapse-ui` và `signapse-planing`; nguồn cũ đã được gỡ và các liên kết tham chiếu được cập nhật.

## Quyết định migration đã chốt

Triển khai landing Astro tại repository này, giữ đầy đủ hai locale `/vi` và `/en`, giao diện, nội dung và các demo của frontend tại [`85fe12e`](https://github.com/signapse-group/signapse-ui/tree/85fe12e00e1bfc64e37a11a71914bbc5218f6f63). Bản frontend của `LANDING.md` đã cập nhật ngày 2026-10-02 được giữ làm baseline mới nhất; các bản planning trước đó được lưu riêng trong archive.

CTA vào ứng dụng không nhận biết phiên đăng nhập: luôn dẫn tới `{APP_ORIGIN}/{locale}/dashboard`, để frontend xử lý đăng nhập. Origin dashboard cần được cấu hình, chưa chốt hostname production. Các link liên hệ và anchor trong trang giữ chức năng hiện tại.

Đợt đầu tập trung vào landing. Articles/blog công khai và quản trị blog tiếp tục ở frontend; menu Articles trên Astro dẫn tới URL tương ứng bên đó. Astro sở hữu layout và nội dung static, React islands giữ các vùng tương tác; showcase bốn demo giữ chung một island để bảo toàn điều phối theo scroll.

Các quyết định migration trên được người dùng chấp nhận ngày 2026-10-04 và được ưu tiên khi tài liệu lịch sử còn mô tả Next.js, Clerk, CTA theo phiên đăng nhập hoặc composition đã bị thay thế. Nội dung trích xuất và nghiên cứu cũ không tự mở rộng scope migration.

## Thứ tự triển khai đã thống nhất

| Bước | Kết quả |
| --- | --- |
| 1. Baseline | Kiểm kê component, copy VI/EN, assets, anchors, hành vi và ảnh đối chiếu từ source hiện có. |
| 2. Project độc lập | Astro, TypeScript, React, Tailwind CSS 4, pnpm, scripts kiểm tra/build và cấu hình môi trường. |
| 3. Cấu trúc trang | Header, Hero/OHLCV, capability strip, showcase, audience, provider marquee, final CTA và Footer đủ hai locale, có HTML fallback. |
| 4. Tương tác | Navigation, locale switch, popovers, WebGL, bốn demo, scroll/progress/playback, keyboard/touch và reduced motion. |
| 5. URL và tích hợp | CTA dashboard, locale negotiation tại root, query/hash, metadata/canonical/hreflang, social cards và analytics; preview `noindex`. |
| 6. Kiểm chứng | Build production độc lập, test landing, visual/accessibility, smoke sang dashboard và preview có thể duyệt. |

Mốc hoàn thành đợt đầu là bản Astro đầy đủ trên preview. Chuyển domain, cập nhật link quay về landing trong frontend và gỡ source/dependency cũ thực hiện sau khi preview được duyệt.

## Thiết kế và nội dung

| Tài liệu | Vai trò |
| --- | --- |
| [LANDING.md](design/LANDING.md) | Baseline landing cập nhật trong frontend tới 2026-10-02; đọc cùng quyết định migration bên trên. |
| [LANDING_CONTENT_NEW.md](design/LANDING_CONTENT_NEW.md) | Nội dung trích xuất từ HTML tham chiếu; không tự thay thế copy hoặc mở thêm form/feature cho migration. |
| [Landing page content](marketing/landing-page.md) | Tài liệu positioning/copy từ planning; các working assumption và CTA cũ cần đối chiếu với baseline hiện tại. |

## Nghiên cứu

- [Khung Astro — nghiên cứu và plan](research/astro-scaffold-research.md): cấu trúc repo, toolchain và phạm vi scaffold; đã được duyệt ngày 2026-10-04.
- [Interactive product demo](research/interactive-product-demo-research.md): lựa chọn renderer và kiến trúc demo.
- [Ví dụ nghiên cứu bổ sung](research/interactive-product-demo-examples.md): các case study liên quan.
- [AI Conversation](research/landing-ai-conversation-research.md): transcript, dữ liệu demo và presentation.
- [Dải năm năng lực Hero](research/hero-capability-research.md): nghiên cứu capability strip.
- [Nền OHLCV](research/graphify-ohlcv-background-research.md): background glyph và ranh giới với WebGL.
- [Form/CTA yêu cầu demo](research/landing-demo-request-form-research.md): lịch sử lựa chọn contact flow; CTA vào ứng dụng hiện theo quyết định migration.

## Quyết định kiến trúc đã có

- [ADR-0005 — staged landing và apex cutover](adr/0005-stage-public-landing-before-apex-cutover.md).
- [ADR-0010 — progressive WebGL](adr/0010-use-progressive-webgl-for-landing-context-figure.md).
- [ADR-0011 — fixed branded composition](adr/0011-fixed-branded-public-landing-composition.md).

Các ADR giữ nguồn gốc và quyết định trước migration. Palette, progressive fallback và ranh giới preview/cutover tiếp tục là đầu vào; các chi tiết triển khai Next.js/Clerk cần đọc theo quyết định migration đã chốt.

## Lịch sử và tài liệu dùng chung

[Archive](archive/README.md) giữ nghiên cứu implementation Next.js, coming-soon, hồ sơ/ảnh capture đã ngừng dùng và các snapshot planning cũ. Đây là tài liệu lịch sử, không phải yêu cầu phục hồi bố cục hoặc ảnh demo cũ.

Các nguồn dùng chung tiếp tục thuộc planning: [product context](../../signapse-planing/PRODUCT-CONTEXT.md), [domain context](../../signapse-planing/CONTEXT.md), [design system](../../signapse-planing/ui-design/references/DESIGN.md), [API mapping](../../signapse-planing/docs/frontend/APIMAPPING.md). Các đường dẫn `app/`, `components/`, `public/`, `tests/` và lệnh Next.js trong tài liệu nhập từ frontend là tham chiếu tới `signapse-ui`, chưa phải source Astro tại đây.
