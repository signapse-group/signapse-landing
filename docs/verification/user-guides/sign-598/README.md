# SIGN-598 verification

Rà soát bản chuyển, các giới hạn đối chiếu và fingerprint nội dung ở [content-review.md](content-review.md); kết quả máy đọc ở [verification-after.json](verification-after.json).

Browser cuối trên collection thật: [browser-results.json](browser-results.json), 9/9 pass; ảnh mục lục VI desktop, EN mobile và panel Docs lần lượt ở [documentation-vi-1440.png](documentation-vi-1440.png), [documentation-en-375.png](documentation-en-375.png) và [docs-menu-vi.png](docs-menu-vi.png). Các trang bài draft không được sinh route.

Để kiểm tra renderer bài mà vẫn giữ trạng thái draft, một lượt riêng dùng bộ 20 mục approved fixture chỉ trong build local. Kết quả 6/6 nằm ở [approved-fixture-browser-results.json](approved-fixture-browser-results.json). Metadata và stub được khôi phục/xóa trước khi chạy browser cuối.
