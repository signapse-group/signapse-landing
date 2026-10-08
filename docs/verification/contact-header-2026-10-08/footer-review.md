# Review footer Signapse — 2026-10-08

Đây là snapshot review trước lượt triển khai footer/typography được người dùng duyệt sau đó. Findings và số đo dưới đây mô tả trạng thái tại thời điểm review, không phải kết luận về Footer sau thay đổi.

Footer hiện có ba nhóm: brand/giới thiệu, năm capability links và liên hệ; phía dưới là copyright/disclaimer. Review này chỉ đánh giá footer hiện tại, không sửa source hoặc copy footer.

Base/HEAD: `9d4b31fa23a33f4d3c84bcde5a9a2d62aaab8965`. Đọc [LandingFooter.astro](../../../src/components/landing/LandingFooter.astro), [BlogShell.astro](../../../src/components/landing/BlogShell.astro), [dictionary VI/EN](../../../src/i18n/messages.ts), [landing-access.ts](../../../src/components/landing/landing-access.ts), [design rules](../../design.md) và contract planning cùng các quyết định người dùng hiện hành. Footer được dùng chung trên landing và Blog; không giả định có đăng nhập hoặc ứng dụng sản phẩm trong các kiểm tra local.

## Kết quả và ưu tiên

Không xác nhận link chết hoặc lỗi route trong footer. Có hai điểm nên chỉnh về nhãn link, cùng một đề xuất về vùng bấm mobile. Những điểm này không chặn contribution contact/header vừa thực hiện; sửa footer cần scope riêng do nội dung landing đã được chốt.

### 1. “Đặt lịch demo / Book a demo” tạo kỳ vọng có bước đặt lịch

- **Vị trí:** `LandingFooter.astro:69`, `messages.ts:430` và `messages.ts:882`.
- **Hiện tại:** link dẫn tới `#access`, hoặc `/{locale}#access` từ Blog. Đích là form tên/email/lời nhắn, không có chọn thời gian, xác nhận slot hoặc đặt lịch tự động.
- **Tác động:** người muốn đặt lịch phải tự mô tả nhu cầu và chờ liên hệ; nhãn chưa thể hiện rõ thao tác thực tế.
- **Sửa nhỏ đề xuất:** dùng **“Liên hệ / Contact”** để thống nhất với header, hoặc **“Trao đổi về demo / Discuss a demo”** nếu muốn nhấn vào nhu cầu xem demo. Giữ nguyên route và form; không cần thêm luồng đặt lịch.

### 2. Accessible name của logo mô tả trang About nhưng đích là Home

- **Vị trí:** `LandingFooter.astro:39`, `messages.ts:434` và `messages.ts:886`.
- **Hiện tại:** tên truy cập là “Về Signapse / About Signapse”; URL thực tế là `/vi` hoặc `/en`. Chữ nhìn thấy là “Signapse”, không có link About riêng.
- **Tác động:** người dùng screen reader nhận mô tả đích không khớp với hành vi; họ được đưa về trang chủ thay vì một trang giới thiệu.
- **Sửa nhỏ đề xuất:** đổi accessible name thành **“Signapse — Trang chủ / Signapse — Home”**. Không thêm trang About chỉ để khớp nhãn cũ.

### 3. Đề xuất không chặn: tăng vùng bấm cho các link mobile

- **Vị trí:** `LandingFooter.astro:59`, `LandingFooter.astro:69` và `LandingFooter.astro:75`.
- **Đo thực tế:** năm product links và demo link cao **20 px**, email cao **16 px**, phone link cao **44 px** ở cả 1440 và 375 px. [Số đo](footer-links.json) và [ảnh mobile](footer-vi-375.png).
- **Tác động:** product/email khó bấm hơn phone trên màn cảm ứng. Đề xuất thêm chiều cao tối thiểu 44 px cho các link quan trọng trên mobile, giữ treatment chữ hiện có.
- **Giới hạn đánh giá:** đây không phải kết luận vi phạm WCAG. Tiêu chí 2.5.8 cho phép ngoại lệ khoảng cách; cần đánh giá khoảng cách và bố cục thực tế trước khi kết luận. [W3C — Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).

## Các điểm đang đúng

| Hạng mục | Bằng chứng/nhận xét |
| --- | --- |
| Đích link | Có chín links: home, năm capability anchors, contact, mailto và tel. Các route/anchor thực tế tồn tại; không có dashboard hoặc placeholder. |
| Blog → landing | `BlogShell.astro` truyền `isLandingPage={false}`; footer tạo `/{locale}#…` và giữ đúng VI/EN. |
| Năm product links | Mở detail/popover trong Hero, không phải trang sản phẩm riêng. Hành vi này khớp contract hiện tại; Strategy building cũng có detail, không có demo thứ năm. |
| Liên hệ | Email có mailto; `0933.80.99.36` có `tel:+84933809936`. HTML Astro giữ link khi không có JavaScript. |
| Responsive | Ảnh VI/EN ở 1440/375 px đọc được; shared-shell coverage ở 1440/1024/375 px không overflow trên landing/root và Blog list/detail/error states. |
| Focus | Cả chín links nhận focus. Product/demo giữ native outline `auto 1px`; brand/email/phone có outline `solid 2px` trong Chromium. Không có bằng chứng focus bị loại bỏ. [Đo focus](visual-focus.json). |
| Disclaimer | Giữ thông báo phân tích/tự động hóa không phải cam kết lợi nhuận. Review này không đổi claim đã duyệt. |

## Hai trục review

**Requirement adherence:** footer giữ composition và capability anchors của contract, email/phone theo quyết định đã chốt, không dashboard. Các nhãn đề xuất ở mục 1–2 là cải thiện UX/content để người dùng cân nhắc, không tự thay contract hoặc tạo scope mới.

**Correctness & Standards:** không thấy lỗi route, mất locale, placeholder đang bật hoặc lỗi render được xác nhận. Hai bất nhất nhãn link có tình huống cụ thể; các đề xuất vùng bấm không được ghi thành WCAG failure. Footer là HTML Astro nên không thêm fetch, state hoặc listener riêng theo số người truy cập.

**Kết luận:** footer có thể tiếp tục dùng; ưu tiên chốt hai nhãn ở mục 1–2 trước khi mở rộng nội dung. Không cần xây thêm trang/flow để xử lý hai điểm này.

## Kiểm chứng và giới hạn

Bốn checks `pnpm check`, `pnpm lint`, `pnpm format:check`, `pnpm build` pass cho contribution contact/header. Browser coverage liên quan có 24 pass trong lượt 28 tests; bốn failures là expectation cũ còn đòi viền card 1 px và selector ảnh `footer` trùng footer bên trong demo. Sau cập nhật tests, bốn cases chạy lại pass, không retry và source không đổi. [Lượt đầu](browser-initial.json), [lượt sau](browser-after.json).

Ảnh và focus được kiểm thêm trên static HTML đã build với page/context mới cho từng locale/viewport, độc lập với Worker/API. Form giữ nền `rgb(8, 35, 46)`, viền ngoài 0 px và viền input 1 px. Footer source giữ nguyên so với HEAD. Các đo focus xác nhận style Chromium; không phải audit contrast hoặc thiết bị cảm ứng vật lý.

Chưa kiểm production, cuộc gọi thật, email delivery hoặc backend thực; không kiểm/chứng nhận pháp lý và WCAG toàn diện. Model không đổi nên không chạy lại model tests. Chưa commit, push hoặc deploy.
