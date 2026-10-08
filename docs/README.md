# Tài liệu Signapse Landing

Repository Astro này giữ tài liệu **thực thi landing**: kiến trúc source, cách chạy/check, deploy và runtime evidence. Requirement/design, copy contract, Pen/prototype, nghiên cứu và ADR thuộc [planning](../../signapse-planing/ui-design/references/landing/README.md) từ 2026-10-06. Landing nhận task implement theo design/AC đã duyệt; baseline implementation được xác nhận ngày 2026-10-04.

| Tài liệu                                                                  | Vai trò                                                                    |
| ------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| [README repository](../README.md)                                         | Cài đặt, chạy, cấu hình môi trường và kiểm tra.                            |
| [Landing contract](../../signapse-planing/ui-design/references/landing/LANDING.md) | Contract được duy trì tại planning: bố cục, nội dung, navigation, demo, responsive và accessibility. |
| [Architecture](architecture.md)                                           | Ownership theo file, hydration, playback, renderer và assets.              |
| [Design rules](design.md)                                                 | Rule triển khai visual, tokens, typography, responsive, interaction và accessibility; tham chiếu contract tại planning. |
| [Verification](verification/README.md)                                    | Ma trận kiểm tra trên Astro, lệnh tái tạo và bằng chứng hiện tại.          |
| [Kế hoạch Symphony](symphony-onboarding-plan.md)                          | Khảo sát FE/planning/runtime, skills cần adapt, workflow landing và preflight/canary trên server; chưa activation. |
| [Symphony consumer](symphony.md)                                        | Lifecycle/policy hiện hành, checker offline và bàn giao inputs cho setup server qua repo Symphony. |
| [Cloudflare deployment research](../../signapse-planing/docs/research/landing-cloudflare-deployment.md) | Nghiên cứu tại planning; trạng thái release theo runbook/evidence của landing. |
| [Deploy signapse.cloud](deployment/signapse-cloud.md)                     | Các bước cấu hình GitHub, deploy Workers, nối domain và bật indexing.    |
| [ADR-0005](../../signapse-planing/docs/adr/landing/0005-static-landing-and-explicit-hosting-configuration.md) | Quyết định tại planning về static output, canonical/indexability và hosting. |
| [ADR-0010](../../signapse-planing/docs/adr/landing/0010-use-progressive-webgl-for-landing-context-figure.md) | Quyết định tại planning về WebGL, SVG fallback và lifecycle. |
| [ADR-0011](../../signapse-planing/docs/adr/landing/0011-fixed-branded-public-landing-composition.md) | Quyết định tại planning về palette/composition; CSS tokens triển khai ở landing. |

Các nguồn trực tiếp: [routes](../src/pages/), [composition/components](../src/components/landing/), [dictionary VI/EN](../src/i18n/messages.ts), [styles/fonts](../src/styles/), [runtime assets](../public/) và [tests](../tests/).

Dashboard, authentication và Articles của ứng dụng sản phẩm thuộc app; public Blog list/detail thuộc landing và đọc qua API public. Dashboard chưa mở quyền user access nên landing không render CTA hoặc link dashboard. Mọi trang public kế thừa token landing từ BaseLayout và dùng chung Header/Footer. Code, tài liệu và tests tại đây đủ để phát triển và kiểm chứng landing độc lập, không đọc session.

Khi triển khai task, cập nhật source, tài liệu thực thi và test liên quan trong cùng thay đổi. Thiếu hoặc cần đổi requirement/design thì đưa về coordinator/planning. Ảnh/kết quả chạy ứng dụng thuộc docs/verification/; runtime assets thuộc public/. Design screenshots, exports và backups được duy trì tại planning.
