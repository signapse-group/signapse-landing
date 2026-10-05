# Public blog — khảo sát và thiết kế đã chốt

Ngày khảo sát và chốt thiết kế: **2026-10-05**. User đã **chọn bộ B** và cho phép xóa các bộ còn lại. Canvas hiện chỉ giữ hai màn của B; A/C được bảo toàn trong backup trước khi xóa. **Persistence của lần dọn canvas này chưa được xác minh**.

## Nguồn và phạm vi

Đã đọc [SIGN-18 — Editorial content management](https://signapse-group.atlassian.net/browse/SIGN-18), toàn bộ năm story con và các subtask liên quan. User yêu cầu prototype blog public; phần quản trị đã có và không thuộc phạm vi chỉnh sửa.

| Story | Kết quả người dùng | Trạng thái Jira khi khảo sát | Liên quan prototype |
| --- | --- | --- | --- |
| [SIGN-56](https://signapse-group.atlassian.net/browse/SIGN-56) | Soạn, lưu và tiếp tục chỉnh sửa bài | Ready for QA | Ràng buộc structured content, URL và slug; không dựng UI quản trị. |
| [SIGN-57](https://signapse-group.atlassian.net/browse/SIGN-57) | Visitor khám phá và đọc bài công khai | Ready for QA | Scope trực tiếp: danh sách, phân trang, chi tiết bằng slug, locale và anonymous access. |
| [SIGN-58](https://signapse-group.atlassian.net/browse/SIGN-58) | Tìm và xem bài để quản lý | Ready for QA | Tìm kiếm, filter và sort của quản trị không chuyển sang public. |
| [SIGN-59](https://signapse-group.atlassian.net/browse/SIGN-59) | Xuất bản và gỡ xuất bản | Ready for QA | Chỉ `PUBLISHED` được đọc; `publishedAt` giữ thời điểm xuất bản đầu tiên. |
| [SIGN-60](https://signapse-group.atlassian.net/browse/SIGN-60) | Xóa bài không còn duy trì | Ready for QA | Lần đọc mới không trả bài đã xóa; public không phân biệt lý do bài không khả dụng. |

[SIGN-96 — BE public reading](https://signapse-group.atlassian.net/browse/SIGN-96) và [SIGN-107 — FE public Articles](https://signapse-group.atlassian.net/browse/SIGN-107) đều **Done**. Đây là trạng thái tracker, không chứng minh hosted QA đã chạy. Epic còn **In Progress**.

## API đã đối chiếu

Nguồn hiện hành do user cung cấp: [OpenAPI dev](https://dev-api.signapse.cloud/v3/api-docs). Đã đọc trực tiếp qua HTTPS và gọi hai GET public không gửi credential.

| Endpoint | Contract quan sát được |
| --- | --- |
| `GET /blogs/public` | `getPublicBlogPosts`, `x-signapse-auth.type = public`, `required = false`; tham số pageable. Response `PageBlogPostListResponse`. |
| `GET /blogs/public/{slug}` | `getPublicBlogPost`, public; response `BlogPostResponse`. |

List item có `id`, `title`, `slug`, `shortDescription`, `status`, `publishedAt`, `createdDate`, `lastModifiedDate`. Detail thêm `content` và `contentSchemaVersion`. Pageable có `page >= 0`, `size >= 1`, `sort`; response có tổng bài, tổng trang, trang hiện tại và first/last. UI public giữ thứ tự `publishedAt DESC, id DESC` theo epic/story và không cung cấp lựa chọn sort.

Lần đọc list với `page=0&size=1` trả một bài `PUBLISHED`; đọc detail bằng slug trả `contentSchemaVersion = 1`. Mẫu content có `h1`, `h2`, paragraph `p`, text marks và danh sách qua `indent`/`listStyleType`. OpenAPI mô tả content là array object với `additionalProperties`, **không công bố toàn bộ schema của editor**; mẫu đọc được không xác nhận danh mục capability đầy đủ. Khi triển khai, dùng renderer/version contract hiện có của Personal Note/Article.

Không có field author, cover image, category hoặc reading time trong hai response đã đọc. Prototype không phụ thuộc những field đó. Không kiểm tra BE source/tests, không cần application checkout và không thực hiện write API.

## Thiết kế đã chốt

Document: [landing.pen](landing.pen). Hai frame tiếng Việt, desktop 1440 nằm cùng hàng bên phải các trang landing, cách nhau 160 px. Giữ nguyên bố cục/nội dung của B, bỏ nhãn biến thể trong tên frame và đưa hai màn lên vị trí hàng đầu của khu vực blog.

| Frame | ID | Vị trí/kích thước quan sát |
| --- | --- | --- |
| Blog public · List · VI · Desktop 1440 | `ARjYP` | x=10558, y=0, 1440×1687 |
| Blog public · Detail · VI · Desktop 1440 | `M0W0m` | x=12158, y=0, 1440×2007 |

**Danh sách:** intro trắng; bài mới nhất có vùng navy lớn với tiêu đề 36 px và nút đọc bài. Hai bài tiếp theo xếp bên cạnh, ba bài còn lại chia ba cột bên dưới; phân trang ở cuối. Điểm nhấn luôn là phần tử đầu theo thứ tự xuất bản, không thêm field featured/pinned hoặc lựa chọn của biên tập viên. Sáu bài và tổng 18 bài là fixture minh họa, không phải dữ liệu thật từ API và không chốt page size production.

**Trang đọc:** intro navy với heading 60 px, metadata/navigation ở rail 216 px bên trái và nội dung trắng 680 px bên phải; body 18 px với leading 1.75. Có ngày xuất bản/cập nhật và link về list. Nội dung mẫu thể hiện heading, đoạn văn và danh sách; tiêu đề, mô tả, slug và ngày xuất bản khớp bài đầu trong list.

Không thêm category, author, cover, reading time hoặc chức năng ngoài contract. Nội dung minh họa phục vụ bố cục, chưa phải copy marketing được duyệt.

| Màn đã chốt | Export PNG 2× | QA nhỏ |
| --- | --- | --- |
| Danh sách | [List desktop](exports/public-blog/list-desktop.png), 2880×3374 | [List QA](../../verification/blog-public/variant-b-list-desktop.png) |
| Trang đọc | [Detail desktop](exports/public-blog/detail-desktop.png), 2880×4014 | [Detail QA](../../verification/blog-public/variant-b-detail-desktop.png) |

Header `sR6cy`, Footer `Upp8f`, Section `N3ahM`, Content Container `V6Eu5T`, Heading Group `Z5Cor` và Button `Xo4nT` được dùng bằng linked instances. Styling dùng variables của foundation hiện hành: Geist/Geist Mono, navy/white, mint theo surface, spacing và radius có sẵn. Không thêm variable hoặc reusable origin; không sửa shared origins/landing frames. Trạng thái duyệt được ghi nhận từ quyết định của user trong tài liệu này.

Ảnh là block trong structured content khi bài có URL hợp lệ, không phải ảnh bìa/thumbnails của danh sách. Fixture hiện tại chỉ cần text để duyệt cấu trúc đọc; fallback ảnh và toàn bộ capability editor cần kiểm chứng trong implementation.

## Contract cần giữ khi triển khai

- Landing vẫn dẫn tới `{PUBLIC_APP_ORIGIN}/{locale}/articles` theo [LANDING.md](../LANDING.md). Prototype không thay ownership Articles, route hoặc source Astro; URL detail của ứng dụng sản phẩm cần giữ contract slug đã có.
- Đọc public không cần đăng nhập hoặc `blog:read`. Chỉ trả `PUBLISHED`; không có thao tác quản trị trong nội dung trang.
- Locale chỉ đổi chrome/thông báo, không lọc hay dịch bài viết. Cùng slug mở cùng nội dung; ngày được định dạng theo locale giao diện.
- Bài chưa public, đã gỡ, đã xóa và slug không tồn tại dùng cùng kết quả không khả dụng; không lộ nội dung hoặc xác nhận riêng bài private.
- Lần đọc mới phản ánh update/unpublish/delete; không yêu cầu thu hồi nội dung đã tải trong phiên hiện tại.
- Render structured content và URL an toàn. Ảnh lỗi chỉ ảnh hưởng block ảnh, giữ alt/caption khi có và giữ phần nội dung hợp lệ còn lại.
- Ở viewport hẹp, dùng compact header/stacked footer hiện có; gutters 24/16 px. Chuyển các vùng bài sang luồng tuần tự, đặt rail metadata trước nội dung và reflow pagination. Giữ thứ tự 1–6, không scale toàn trang hoặc gây page-level overflow. Chưa có frame mobile trong thiết kế này.
- Title là link chính có tên rõ; dấu mũi tên dùng cùng đích. Phân trang cần current/disabled semantics và focus-visible; landmarks, keyboard và screen reader thuộc verification trong ứng dụng chạy thật.

Copy UI tối thiểu để handoff:

| VI | EN |
| --- | --- |
| Bài viết | Articles |
| Bài viết mới nhất | Latest articles |
| Tất cả bài viết | All articles |
| Xuất bản | Published |
| Cập nhật | Updated |
| Trang trước / Trang sau | Previous page / Next page |
| Hiển thị {from}–{to} trong {total} bài viết | Showing {from}–{to} of {total} articles |
| Trang {page} trên {totalPages} | Page {page} of {totalPages} |

Common states giữ trong contract, không thêm frame riêng: danh sách rỗng có thông báo chưa có bài; bài không khả dụng có link về list; lỗi tải có thử lại bằng ngôn ngữ giao diện. Không thêm search/filter/sort, đề xuất, bình luận, chia sẻ, newsletter, cover upload, CTA marketing hoặc SEO vào scope SIGN-57.

## Kiểm chứng và lưu

Đã kiểm tra render cả ba bộ trước lựa chọn và hai màn B sau dọn canvas. Screenshot B trước/sau dọn trùng bytes; không đổi nội dung hay bố cục trong màn. Canvas còn 17 top-level boards: 15 boards có sẵn giữ vị trí/kích thước đã quan sát, cộng hai màn blog. Kiểm tra bindings có 124 variables, không phát hiện reference thiếu trong fill/stroke/font/gap/radius đã đọc; font sử dụng `$font/body` và `$font/mono`. Font nhỏ nhất là 12 px ở footer có sẵn.

Tương phản tính từ token: navy/white **18.72:1**, muted text/white **6.71:1**, link strong mint/white **6.06:1**, muted text/navy **10.05:1**. Đây là kiểm tra palette/canvas, không phải chứng nhận accessibility runtime.

Host visitor có bounds lệch tọa độ ở một số instance sau slot replacement, và raw-instance visitor với context gặp TypeError. Đã dùng resolved-instance reads, tách mutation khỏi read/render và đối chiếu screenshot cùng structure. Không coi bounds đó là bằng chứng kiểm chứng overflow tự động đầy đủ.

Screenshot QA của B nằm ở [docs/verification/blog-public](../../verification/blog-public/). QA A/C chuyển sang [archive/pre-selection](../../verification/blog-public/archive/pre-selection/); không dùng làm handoff. Chỉ hai PNG của thiết kế đã chốt được export vào `exports/public-blog/`; đã đọc PNG header để xác nhận kích thước 2×. Chưa chạy check/lint/build/browser vì không thay source/config hoặc triển khai ứng dụng.

Backup trước khi xóa A/C: [landing.before-blog-selection.pen](landing.before-blog-selection.pen), 2,849,456 bytes, SHA-256 `2C011B1EFDC22E04E54EACC065D164230F6BD51DD2827713E599185E58D91A4E`. Đã đọc lại backup bằng Pen và xác nhận đủ sáu frame A/B/C cùng 124 variables, nên có thể phục hồi các phương án đã loại. Giữ các backup trước đó phục vụ lịch sử thiết kế.

Canvas đã dọn xong; cần Save trong Pen và đọc lại bản sao mới từ đĩa để xác minh file đích chỉ còn hai màn đã chốt. Chưa báo persistence của lần dọn này.

Chưa đăng attachment/comment lên Jira, triển khai hoặc sửa phần manage blog. Export và giữ backup theo [prototype skill](../../../.agents/skills/prototype/SKILL.md).
