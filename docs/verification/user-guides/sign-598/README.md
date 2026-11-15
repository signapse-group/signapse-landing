# SIGN-598 verification

Rà soát bản chuyển, các giới hạn đối chiếu và fingerprint nội dung ở [content-review.md](content-review.md); kết quả máy đọc ở [verification-after.json](verification-after.json).

Browser sau khi cập nhật base `dev` theo SIGN-605: [browser-after-base-sync.json](browser-after-base-sync.json), 10/10 pass, không retry. Kiểm VI/EN, desktop/mobile reflow, axe, Docs bằng hover/bàn phím/cảm ứng và mười URL draft UG04–UG06/UG08–UG09 trả 404 không lộ body. Lượt trước trên collection 14 bản vẫn nằm ở [browser-results.json](browser-results.json), 9/9 pass. Ảnh mục lục VI desktop, EN mobile và panel Docs lần lượt ở [documentation-vi-1440.png](documentation-vi-1440.png), [documentation-en-375.png](documentation-en-375.png) và [docs-menu-vi.png](docs-menu-vi.png); đây là ảnh index rỗng, không phải bài đã công khai.

Để kiểm tra renderer bài mà vẫn giữ trạng thái draft, một lượt riêng dùng bộ 20 mục approved fixture chỉ trong build local. Kết quả 6/6 nằm ở [approved-fixture-browser-results.json](approved-fixture-browser-results.json). Metadata và stub được khôi phục/xóa trước khi chạy browser cuối. Fixture chứng minh renderer/layout và khả năng bàn phím/reflow; không chứng minh nhãn hoặc thao tác đã có trên ứng dụng.

Sau khi base thêm UG08/UG09, capture fixture tạm thời dùng chính sáu bài UG04–UG06, cộng placeholder UG07 cục bộ để mở đủ batch; spec 1/1 và report ở [approved-fixture-capture-results.json](approved-fixture-capture-results.json). Ảnh body bài: [UG04 VI desktop](ug04-vi-1440-approved-fixture.png), [UG05 EN desktop](ug05-en-1440-approved-fixture.png), [UG06 VI mobile](ug06-vi-375-approved-fixture.png). Toàn bộ metadata thật và file placeholder đã được khôi phục/xóa sau lượt chụp.
