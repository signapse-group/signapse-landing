# Archive tài liệu landing

Tài liệu ở đây giữ lại lịch sử và nguồn tham khảo khi gom landing ngày 2026-10-04. Scope đang triển khai và quyết định mới nhất nằm tại [mục lục tài liệu](../README.md).

## Nghiên cứu và triển khai cũ

- [Plan đã deprecated](plan-landing.md).
- [Nghiên cứu implementation Next.js](LANDING_IMPLEMENTATION_RESEARCH.md).
- [Coming-soon và hướng dẫn cutover trước đây](coming-soon.md); các lệnh/source path trong tài liệu thuộc `signapse-ui`.
- [Theo dõi product captures trước đây](landing-product-captures.md).
- [Hồ sơ capture và ảnh gốc/crop](landing-capture-review/README.md).

Product screenshots đã được frontend ngừng dùng ngày 2026-10-02. Các ảnh trong `landing-capture-review/` chỉ là hồ sơ review; ảnh gốc có browser/desktop/account chrome theo ghi nhận trong hồ sơ, không phải asset để đưa vào `public/` của Astro. Migration giữ các demo render bằng code.

## Snapshot từ planning

Các bản planning khác với bản frontend mới nhất được giữ nguyên phần nội dung lịch sử, chỉ cập nhật đường dẫn tham chiếu. Nguồn chuyển: `signapse-planing` tại `79c5444`; tài liệu frontend được chuyển từ `signapse-ui` tại `85fe12e`.

| Nhóm | Bản lưu |
| --- | --- |
| Thiết kế | [LANDING.md](planning-snapshot/design/LANDING.md), [LANDING_CONTENT_NEW.md](planning-snapshot/design/LANDING_CONTENT_NEW.md), [plan-landing.md](planning-snapshot/design/plan-landing.md) |
| Nghiên cứu UI | [AI Conversation](planning-snapshot/research/landing-ai-conversation-research.md), [form/CTA](planning-snapshot/research/landing-demo-request-form-research.md), [Hero capability](planning-snapshot/research/hero-capability-research.md) |
| Nghiên cứu kỹ thuật | [Interactive demo](planning-snapshot/research/interactive-product-demo-research.md), [OHLCV background](planning-snapshot/research/graphify-ohlcv-background-research.md) |
| ADR | [0005](planning-snapshot/adr/0005-stage-public-landing-before-apex-cutover.md), [0010](planning-snapshot/adr/0010-use-progressive-webgl-for-landing-context-figure.md), [0011](planning-snapshot/adr/0011-fixed-branded-public-landing-composition.md) |
