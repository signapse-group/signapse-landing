# SIGN-605 — rà soát bản chuyển UG08–UG09

## Bản nội dung

- Nguồn Planning: revision `e734b0cdd39d1551724636487ab68eca7690da57`, bốn draft `docs/user-guide/{vi,en}/08-missing-data-or-features.md` và `09-glossary-and-data-states.md`.
- LANDING giữ ID `ug08`/`ug09`, locale `vi`/`en`, title trong frontmatter, body bắt đầu ở H2, `approvalStatus: draft` và `approvalReference: ''`.
- So sánh 4/4 body sau khi bỏ H1/banner nháp, đổi link tương đối sang route locale và chuẩn hóa xuống dòng/bảng: nội dung khớp nguồn; chỉ metadata, URL locale và định dạng Markdown thay đổi. UG08 có 7 link locale mỗi bản; UG09 có 48 link locale mỗi bản.
- Cả bốn bản có cùng cấu trúc heading VI/EN. Link trỏ theo locale tới các ID UG02–UG08 và UG10; mục lục và route lấy từ reader chung hiện có. Không sửa layout hoặc thêm trạng thái sản phẩm.

## Đối chiếu AC

- **L1 / SIGN-174 AC1 / SIGN-170 C1–C3:** hai bài được đưa vào nhóm `troubleshooting` có sẵn và dùng route `/vi/docs/ug08`, `/en/docs/ug08`, `/vi/docs/ug09`, `/en/docs/ug09`. Giữ đủ gate 20 bản đã duyệt cùng một approval reference; source draft không tạo link trong mục lục hoặc route công khai.
- **L2 / SIGN-174 AC2–AC3:** UG08 có ba phần: menu/thao tác bị thiếu hoặc không khả dụng; trang mở nhưng dữ liệu trống/thiếu; lỗi tải/lưu. Hướng dẫn kiểm tra account, quyền, workspace, phạm vi và thông báo; không kết luận nguyên nhân chỉ từ dấu hiệu. Bài giữ nội dung chưa lưu, kiểm tra watchlist có thể lưu một phần và chỉ thử lại khi UI có thao tác. Hỗ trợ qua người đã cấp quyền; thông tin gồm trang, thời điểm, hành động, thông báo, phạm vi và kết quả mong đợi/thực tế. Bài cấm gửi mật khẩu, token bot, access key và thông tin riêng tư không cần thiết.
- **L3 / SIGN-174 AC4:** UG09 định nghĩa asset, workspace/watchlist, news article, event, theme, market reaction, narrative, evidence, provenance và confidence. Phần Telegram phân biệt bot/token bí mật, destination, linking, test message, routing và ngôn ngữ mặc định.
- **L4 / SIGN-174 AC4:** bài phân biệt số 0, thiếu dữ liệu, từ chối quyền, lỗi tải, trạng thái lưu và cấu hình Telegram với việc nhận thông báo. Thời gian gắn với timeframe/UTC hiển thị; confidence không phải kết luận chắc chắn. Dẫn UG08 khi cần xử lý. Các trạng thái giữ theo draft nguồn, cần đối chiếu với ứng dụng trước phát hành.
- **L5:** renderer dùng semantic heading, anchor và TOC hiện có. Fixture browser kiểm tra link bằng keyboard, bài/locale hiện tại trong TOC, axe ở desktop/mobile và reflow tại 1440/768/375 px.

## Trạng thái duyệt và phần còn chờ

- Bốn file candidate vẫn là `draft`, không có approval reference. Planning copy revision được ghi trong metadata; đây chưa phải revision được coordinator duyệt công khai.
- Nhánh candidate có 12/20 bài VI/EN draft; UG04–UG07 không có trong nhánh này. Lần public đầu yêu cầu đủ 20 bản đã duyệt cùng một mã duyệt.
- Chưa được cung cấp application revision/môi trường hiện hành hoặc quyền truy cập UI user-level. Vì vậy chưa xác nhận nhãn, thao tác, quyền và trạng thái trong source khớp ứng dụng đang dùng. Không coi fixture hoặc code là bằng chứng sản phẩm đã cung cấp chức năng.
- Coordinator còn duyệt exact content revision và quyết định public release; QA sở hữu kiểm thao tác trên ứng dụng thật theo approved cases. Không có dev deployment trong Implement.

## Fingerprint bốn file Markdown

| File | SHA-256 |
| --- | --- |
| `ug08.vi.md` | `e3c43a7e7a4f95658eb602269939e30969a6f1edf59d3a6e222ee2dda23205d7` |
| `ug08.en.md` | `487d9da87594e31560aa6b356e2477872b8f91ce4c3ac4f58f599529ef555bae` |
| `ug09.vi.md` | `cb6c8a7c5ba4e4cb8d326629a9bbcee36b87b8bf1c17707a2ffe407f54ca6f0e` |
| `ug09.en.md` | `6d5c764c755cbccf16dd5aa33cf22df3cd3ff20214f3f0c3c5ba9ca1d35231de` |
