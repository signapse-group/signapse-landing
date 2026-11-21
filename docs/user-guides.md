# Hướng dẫn công khai

Markdown trong [collection User Guide](../src/content/user-guides/) là nguồn nội dung duy nhất của SIGN-170. Các chỉnh sửa VI/EN được thực hiện tại đây. Bản Planning đã chốt ngày 13/11 được giữ trong [lịch sử Git](https://github.com/signapse-group/signapse-planing/tree/b1915e0c96e7e758326942dc081b1b9adc6574c0/docs/user-guide) để truy vết. Jira giữ yêu cầu, thiết kế và tiêu chí nghiệm thu.

## Định danh và nguồn Markdown

Mỗi file có tên ổn định `ugNN.{locale}.md`, với ID `ug01`–`ug10` và locale `vi` hoặc `en`. Frontmatter giữ `articleId`, `locale`, `title`, `sourceRevision`, `approvalStatus` (`draft` hoặc `approved`) và `approvalReference`. H1 của bài lấy từ `title`; phần Markdown bắt đầu ở H2. Nội dung VI/EN giữ cùng các bước, điều kiện, ngoại lệ và kết quả, nhưng dùng nhãn giao diện phù hợp với locale.

Route công khai là `/{locale}/docs` cho mục lục và `/{locale}/docs/{articleId}` cho bài. Link nội bộ Markdown dùng đường dẫn locale đầy đủ, ví dụ `/vi/docs/ug02` hoặc `/en/docs/ug02`; fragment heading có thể nối sau path. Mục lục, menu Header, sidebar và `getStaticPaths` đều đọc cùng collection và nhóm theo `src/lib/user-guides.ts`:

| Nhóm | ID bài |
| --- | --- |
| Bắt đầu | UG01, UG02, UG03, UG10 |
| Theo dõi thị trường | UG04, UG05, UG06 |
| Làm việc với AI | UG07 |
| Tra cứu và xử lý vấn đề | UG08, UG09 |

## Đối chiếu dashboard dev — 2026-11-16

- Revision dashboard `3a7bb52435063a092f0adbf2e46d077ff7a70133`, đọc từ `/api/build-revision`. Đã kiểm trong phiên đăng nhập các nhãn ở Tổng quan (VI/EN), Account, Usage limits, điều khiển workspace/watchlist, bài tin mở từ bằng chứng, điều khiển biểu đồ và việc chọn hội thoại đã lưu trong Ask Signapse. Đã xem cấu hình Telegram VI/EN, hộp thoại tạo lệnh liên kết và nút gửi thử.
- Nội dung hợp nhất giữ điều kiện của [SIGN-602](https://signapse-group.atlassian.net/browse/SIGN-602?focusedCommentId=11410) ngay trước bước mở lịch sử. Tên điều khiển và đường đi lấy theo dashboard dev. Các lưu ý về quyền dùng mã dashboard cùng revision để đối chiếu.
- Phạm vi kiểm chỉ đọc. Các nhánh lưu, lưu một phần, hết quyền/hạn mức, phản hồi AI mới, chú thích biểu đồ và thao tác gửi/nhận Telegram còn cần QA theo [SIGN-171](https://signapse-group.atlassian.net/browse/SIGN-171), [SIGN-172](https://signapse-group.atlassian.net/browse/SIGN-172), [SIGN-173](https://signapse-group.atlassian.net/browse/SIGN-173) và [SIGN-174](https://signapse-group.atlassian.net/browse/SIGN-174).

## Điều kiện sinh route

`getPublicGuideEntries` chỉ trả nội dung khi collection có chính xác 20 entry, đủ mười ID × hai locale, mỗi entry mang trạng thái `approved`, không trùng, và tất cả dùng cùng `approvalReference` không rỗng. Nếu bộ thiếu, còn draft, trùng hoặc trộn mã duyệt, mục lục không có link bài và static route bài không được sinh.

Trạng thái collection hiện tại:

- Đủ 20 bản VI/EN. Frontmatter ghi revision Planning dùng làm nền; các thay đổi sau khi nhập nằm trong lịch sử Git của Landing.
- UG07 VI/EN dùng `articleId: ug07`, locale tương ứng, link nội bộ đúng locale tới UG02, UG03, UG05 và UG08. Nội dung bao quát quyền/lượt AI, watchlist hiện tại, câu hỏi mới/hỏi tiếp, kiểm căn cứ và giới hạn, lịch sử cùng xử lý lỗi theo SIGN-173 AC2–AC5.
- Ngày 2026-11-16, coordinator duyệt đủ 20 bản đã hợp nhất cho SIGN-170 và giao triển khai lên Landing dev. Các tệp dùng cùng `approvalReference` là `SIGN-170: coordinator 2026-11-16`. Phát hành production là bước riêng.
- Coordinator giữ quyền đối soát nội dung, duyệt đúng phiên bản và quyết định phát hành. Không đổi trạng thái sang `approved` trước khi có hồ sơ duyệt cho đủ bộ.

Hồ sơ duyệt gắn với đúng phiên bản nội dung và cùng một mã cho toàn bộ đợt. DASHBOARD/QA đối chiếu nhãn, thao tác, quyền/lượt, trạng thái và hành trình ứng dụng theo approved cases của từng issue QA; LANDING không tuyên bố thay cho kiểm chứng ứng dụng. Với UG07, QA ghi revision và môi trường theo SIGN-604; coordinator duyệt nội dung và quyết định public release theo SIGN-170. Các bài chưa được duyệt giữ trạng thái `draft` và URL trực tiếp tiếp tục trả 404. Dữ liệu kiểm thử có kiểm soát chỉ dùng để kiểm tra điều kiện build/local, không chứng minh producer đã cung cấp tính năng.

Không đưa token, thông tin cá nhân hoặc dữ liệu kiểm thử cần bảo vệ vào Markdown, ảnh chụp hay yêu cầu hỗ trợ. Hướng dẫn Telegram yêu cầu che bot token và chỉ gửi thông tin chẩn đoán sau khi bỏ bí mật.
