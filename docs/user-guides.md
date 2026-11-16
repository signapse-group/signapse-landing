# Hướng dẫn công khai

LANDING lưu hướng dẫn trong `src/content/user-guides/` dưới dạng Markdown và dựng route ở build time. UG01–UG03 và UG10 lấy từ Planning revision [`ccf32983b8e984e3bac3855811e0e188c21914b8`](https://github.com/signapse-group/signapse-planing/tree/ccf32983b8e984e3bac3855811e0e188c21914b8); UG04–UG06 và UG08–UG09 lấy từ [`e734b0cdd39d1551724636487ab68eca7690da57`](https://github.com/signapse-group/signapse-planing/tree/e734b0cdd39d1551724636487ab68eca7690da57). Revision riêng được giữ trong frontmatter. Cả hai nguồn đều là bản nháp, không phải nội dung đã duyệt công khai. UI Documentation V1 tham chiếu PDF đính kèm SIGN-171, attachment 10269, được coordinator duyệt ngày 2026-11-13; SHA-256 `f2d500cb019195ee62a1ced9a466651bb65ed64b8887d2c0cd243c01fb4ca3c5`.

## Định danh và nguồn Markdown

Mỗi file có tên ổn định `ugNN.{locale}.md`, với ID `ug01`–`ug10` và locale `vi` hoặc `en`. Frontmatter giữ `articleId`, `locale`, `title`, `sourceRevision`, `approvalStatus` (`draft` hoặc `approved`) và `approvalReference`. H1 của bài lấy từ `title`; phần Markdown bắt đầu ở H2. Nội dung VI/EN giữ cùng các bước, điều kiện, ngoại lệ và kết quả, nhưng dùng nhãn giao diện phù hợp với locale.

Route công khai là `/{locale}/docs` cho mục lục và `/{locale}/docs/{articleId}` cho bài. Link nội bộ Markdown dùng đường dẫn locale đầy đủ, ví dụ `/vi/docs/ug02` hoặc `/en/docs/ug02`; fragment heading có thể nối sau path. Mục lục, menu Header, sidebar và `getStaticPaths` đều đọc cùng collection và nhóm theo `src/lib/user-guides.ts`:

| Nhóm | ID bài |
| --- | --- |
| Bắt đầu | UG01, UG02, UG03, UG10 |
| Theo dõi thị trường | UG04, UG05, UG06 |
| Làm việc với AI | UG07 |
| Tra cứu và xử lý vấn đề | UG08, UG09 |

## Điều kiện sinh route

`getPublicGuideEntries` chỉ trả nội dung khi collection có chính xác 20 entry, đủ mười ID × hai locale, mỗi entry mang trạng thái `approved`, không trùng, và tất cả dùng cùng `approvalReference` không rỗng. Nếu bộ thiếu, còn draft, trùng hoặc trộn mã duyệt, mục lục không có link bài và static route bài không được sinh. Vì vậy bộ 20 bản nháp hiện tại chưa tạo route bài; URL trực tiếp trả 404.

Trạng thái collection hiện tại:

- Collection hiện có đủ 20 bản VI/EN: UG01–UG03 và UG10 lấy từ revision `ccf32983b8e984e3bac3855811e0e188c21914b8`; UG04–UG09 lấy từ `e734b0cdd39d1551724636487ab68eca7690da57`.
- UG07 VI/EN dùng `articleId: ug07`, locale tương ứng, link nội bộ đúng locale tới UG02, UG03, UG05 và UG08. Nội dung bao quát quyền/lượt AI, watchlist hiện tại, câu hỏi mới/hỏi tiếp, kiểm căn cứ và giới hạn, lịch sử cùng xử lý lỗi theo SIGN-173 AC2–AC5.
- Cả 20 bản vẫn `draft`, chưa có mã duyệt và không sinh route bài công khai.
- Coordinator giữ quyền đối soát nội dung, duyệt đúng phiên bản và quyết định phát hành. Không đổi trạng thái sang `approved` trước khi có hồ sơ duyệt cho đủ bộ.

Trước lần build công khai đầu tiên, coordinator cần xác nhận một mã duyệt chung và phiên bản nội dung chính xác. DASHBOARD/QA đối chiếu nhãn, thao tác, quyền/lượt, trạng thái và hành trình ứng dụng theo approved cases của từng issue QA; LANDING không tuyên bố thay cho kiểm chứng ứng dụng. Với UG07, QA ghi revision và môi trường theo SIGN-604; coordinator duyệt nội dung và quyết định public release theo SIGN-170. Các bài chưa được duyệt giữ trạng thái `draft` và URL trực tiếp tiếp tục trả 404. Dữ liệu kiểm thử có kiểm soát chỉ dùng để kiểm tra điều kiện build/local, không chứng minh producer đã cung cấp tính năng.

Không đưa token, thông tin cá nhân hoặc dữ liệu kiểm thử cần bảo vệ vào Markdown, ảnh chụp hay yêu cầu hỗ trợ. Hướng dẫn Telegram yêu cầu che bot token và chỉ gửi thông tin chẩn đoán sau khi bỏ bí mật.
