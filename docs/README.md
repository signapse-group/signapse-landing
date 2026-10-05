# Tài liệu Signapse Landing

Repository Astro này là **source of truth** của landing: code, copy VI/EN, bố cục, assets, demo và test. Implementation hiện tại đã được người dùng xác nhận đúng ngày 2026-10-04. Mọi thay đổi tiếp theo bắt đầu từ source và contract trong repo này.

| Tài liệu                                                                  | Vai trò                                                                    |
| ------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| [README repository](../README.md)                                         | Cài đặt, chạy, cấu hình môi trường và kiểm tra.                            |
| [Landing contract](design/LANDING.md)                                     | Bố cục, nội dung, navigation, demo, responsive và accessibility hiện hành. |
| [Architecture](architecture.md)                                           | Ownership theo file, hydration, playback, renderer và assets.              |
| [Verification](verification/README.md)                                    | Ma trận kiểm tra trên Astro, lệnh tái tạo và bằng chứng hiện tại.          |
| [ADR-0005](adr/0005-static-landing-and-explicit-hosting-configuration.md) | Ranh giới static output, canonical/indexability và hosting.                |
| [ADR-0010](adr/0010-use-progressive-webgl-for-landing-context-figure.md)  | WebGL progressive enhancement với SVG fallback và lifecycle.               |
| [ADR-0011](adr/0011-fixed-branded-public-landing-composition.md)          | Palette landing cố định và ownership tokens.                               |

Các nguồn trực tiếp: [routes](../src/pages/), [composition/components](../src/components/landing/), [dictionary VI/EN](../src/i18n/messages.ts), [styles/fonts](../src/styles/), [runtime assets](../public/) và [tests](../tests/).

Dashboard, authentication và Articles thuộc ứng dụng sản phẩm; landing xây URL từ PUBLIC_APP_ORIGIN. Code, tài liệu và tests tại đây đủ để phát triển và kiểm chứng landing độc lập.

Khi thêm tính năng hoặc đổi contract, cập nhật source, tài liệu và test có liên quan trong cùng thay đổi. Ảnh và kết quả kiểm chứng thuộc docs/verification/; runtime assets thuộc public/.
