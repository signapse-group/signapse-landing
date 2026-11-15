# SIGN-598 — rà soát bản chuyển UG04–UG06

## Bản nội dung

- Nguồn Planning: revision `e734b0cdd39d1551724636487ab68eca7690da57`, sáu draft ở `docs/user-guide/{vi,en}/04-reading-the-overview.md`, `05-news-events-and-evidence.md` và `06-reading-market-charts.md`.
- LANDING giữ ID ổn định `ug04`–`ug06`, locale `vi`/`en`, title trong frontmatter, body bắt đầu từ H2, `approvalStatus: draft` và `approvalReference: ''`.
- Sáu body khớp nguồn sau khi bỏ H1/banner nháp, đổi 36 link nội bộ sang route theo locale, chuẩn hóa Markdown table và thêm câu retry có điều kiện trong UG05 theo AC5. Không đổi bố cục reader.
- VI/EN có cấu trúc heading tương ứng và cùng các bước, điều kiện, trạng thái, ngoại lệ. Link UG08 là `/vi/docs/ug08` hoặc `/en/docs/ug08`. SIGN-605 đã bàn giao UG08/UG09 trên `dev` tại `1e83ee2a970c9c0d006b39fc0ba015c112034f0c` (Worker `8de48cec-ca71-45b4-9ba0-c4acbef599c3`), nhưng cả hai locale của UG08 vẫn là draft. Smoke của SIGN-605 xác nhận URL draft trả 404/no body; do bộ 20 bài chưa được duyệt, hiện chưa thể mở nội dung đích. Link path và locale đã được kiểm tra.

## Đối chiếu contract

- **UG04 / AC2:** toàn bộ watchlist; tối đa năm sự kiện mới theo watchlist khác số đếm 24 giờ; tối đa năm tin mới nhất toàn Signapse khác số đếm sáu giờ; trạng thái 0, trống, thiếu quyền và tải lỗi được phân biệt.
- **UG05 / AC3:** đọc theo sự kiện → bằng chứng → bài nguồn khi có quyền/link; thiếu bằng chứng/link/nguồn chưa mở được được ghi nhận là chưa kiểm chứng. Điểm tin cậy không phải xác suất giá; lặp lại cùng nguồn không phải xác nhận độc lập; độ mâu thuẫn chưa giải quyết giữ ở trạng thái chưa chắc chắn.
- **UG06 / AC4–AC5:** chọn asset/khung nến, kiểm timezone, phân biệt HOT_EVENT và WARM_EPISODE, timestamp chú thích và thời điểm phản ứng giá; mô tả dữ liệu thiếu/cũ/lỗi, kiểm context và tải lại chỉ khi UI có thao tác.
- Cả ba bài dẫn UG08 khi cần; không thêm dữ liệu thị trường mẫu, thông tin cá nhân, token hoặc ảnh kiểm thử. Scan nội dung tìm email/điện thoại/token mẫu trả 0 kết quả.

## Trạng thái và giới hạn

- Nội dung chưa được coordinator duyệt. Collection hiện có 18/20 bản và cả 18 vẫn là draft, chưa có approval reference; lần public đầu vẫn phải có đủ 10 bài/20 bản cùng một approval reference.
- Môi trường đối chiếu được chỉ định là `https://dev-dashboard.signapse.cloud`, nhưng chưa có exact app revision hoặc UI user-level/evidence tương đương. Thử đọc origin từ worker session trả HTTP 429; browser tool cũng không truy cập được. Do đó nhãn, quyền, trạng thái và thao tác trong draft chưa được đối chiếu; chưa kết luận chúng khớp hoặc khác ứng dụng.
- UG08 thuộc SIGN-174/SIGN-605 và đã được bàn giao trên dev dưới dạng draft. Link route dùng đúng ID/locale của reader; mở nội dung đích chưa thể kiểm tra vì approval gate cố ý giữ URL bài ở 404 cho đến khi đủ bộ 20 bản được duyệt.
- Local fixture tạm thời dùng 20 mục được đánh dấu approved với approval reference giả để kiểm reader. Sáu bài UG04–UG06 render, có focus bằng bàn phím, TOC đúng locale, axe sạch và không tràn ngang ở 1440/768/375 px. Fixture và stub đã được xóa; metadata thật được khôi phục về draft trước lượt browser cuối. Đây là kiểm tra renderer, không xác nhận app hoặc công khai bài.
- Sau khi đồng bộ base SIGN-605, lượt capture bổ sung **1/1** cho body UG04 VI desktop, UG05 EN desktop và UG06 VI mobile; report và ảnh được lưu trong README evidence. Capture đầu tiên kỳ vọng sai heading đầu bài UG05 (`Main reading flow` thay vì `Goal`); đã sửa harness tạm và chạy lại pass, không thay source content. UG07 placeholder và metadata approved fixture đã được khôi phục/xóa.
- Browser cuối trên collection thật xác nhận index không liệt kê bài và cả sáu URL trực tiếp trả 404, không có body bài. Bởi vậy screenshots kèm theo chỉ là mục lục rỗng/menu dùng chung; không đại diện cho bài UG04–UG06 đã công khai.

## Fingerprint sáu file Markdown

| File | SHA-256 |
| --- | --- |
| `ug04.vi.md` | `447e2968567881bf81a7e4087ff4975538cda7e299230f75e2d831b4555711e8` |
| `ug04.en.md` | `cd54c675b269fb7fdb6067c6dc1503943d19dcda86c296a3a9b7284bb1710f31` |
| `ug05.vi.md` | `70b501677616accbe4cafee92abd46b95c31679a8bd4c28a672724a01cc63ade` |
| `ug05.en.md` | `341baccaab79c10d0bceeb51dc3bbb44a2a133224f976a69917322639e11a7d1` |
| `ug06.vi.md` | `eda08efeefabfebbb516d404f2c1fac709ccfcf59a4bda693a871c7951809a21` |
| `ug06.en.md` | `343d31a524fdd345fcac2786254b0e9bfcc5efac01d5e9bea516d7f0ec530345` |
