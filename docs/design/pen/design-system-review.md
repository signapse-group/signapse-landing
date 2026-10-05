# Review design system của landing.pen

Ngày review: **2026-10-05**. Document: [landing.pen](landing.pen). Workflow: [design-system-patterns / Audit](../../../.agents/skills/design-system-patterns/references/pen-audit.md).

**Cập nhật sau khi người dùng duyệt Apply:** các finding bên dưới là bằng chứng trước sửa. Thiết kế hiện đã có Foundation, shared compositions, typography/semantic bindings, menu reflow và một Visual Placeholder; xem [handoff hiện hành](README.md). Bản mới đã lưu và đọc lại bằng Pen, bao gồm vị trí board đặt cạnh nhau. Giữ báo cáo này làm lịch sử review.

Mục tiêu: dùng thiết kế hiện có làm nền tảng để thiết kế các trang public mới nhất quán. Đây là audit chỉ đọc; chưa thay đổi canvas, variables, components hoặc source ứng dụng.

## Kết luận

Bản hiện tại đã chuẩn hóa nhiều phần của landing, nhưng chưa phải bộ design system đủ để dựng trang mới. Các primitives có liên kết; typography và phần bố cục dùng chung vẫn phụ thuộc các bản sao riêng. Cần ưu tiên foundation và composition có thể tái sử dụng.

Theo định hướng của người dùng, minh họa Hero/Audience nên dùng **một component `Visual Placeholder`** giữ chỗ. Không cần duy trì các hình graph riêng hoặc mô tả cách dựng figure trong thư viện nền tảng.

## Phạm vi và bằng chứng

| Phần đã đọc | Kết quả |
| --- | --- |
| Artboard | EN 1904; VI/EN 1440, 1024, 768, 375: 9 artboard |
| Variables | 39 variables; không có reference thiếu target; chưa có semantic aliases |
| Reuse | 80 reusable origins, 391 instances |
| Figure origins | 25 origins, tổng cộng 1.610 nodes trong các origins |
| Demo origins | 32 origins cho 4 demo, locale và kích thước |
| State gallery | `OtjPz`: navigation, capability popover, Audience, mobile menu |
| Screenshot tập trung | Controls `R9PplJ`, VI Hero `IKKlT`, EN Product `capY9`, VI Solutions `u5Punj`, VI Resources `xdnOd`, mobile navigation `eCCkb`, locale selection |

Raw reads xác nhận bindings và `ref`; resolved reads xác nhận appearance/bounds. Palette landing cố định có vùng dark/light; audit này không đề xuất thêm OS theme hay chế độ theme cho toàn trang.

## Findings

Tất cả node IDs bên dưới thuộc `landing.pen`. Mức ưu tiên đánh giá theo khả năng tái sử dụng cho trang mới. Độ tin cậy của các bằng chứng cấu trúc: cao.

### 1. Cao — typography tokens chưa điều khiển phần lớn typography

**Bằng chứng:** `type/body`, `type/small`, `type/hero`, `type/section` đều chưa được bind. H1 `EykKL` có `fontSize: 72`; `EFeZc`: 64; `c0uQHE`: 52; `J62pMR`: 48; `X7MqP`: 40. H2 `iVvLx` dùng 60; button label `V2MiQ` dùng 14. Trong nhóm `type/*`, chỉ `type/step-title` có bindings, tại 36 text nodes.

**Ảnh hưởng:** trang mới phải sao chép size/weight/line-height/letter-spacing từ từng artboard. Sửa token hiện có không cập nhật các tiêu đề hoặc body liên quan.

**Chuẩn hóa:** xác định các vai trò display, section title, lead, body, small, label và mono; bind cả size lẫn các thuộc tính typography được Pen hỗ trợ. Ghi rõ giá trị theo viewport. Giữ các khác biệt responsive hiện có; không ép mọi H1 dùng 72 px. Typography nhỏ trong demo là vai trò riêng, không dùng làm mặc định của trang public.

### 2. Cao — Header/Footer và container chưa là composition dùng chung

**Bằng chứng:** Header/Footer trên cả chín artboard là `frame`, không phải `ref`. Ví dụ VI 1440: Header `H9ENg`, Footer `yPZ78`; VI 375: Header `GwxTd`, Footer `Xf62p`. Các thành phần bên trong như brand và button đã dùng instances, nhưng shell vẫn là bản sao độc lập. Footer container `b9mqZD` có `width: 1280` riêng.

**Ảnh hưởng:** thêm một trang hoặc sửa navigation, footer, chiều rộng nội dung cần chỉnh nhiều composition; dùng đúng button vẫn chưa bảo đảm trang có cùng bố cục.

**Chuẩn hóa:** tạo các origins Header, Footer theo cấu trúc desktop/mobile cần thiết; thêm Content Container, Section và Heading Group có slot nội dung. Locale là content override. Chỉ đưa các cấu trúc đang được dùng vào thư viện, không tạo trước dashboard hoặc các page types chưa có yêu cầu.

### 3. Trung bình — component origins còn nhân bản cấu trúc giống nhau

**Bằng chứng:** 10 capability popovers có cùng width 360, surface, border, radius, padding 20, gap 12 và ba text roles; khác label/title/body. Ví dụ `dCxaR` và `arViU`. Ngoài ra có 32 `Browser toolbar` frames giống nhau: height 34, gap 6, padding `[0,14]`; ví dụ `pb1wu`, `JiPPh`, `Smm9U`. Các toolbar này không phải reusable origins hoặc refs.

**Ảnh hưởng:** thay một padding, text role hoặc browser chrome phải cập nhật nhiều bản. Số lượng component lớn chưa chứng minh cấu trúc thực sự chia sẻ.

**Chuẩn hóa:** một Capability Popover origin với text overrides; một Browser Chrome origin dùng trong các demo. Giữ các demo layout khác nhau khi chúng thật sự cần reflow; không thu gọn bằng cách scale toàn bộ text hoặc biến demo thành ảnh.

### 4. Trung bình — mô tả trong menu mở chưa reflow theo ô chứa

**Bằng chứng:** trong state gallery `OtjPz`, EN Product menu `capY9` có `GSa81` rộng 228 px trong parent `KkZz0` rộng 223 px. VI Solutions `u5Punj` có `i9DTuV` rộng 301 px trong parent `gXYnU` rộng 223 px. VI Resources `xdnOd`: `zFwAA` 272/224 px và `X868C` 256/223 px. Các text này đang dùng growth mặc định, thiếu `textGrowth: fixed-width` và `width: fill_container`.

**Ảnh hưởng:** description dài vượt cột menu; copy cho trang mới hoặc locale khác tiếp tục gặp vấn đề này. Screenshot VI cho thấy mô tả chạy qua vùng cột kế bên.

**Chuẩn hóa:** một Navigation Link/Description pattern có chiều rộng theo parent, text wrap và height theo nội dung. Giữ nguyên đầy đủ copy; kiểm tra lại cả EN và VI. Đây là lỗi trong thiết kế state, chưa phải bằng chứng về lỗi của ứng dụng chạy thật.

### 5. Trung bình — màu chưa có đầy đủ vai trò semantic, selected state bị lệch

**Bằng chứng:** locale selected EN `wfwQt.fill` là literal `#123d43`; selected VI `gQxBT.fill` là `$color/surface` (`#08232e`). Cùng vai trò nhưng appearance khác nhau. Provider eyebrow `A8zg0D.fill` dùng literal `#006f66`, lặp ở chín artboard; không có token strong tương ứng. Bộ variables hiện chưa có aliases tách vai trò surface, text, action và selection.

**Ảnh hưởng:** người thiết kế trang mới phải tự suy ra màu theo vùng dark/light; selected state và màu accent dễ tách khỏi chuẩn chung.

**Chuẩn hóa:** giữ primitives hiện có, thêm semantic aliases cho các vai trò đang sử dụng và bind dependents; thống nhất selected state qua cùng một token. Ví dụ `color/surface/brand → $color/navy`, `color/text/on-brand → $color/text-on-dark`, `color/action/focus → $color/mint`. Thêm token cho strong mint hiện hành. Màu riêng của logo nhà cung cấp là asset exception hợp lệ.

### 6. Trung bình — spacing trong origins/states chưa dùng cùng bindings với trang

**Bằng chứng:** popover `dCxaR` có `padding: 20`, `gap: 12`, trong khi đã có `space/5: 20`, `space/3: 12`. Active visual slot `axvlp.padding` là `[16,0]` thay vì `[$space/4,0]`. State gallery `OtjPz.padding: 32`, `gap: 48`; các giá trị tương ứng đã có tokens. Menu import còn các giá trị 8.8, 12.8, 21 trong gaps/padding.

**Ảnh hưởng:** chỉnh spacing scale không lan tới một số origins và specimens. Trang mới có thể học theo các literal của import thay vì vai trò đã chuẩn hóa.

**Chuẩn hóa:** bind giá trị đã có vai trò tương đương; với các giá trị import lẻ, đối chiếu grouping trước khi chuẩn hóa hoặc ghi nhận ngoại lệ. Không đổi tất cả geometry/icon/path sang spacing tokens và không làm tròn tự động chỉ vì giá trị không chia hết cho 4.

## Một placeholder cho figure

| Thuộc tính | Chuẩn đề xuất |
| --- | --- |
| Origin | `Visual Placeholder`, một reusable origin trong cùng document |
| Appearance | Khung đơn giản với surface/border semantic; có thể có icon hoặc nhãn chung ngắn `Visual` |
| Nội dung | Không có graph nodes, candles, tên audience hoặc mô tả renderer |
| Sizing | Width/height do instance hoặc container quy định; giữ footprint của Hero/Audience tại từng viewport |
| Responsive | Cùng origin ở desktop/tablet/mobile; chỉ thay kích thước vùng giữ chỗ, không tạo origin cho từng breakpoint |
| Audience states | Giữ selector/copy/active state; dùng cùng placeholder trong vùng minh họa |
| Library | Gỡ 25 figure origins khỏi inventory đang dùng sau khi thay dependents; giữ bản thiết kế cũ có thể phục hồi |

Phạm vi placeholder là các minh họa Hero/Audience. Bốn product demos tiếp tục thuộc nhóm proof UI với nội dung và layout hiện có.

## Bộ nền tảng đủ dùng cho trang mới

| Nhóm | Deliverable cần có |
| --- | --- |
| Foundations | Bảng màu theo vai trò trên dark/light surface; typography theo role/viewport; spacing/radius với bindings và ngoại lệ rõ ràng |
| Shared controls | Brand, Button, Navigation Link/Disclosure, Capability Popover; các state đang được sử dụng |
| Shared composition | Header/Footer, Content Container, Section, Heading Group; content slots và responsive rules |
| Visual content | Một Visual Placeholder; các proof/demo UI dùng Browser Chrome chung |
| Hướng dẫn sử dụng | Board có specimen và nhãn role/token/slot, bảng giá trị theo viewport, quy tắc text/locale overrides |

Trong document hiện tại chưa có board Foundations hoặc ví dụ composition dùng chung kèm role/slot guidance. Board Controls có các mẫu UI, nhưng chủ yếu là specimens rời. Trang mới cần bắt đầu từ shell/pattern đã liên kết và dùng text overrides thay cho copy/paste một artboard đầy đủ.

Thứ tự sửa đề xuất: placeholder figure → typography/semantic bindings → shared shell/containers → gộp primitives bị nhân bản → menu reflow → specimen/guidance → kiểm tra và lưu, đọc lại bằng Pen.

## Kiểm chứng và giới hạn

- Chín artboard không có lỗi bounds ngoài ý định được tìm thấy trong kiểm tra resolved; bỏ qua background crop chủ ý, node disabled và sai số geometry dưới 1 px.
- State gallery có bốn text descriptions vượt ô chứa, nêu ở finding 4. Không dùng kết quả artboard để chứng nhận toàn bộ states.
- Screenshot tập trung hỗ trợ kết luận về hierarchy và menu descriptions; chưa kiểm tra trực quan mọi node của cả document.
- Không thay đổi canvas hoặc file `.pen`. SHA-256 của file đã lưu trước/sau review: `DBDEE1E7DCBA8D0C53A243B246B3C120D37F927BAEF10BB5EF845761C6C42E3A`.
- Runtime keyboard, screen reader, playback và responsive của ứng dụng không thuộc lượt audit design này. Các đề xuất chưa được áp dụng hoặc chứng nhận save/persistence mới.
