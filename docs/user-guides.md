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

`getPublicGuideEntries` chỉ trả nội dung khi collection có chính xác 20 entry, đủ mười ID × hai locale, mỗi entry mang trạng thái `approved`, không trùng, và tất cả dùng cùng `approvalReference` không rỗng. Nếu bộ thiếu, còn draft, trùng hoặc trộn mã duyệt, mục lục không có link bài và static route bài không được sinh. Vì vậy 18 bản nháp hiện tại không trở thành một lần phát hành riêng; URL trực tiếp của chúng trả 404.

Trạng thái collection hiện tại:

- UG01–UG03, UG10, UG04–UG06 và UG08–UG09 có đủ 18 bản VI/EN. UG01–UG03 và UG10 lấy từ revision `ccf32983b8e984e3bac3855811e0e188c21914b8`; UG04–UG06 và UG08–UG09 lấy từ `e734b0cdd39d1551724636487ab68eca7690da57`.
- Cả 18 bản vẫn `draft`, chưa có mã duyệt và không sinh route công khai.
- UG07 VI/EN và approval cho đủ 20 bản chưa được cung cấp cho nhánh này.
- Coordinator giữ quyền đối soát nội dung, duyệt đúng phiên bản và quyết định phát hành. Không đổi trạng thái sang `approved` trước khi có hồ sơ duyệt cho đủ bộ.

Trước lần build công khai đầu tiên, coordinator cần xác nhận đủ mười bài/hai mươi bản, một mã duyệt chung và phiên bản nội dung chính xác. Mỗi bản cần được đối soát với phiên bản ứng dụng đang triển khai để xác nhận nhãn giao diện, thao tác, quyền/quota và các trạng thái thực tế. Planning draft ghi nhận các tham chiếu app lịch sử `ed7eaff` và `095f21b`; exact revision ứng dụng và user-level access hoặc bằng chứng UI tương đương chưa được cung cấp, nên chưa có bằng chứng rằng thao tác trong bài khớp app đang triển khai. Các bản UG04–UG06 hiện nhập từ draft source revision `e734b0cdd39d1551724636487ab68eca7690da57`, với UG05 bổ sung retry có điều kiện theo AC5; UG08–UG09 cũng vẫn là draft. Dữ liệu kiểm thử có kiểm soát chỉ dùng để kiểm tra điều kiện build/local, không chứng minh producer đã cung cấp tính năng.

Không đưa token, thông tin cá nhân hoặc dữ liệu kiểm thử cần bảo vệ vào Markdown, ảnh chụp hay yêu cầu hỗ trợ. Hướng dẫn Telegram yêu cầu che bot token và chỉ gửi thông tin chẩn đoán sau khi bỏ bí mật.
