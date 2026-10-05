# Landing Pen — bản import đã chuẩn hóa

Cập nhật canvas ngày **2026-10-05**, theo review `landing.pen` và phạm vi điều chỉnh đã được chấp nhận trong chat.

**Đã xác minh bản lưu ngày 2026-10-05:** file `landing.pen` trên đĩa đã được đọc lại qua Pen từ một bản sao mới, có đủ chín artboard, 39 variables, 80 reusable origins và 391 instances. Các PNG bên dưới là preview của thiết kế đã chỉnh.

## Tệp

| Tệp | Vai trò |
| --- | --- |
| [landing.pen](landing.pen) | Document đích đang được chỉnh trong Pen. |
| [landing.import-backup.pen](landing.import-backup.pen) | Bản import gốc, sao chép nguyên bytes trước khi ghi đè file đích; dùng chung `landing-assets/`. |
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

Artboard dùng tên `Landing · {locale} · {device} {width}`. Bản 1904 giữ kích thước của import; các cặp VI/EN phía dưới thể hiện cùng nội dung ở những viewport cần bàn giao.

## Điều chỉnh

- Khôi phục bốn demo bằng text, frame, icon và path editable: Knowledge Graph, Market Chart, AI Conversation, Scheduled Telegram. Copy VI/EN và fixture dựa trên baseline frontend đã đọc trong task, đối chiếu [LANDING.md](../LANDING.md) và [quyết định migration](../../README.md).
- Hero và bốn hình audience dùng bản chiếu vector tĩnh từ tọa độ/liên kết của renderer baseline. Đây là hình minh họa conceptual; Pen không chạy renderer WebGL, morph hoặc animation của ứng dụng.
- Trang có bảy nhóm trực tiếp: Header, Hero, Workflow showcase, Audience, AI providers, Contact CTA, Footer. Gỡ wrapper import của Clerk và sửa quan hệ sizing; đoạn văn tăng chiều cao theo nội dung.
- Chuẩn hóa Geist/Geist Mono, palette navy/mint, spacing và radius qua variables; các cấu trúc lặp dùng `ref`. Inventory hiện có 39 variables và 80 reusable origins, bao gồm các kích thước demo/figure cần thiết.
- Đặt tên layer theo vai trò, giữ context import để đối chiếu nguồn. Giữ nguyên bốn ảnh gốc trong `landing-assets/`; không đưa ảnh canvas bị trắng vào thiết kế đã chỉnh.
- Provider strip hiển thị đủ sáu logo, dùng một bộ assets/component chung; bỏ bản lặp và mask của capture marquee. Animation marquee vẫn là hành vi của implementation.
- Mobile/tablet xếp copy và demo trong luồng tự nhiên. Hình audience nằm ngay sau lựa chọn đang mở.

## States và component

| Nhóm | Vị trí trong document |
| --- | --- |
| Button, navigation, brand, step selector, capability, audience selector, provider logos | `Components · Controls and navigation` |
| Bốn demo VI/EN ở desktop và mobile | `Components · Product demos · EN / VI` |
| Demo ở stage 576/720 px, figure theo viewport | `Components · Responsive demos and figures` |
| Vector figure gốc | `Components · Market figures` |
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
- Audit bounds trên chín artboard không còn overflow/clipping ngoài ý định ở nội dung đang hiển thị; bỏ qua decorative background crop, node disabled và sai số vector dưới 1 px.
- Không có variable reference thiếu target; không có artboard/component board chồng lên nhau.
- Đã sửa nhãn trục giá bị wrap do số chưa làm tròn, CTA VI 1024 bị chật và sizing của paragraph khi đổi locale.
- Đã xác minh persistence qua bản sao mới của file đã lưu (3.102.957 bytes), đọc bằng Pen; SHA-256 `DBDEE1E7DCBA8D0C53A243B246B3C120D37F927BAEF10BB5EF845761C6C42E3A`.
- Runtime keyboard, screen reader, scroll, reduced motion và production build thuộc bước implementation; task này không chứng nhận các kiểm tra đó.

Thao tác Save/persistence theo [hướng dẫn Pen local](../../../.agents/skills/README.md). Backup import có SHA-256 `DA95BC264235F2CB642FF75CE9B207143F70BA8275B4C7C2489F11C4CA419300`.
