# Khảo sát layout header landing và Blog — 2026-10-08

Landing và Blog đã dùng cùng `LandingHeader`. Layout lệch vì wrapper Blog thiếu các token kích thước/bo góc mà component này kế thừa. Source revision: `5f6e74b4c7751e62372f67e225beb4d7907d3e7e`; lượt này chỉ khảo sát, chưa sửa source.

## Nguyên nhân

- [LandingPage](../../../src/components/landing/LandingPage.astro) gắn `.landingRoot`, nơi [landing CSS](../../../src/components/landing/landing-page.module.css) khai báo `--landing-control-height: 2.75rem`, `--landing-control-radius: 0.5rem` và `--landing-card-radius: 0.75rem`.
- [BlogShell](../../../src/components/landing/BlogShell.astro) dùng cùng header nhưng chỉ gắn `.blogPage`. [Blog CSS](../../../src/components/landing/public-blog.module.css) chép các palette/header-height tokens, không khai báo ba token trên. Computed style của header Blog trả chuỗi rỗng cho cả ba.
- CSS của nav, dashboard CTA, locale control, mobile menu và popover dùng những token này. Khi thiếu, min-height/min-width và border-radius không giữ được geometry của landing.
- [Prototype Blog](../../../../signapse-planing/ui-design/pen/landing/public-blog-prototype.md) cũng dùng linked shared Header instance; không có chỉ định thu nhỏ các controls này.

## Số đo

Chromium trên built Worker preview, Node 24.21.0 / pnpm 10.34.5, fixture API local. Khảo sát 24 cấu hình: VI/EN × JavaScript bật/tắt × viewport 1440/375 px × landing/list/detail. Blog list và detail có cùng sai lệch; JavaScript bật/tắt không thay đổi kết luận. [Dữ liệu đầy đủ](measurements.json).

| Thành phần | Landing | Blog hiện tại | Thử bổ sung token trong browser |
| --- | --- | --- | --- |
| Khung header | 72 px | 72 px | 72 px |
| Menu desktop | Cao 44 px | Cao 38 px | Cao 44 px |
| Dashboard CTA | Cao 44 px, radius 8 px | Cao 36 px, radius 0 px | Cao 44 px, radius 8 px |
| Locale control desktop | 44×44 px | 26×26 px | 44×44 px |
| Mobile menu trigger | 44×44 px | 22×22 px | 44×44 px |

Trong 8 cấu hình Blog có JavaScript, chỉ inject ba token vào wrapper rồi đợi transition của CTA kết thúc. Assertions về height/radius của nav, locale, mobile trigger và CTA đều khớp baseline cùng locale/viewport. Không thay component, markup, container width hoặc source CSS.

Harness local trong ignored `test-results/header-layout-survey/` chạy qua fixture runner hiện có:

```powershell
$env:CI = '1'
pnpm test:browser --config test-results/header-layout-survey/playwright.config.ts --retries=0
```

Build và test dùng app origin `https://dev.signapse.cloud`, contact origin `https://dev-api.signapse.cloud`, public origin không đặt, indexing/Analytics `false`. Harness có một assertion cuối để tái hiện bug trên trang chưa inject: expected nav height **44**, received **38**. Vì source chưa sửa, command kết thúc **1 failed**, không retry; đây là reproduction của lỗi layout, không phải lượt xác nhận fix. Worker vars được khôi phục về trạng thái không tồn tại sau run.

## Ảnh kiểm chứng

| Viewport | Landing | Blog list hiện tại | Blog list sau phép thử token |
| --- | --- | --- | --- |
| 1440 px | [Landing](landing-1440-before.png) | [Blog](blog-list-1440-before.png) | [Probe](blog-list-1440-token-probe.png) |
| 375 px | [Landing](landing-375-before.png) | [Blog](blog-list-375-before.png) | [Probe](blog-list-375-token-probe.png) |

Ảnh detail trước/sau phép thử được lưu cùng thư mục. Ảnh probe chỉ minh họa browser intervention, không chứng nhận source đã được sửa.

## Hướng sửa

Cho BlogShell kế thừa `.landingRoot` đang có và bỏ phần foundation tokens chép riêng trong Blog CSS. Giữ `LandingHeader` dùng chung, các đích navigation theo trang và surface/background theo contract. Thêm browser regression cho geometry/bo góc giữa landing, Blog list và detail, gồm mobile và fallback không JavaScript.

Tests hiện tại kiểm navigation, keyboard, overflow, accessibility và nội dung Blog; chưa so sánh geometry của header giữa các trang. Các assertion CSS của Blog tập trung vào title/content, nên suite có thể pass dù header controls bị thu nhỏ.

Không kiểm domain live, không sửa runtime source, không commit/push/deploy. Vùng bấm menu mobile của Blog hiện vẫn 22×22 px.

## Implementation sau khảo sát

Theo yêu cầu tiếp theo của người dùng ngày 2026-10-08, `BaseLayout` đã áp dụng `.landingRoot` trên body để mọi trang public tự kế thừa foundation; Blog CSS bỏ các token khai báo trùng. Header/Footer đã gỡ dashboard entry vì chưa mở user access, cùng action model và copy VI/EN không còn dùng. `AGENTS.md` ghi cả quy tắc token chung và việc chỉ khôi phục dashboard entry sau khi người dùng cho phép rõ ràng.

Regression trước sửa: hai tests fail vì còn 2 dashboard links và nav Blog cao 38 px thay vì 44 px. Check/lint/format/build sau sửa pass; suite Chromium **56/56 pass**, không retry, gồm bốn tests shared shell phủ VI/EN, JS/noJS, 1440/1024/375 px, landing/root, list/detail và 404/502. Review độc lập không có finding source. [Kết quả](verification-after.json), [Blog list sau sửa](blog-list-desktop-after.png), [Blog detail sau sửa](blog-detail-desktop-after.png). Các đoạn và ảnh “before” phía trên là lịch sử khảo sát; token probe không phải implementation. Chưa commit/push/deploy hoặc kiểm domain live; model không đổi nên không chạy lại model tests.
