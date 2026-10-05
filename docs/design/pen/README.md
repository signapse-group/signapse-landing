# Landing Pen — bản import đã chuẩn hóa

Cập nhật canvas ngày **2026-10-05**, theo review `landing.pen` và phạm vi điều chỉnh đã được chấp nhận trong chat.

**Đã lưu và xác minh persistence ngày 2026-10-05.** Bản sao mới từ file trên đĩa đã được đọc lại bằng Pen: có chín artboard, 124 variables, 56 reusable origins và vị trí board đã gom thành hai hàng. Các PNG bên dưới được export từ thiết kế đã chuẩn hóa.

## Tệp

| Tệp | Vai trò |
| --- | --- |
| [landing.pen](landing.pen) | Document đích đang được chỉnh trong Pen. |
| [landing.import-backup.pen](landing.import-backup.pen) | Bản import gốc, sao chép nguyên bytes trước khi ghi đè file đích; dùng chung `landing-assets/`. |
| [landing.before-foundations.pen](landing.before-foundations.pen) | Bản đã lưu trước đợt chuẩn hóa foundation; giữ để phục hồi. |
| [Foundation](previews/foundations.png) | Colors, typography, responsive, spacing/radius và hướng dẫn reuse. |
| [Public Page Starter](previews/public-page-starter.png) | Mẫu composition có liên kết dùng làm điểm bắt đầu cho trang mới. |
| [VI desktop Hero](previews/vi-desktop-hero.png) | Preview Hero tiếng Việt tại 1440 px. |
| [VI mobile Hero](previews/vi-mobile-hero.png) | Preview Hero tiếng Việt tại 375 px. |

Tài liệu và assets tại đây phục vụ thiết kế, không phải runtime assets trong `public/`.

## Artboard

| Viewport | EN | VI |
| --- | --- | --- |
| Desktop 1904 | `cExVr` | — |
| Desktop 1440 | `l0bSG` | `k0Zsa` |
| Desktop 1024 | `AfYfC` | `ASoLD` |
| Tablet 768 | `mDvLK` | `NKGQ2` |
| Mobile 375 | `QeydJ` | `KPjle` |

Artboard dùng tên `Landing · {locale} · {device} {width}`. Bản 1904 giữ kích thước của import; các cặp VI/EN thể hiện cùng nội dung ở những viewport cần bàn giao.

Canvas được gom thành hai hàng: hàng trên đặt các trang cạnh nhau theo 1904 → cặp EN/VI 1440 → 1024 → 768 → 375, cùng mép trên. Hàng dưới lần lượt là Foundation, Controls, Public page composition, Product demos, Responsive demos và Interaction states. Các board cách nhau 160 px và không chồng lấn; chỉ thay vị trí board, không đổi bố cục bên trong.

## Điều chỉnh

- Khôi phục bốn demo bằng text, frame, icon và path editable: Knowledge Graph, Market Chart, AI Conversation, Scheduled Telegram. Copy VI/EN và fixture dựa trên baseline frontend đã đọc trong task, đối chiếu [LANDING.md](../LANDING.md) và [quyết định migration](../../README.md).
- Hero/Audience dùng một origin `Visual Placeholder` (`Vy1AC`), giữ footprint ở instance. Đã thay 34 instances và bỏ 25 figure origins. Bốn product demos vẫn giữ proof UI.
- Trang có bảy nhóm trực tiếp: Header, Hero, Workflow showcase, Audience, AI providers, Contact CTA, Footer. Gỡ wrapper import của Clerk và sửa quan hệ sizing; đoạn văn tăng chiều cao theo nội dung.
- Chuẩn hóa Geist/Geist Mono, palette navy/mint, spacing và radius qua variables; thêm semantic color aliases và typography bindings. Inventory canvas mới có 124 variables và 56 reusable origins, gồm 32 product demo origins và 24 shared controls/compositions.
- Header/Footer dùng chung bốn origins theo cấu trúc desktop/compact và wide/stacked. Chín Hero heading groups dùng một origin với locale/viewport overrides. Các section/content containers có content slots.
- Gộp 10 popovers về một `Capability Popover`; 32 demo toolbars dùng một `Browser Chrome`. Bỏ 641 overrides trùng origin ở 131 instances để shared styling truyền được tới dependents.
- Sửa description của menu mở để wrap theo container; thống nhất selected surface VI/EN và bind spacing trong states/origins.
- Đặt tên layer theo vai trò, giữ context import để đối chiếu nguồn. Giữ nguyên bốn ảnh gốc trong `landing-assets/`; không đưa ảnh canvas bị trắng vào thiết kế đã chỉnh.
- Provider strip hiển thị đủ sáu logo, dùng một bộ assets/component chung; bỏ bản lặp và mask của capture marquee. Animation marquee vẫn là hành vi của implementation.
- Mobile/tablet xếp copy và demo trong luồng tự nhiên. Hình audience nằm ngay sau lựa chọn đang mở.

## States và component

| Nhóm | Vị trí trong document |
| --- | --- |
| Button, navigation, brand, step selector, capability, audience selector, provider logos | `Components · Controls and navigation` |
| Bốn demo VI/EN ở desktop và mobile | `Components · Product demos · EN / VI` |
| Demo ở stage 576/720 px | `Components · Responsive product demos` |
| Colors, typography, responsive, spacing/radius và reuse guidance | `Foundations · Signapse public` (`X4bxO`) |
| Header/Footer, Popover, Browser Chrome, Heading Group, Container, Section, Starter | `Components · Public page composition` (`Ojb2X`) |
| Navigation mở, năm capability popover VI/EN, bốn audience states và menu mobile mở | `Interaction states · Navigation, capabilities and audience` (`OtjPz`) |

Audience có đủ bốn lựa chọn trên desktop 1440 và mobile 375, cho cả hai locale. Capability popover chỉ chứa outcome/body của baseline. Button có specimen focus với mint outline; các state ở Pen là mô tả trực quan, không chứng minh hành vi keyboard hoặc touch trong ứng dụng.

## Contract khi triển khai

- Header, Final CTA và link dashboard ở Footer dẫn tới `{APP_ORIGIN}/{locale}/dashboard`, không đọc login session. Hero Contact dẫn tới `#access`.
- Articles thuộc frontend: `{APP_ORIGIN}/{locale}/articles`. Origin production chưa được chốt; template destination trong metadata/href không phải URL production đã hoạt động.
- Giữ anchors `#knowledge-graph`, `#live-charts`, `#ai-assistant`, `#telegram`, `#strategy-coding`, `#showcase`, `#audiences`, `#access` và các audience anchors hiện hành. Locale switch giữ query/hash hợp lệ theo baseline.
- Desktop showcase dùng một stage sticky chung theo [LANDING.md](../LANDING.md). Bốn proof frames trong artboard phục vụ duyệt đầy đủ nội dung; không đổi contract thành bốn island độc lập. Dưới 1024 px, copy/demo của từng bước xếp liên tiếp.
- Viền badge số biểu thị thời gian playback, không phải phần trăm scroll. Reduced motion giữ trạng thái cuối; no-JS fallback vẫn cần đủ copy và proof bằng code.
- Demo Telegram là minh họa: form compact giữ label 11 px, control text 12 px, height 28 px. Không tạo lịch thật, gửi tin thật hoặc mở thêm form thu thập lead.

## Kiểm chứng

- Đã đọc lại bindings/instances và kiểm tra render tập trung của Header, Hero, showcase, provider strip, popover và audience states.
- Đã kiểm tra render toàn trang VI desktop/mobile, Hero, menu mở, Foundation và Starter. Visitor bounds của host có báo cáo vị trí không khớp render sau khi gộp instances; chưa chứng nhận bounds tự động toàn document.
- Không có variable reference thiếu target; không có artboard/component board chồng lên nhau.
- Đã sửa nhãn trục giá bị wrap do số chưa làm tròn, CTA VI 1024 bị chật và sizing của paragraph khi đổi locale.
- Đã kiểm tra alias type/target/cycle và ref targets: không có reference thiếu hoặc alias lỗi ở canvas mới. Thử đổi token action trên fixture làm hai instances cập nhật cùng lúc; đã phục hồi token và xóa fixture.
- Bản foundation đã lưu và đọc lại từ bản sao mới bằng Pen, gồm inventory và tọa độ hai hàng board. SHA-256 `91BFD7135EBFBB0A82978685AA88B74DA5232549C1AA0399F290F93FF8945695`.
- Runtime keyboard, screen reader, scroll, reduced motion và production build thuộc bước implementation; task này không chứng nhận các kiểm tra đó.

Thao tác Save/persistence theo [hướng dẫn Pen local](../../../.agents/skills/README.md). Backup import có SHA-256 `DA95BC264235F2CB642FF75CE9B207143F70BA8275B4C7C2489F11C4CA419300`.

## Thiết kế trang mới

1. Dùng instance `Public Page Starter` (`L1Y9A`) hoặc ghép Header → Section → Footer từ library.
2. Thay `Section Content Slot` (`Rmj2k`) và `Content Slot` (`TBeOs`) bằng nội dung cần thiết. Giữ linked components bên trong.
3. Heading Group (`Z5Cor`) có `Heading` (`EFeZc`) và `Summary` (`r76Xk`); override copy/locale và typography responsive đã định nghĩa trên Foundation.
4. Set width rõ tại instance; gutters desktop/tablet/mobile là 32/24/16 px. Container mặc định 1280 px; host hiện normalize variable width không đúng nên width dùng numeric geometry.
5. Figure dùng `Vy1AC`, không tạo origin mới cho từng viewport. Product proof dùng chrome `pb1wu`.
6. Styling dùng semantic variables; content/icon/state/sizing là overrides có chủ đích. Kiểm tra copy VI dài, responsive, save và đọc lại bằng Pen.

## Prototype blog public

[Khảo sát SIGN-18 và thiết kế đã chốt](public-blog-prototype.md) ngày 2026-10-05: user chọn B. Canvas chỉ giữ list `ARjYP` và detail `M0W0m` (VI desktop 1440), cùng foundation/linked components hiện có. A/C đã xóa khỏi canvas sau khi đọc lại và xác nhận backup [landing.before-blog-selection.pen](landing.before-blog-selection.pen) chứa đủ ba bộ. Có hai [PNG được duyệt](exports/public-blog/) để handoff; persistence của lần dọn canvas đang chờ Save/reopen. Trạng thái/hash ở đầu README áp dụng cho baseline foundation; bằng chứng blog nằm trong báo cáo riêng.
