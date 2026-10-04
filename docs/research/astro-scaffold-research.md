# Nghiên cứu và plan dựng khung Astro

Ngày kiểm chứng: **2026-10-04**. Trạng thái: **đã được duyệt, triển khai khung và kiểm chứng local ngày 2026-10-04**. Phần nghiên cứu và hiện trạng bên dưới ghi lại bằng chứng trước bootstrap; kết quả triển khai nằm ở cuối tài liệu.

## Kết luận

Dựng project Astro tối thiểu trong `signapse-landing`, xuất static, tích hợp React và Tailwind CSS 4, TypeScript strict, toolchain được pin và có các kiểm tra độc lập. Kết quả của đợt này là repo chạy/build được với trang placeholder hai locale, sẵn sàng nhận landing trong đợt migration tiếp theo.

[Scope migration đã chốt](../README.md) vẫn là căn cứ: CTA tới dashboard, hai locale, Articles ở frontend, giữ landing/demo hiện tại khi chuyển code. Người dùng đã chấp nhận plan khung trong tài liệu này và yêu cầu triển khai tại thư mục landing.

## Hiện trạng đã kiểm tra

Thư mục hiện có `README.md` và `docs/`, chưa có `.git`, `package.json`, cấu hình Astro hoặc source ứng dụng. Node đang dùng là `24.21.0`, pnpm là `10.34.5`; đây là kết quả đọc môi trường local, không phải version requirement của Astro.

Các thay đổi tài liệu của bước gom landing vẫn là local changes trong planning/frontend; bước dựng khung không tự commit hoặc publish những thay đổi đó.

## Căn cứ từ nguồn chính thức

| Đã xác minh | Áp dụng cho Signapse |
| --- | --- |
| `src/pages/` là thư mục routing bắt buộc; components/layouts/styles là quy ước có thể tổ chức theo dự án. `public/` được copy nguyên bản, còn assets trong `src/` được xử lý khi build. [Project structure](https://docs.astro.build/en/basics/project-structure/) | Dùng các thư mục quen thuộc của Astro; nhóm React islands chỉ khi bắt đầu chuyển component. |
| Astro mặc định prerender ở build; route render theo request cần adapter. [Rendering](https://docs.astro.build/en/guides/on-demand-rendering/) | Scaffold `output: 'static'`; hosting adapter và xử lý request nằm ở giai đoạn deploy. |
| Integration chính thức cung cấp React rendering/hydration. [React](https://docs.astro.build/en/guides/integrations-guide/react/) | Cấu hình React ngay để nhận TSX của landing sau này. |
| Tailwind 4 được tích hợp bằng Vite plugin. [Styling](https://docs.astro.build/en/guides/styling/#add-tailwind-4) | Dùng `@tailwindcss/vite` và CSS entry chung. |
| Astro hỗ trợ config TypeScript strict; `astro build` không chạy type checking. [TypeScript](https://docs.astro.build/en/guides/typescript/) | Có `astro check` riêng trong các kiểm tra trước build. |
| Static dynamic routes cần `getStaticPaths()`; browser language detection của Astro chỉ có trên trang render theo request. [Routing](https://docs.astro.build/en/guides/routing/), [i18n](https://docs.astro.build/en/guides/internationalization/#browser-language-detection) | Một template `[lang]/index.astro` sinh `/vi` và `/en`; Accept-Language ở root xử lý với hosting sau. |

Các cách tổ chức và lựa chọn dưới đây là đề xuất cho repo, không phải toàn bộ đều là yêu cầu của Astro.

## Toolchain đề xuất và tính tương thích

Đọc metadata trực tiếp từ npm registry bằng `pnpm view` và HTTP API, không cài package. Phiên bản tại thời điểm kiểm chứng:

| Thành phần | Đề xuất | Căn cứ |
| --- | --- | --- |
| Node | Pin `24.21.0` trong `.node-version` | Máy đã có version này; Astro yêu cầu Node `>=22.12.0`, ESLint plugin được chọn hỗ trợ Node `^24.16.0`. [Astro prerequisites](https://docs.astro.build/en/install-and-setup/#prerequisites), [plugin requirements](https://ota-meshi.github.io/eslint-plugin-astro/user-guide/) |
| pnpm | `10.34.5`, khai báo `packageManager` | Phiên bản local; CI dùng cùng version và lockfile. [pnpm manifest](https://pnpm.io/package_json), [frozen lockfile](https://pnpm.io/cli/install#--frozen-lockfile) |
| Astro | `7.3.5` | [Registry metadata](https://registry.npmjs.org/astro/7.3.5) |
| React integration | `@astrojs/react@7.0.0` | Hỗ trợ React 19; React compiler peer là optional. [Registry metadata](https://registry.npmjs.org/@astrojs/react/7.0.0) |
| React/React DOM | `19.3.0` | Cùng version và nằm trong peer range của integration. [React](https://registry.npmjs.org/react/19.3.0), [React DOM](https://registry.npmjs.org/react-dom/19.3.0) |
| Tailwind | `4.3.3` và `@tailwindcss/vite@4.3.3` | Vite plugin đang hỗ trợ các major Vite 5–8. [Registry metadata](https://registry.npmjs.org/@tailwindcss/vite/4.3.3) |
| TypeScript | **`5.9.3`** | `@astrojs/check@0.9.10` hỗ trợ TypeScript 5/6; `typescript-eslint@8.71.0` yêu cầu `<6.1.0`. TypeScript latest `7.0.2` nằm ngoài các range này. [Check peer dependencies](https://registry.npmjs.org/@astrojs/check/0.9.10), [typescript-eslint](https://registry.npmjs.org/typescript-eslint/8.71.0), [TypeScript](https://registry.npmjs.org/typescript/5.9.3) |
| Lint | ESLint `10.12.0`, Astro plugin `3.2.1`, typescript-eslint `8.71.0`, React Hooks plugin `7.1.1` | Dùng flat config recommended cho các file tương ứng. Node và peer ranges đã được đối chiếu. [Astro lint guide](https://ota-meshi.github.io/eslint-plugin-astro/user-guide/), [React Hooks metadata](https://registry.npmjs.org/eslint-plugin-react-hooks/7.1.1) |
| Format | Prettier 3 và `prettier-plugin-astro@1.1.0` | Plugin yêu cầu Prettier `^3.5.3`; khai báo parser Astro theo hướng dẫn chính thức. [Plugin](https://github.com/withastro/prettier-plugin-astro), [metadata](https://registry.npmjs.org/prettier-plugin-astro/1.1.0) |

Commit lockfile sau khi được duyệt dựng khung; versions phụ thuộc và peer dependencies được xác nhận bằng install/check/build thật. Kết quả đọc registry hiện tại chưa chứng minh project đã build thành công.

## Structure của đợt dựng khung

```text
signapse-landing/
├── docs/                         # tài liệu đã gom
├── public/                       # asset có URL cố định, thêm khi có asset thật
├── src/
│   ├── i18n/
│   │   ├── config.ts             # locales và default locale
│   │   └── messages.ts           # copy placeholder VI/EN, typed
│   ├── layouts/
│   │   └── BaseLayout.astro      # HTML shell, lang, title, noindex
│   ├── pages/
│   │   ├── index.astro           # root placeholder/chọn locale
│   │   └── [lang]/index.astro    # một template sinh VI và EN
│   └── styles/
│       └── global.css           # Tailwind entry, styling tối thiểu
├── .github/workflows/ci.yml
├── .env.example
├── .gitignore
├── .node-version
├── .prettierignore
├── .prettierrc.mjs
├── AGENTS.md
├── astro.config.mjs
├── eslint.config.mjs
├── package.json
├── pnpm-lock.yaml
├── README.md
└── tsconfig.json
```

`src/components/` và `src/assets/` được thêm khi có component hoặc asset đầu tiên; React component sẽ nhóm dưới `components/islands/` khi bắt đầu migration. Không cần file `.gitkeep` hay component sản phẩm giả để giữ thư mục trống. Đây là quy ước đề xuất cho repo.

## Cấu hình khung

Astro dùng static output, React integration, Tailwind Vite plugin và hai locale `vi/en`, default `vi`, cả hai có prefix. TypeScript extends `astro/tsconfigs/strict`, cấu hình React JSX và alias `@/*` trỏ tới `src/*`. Trang placeholder dùng HTML semantic, có title và `lang` đúng, mặc định `noindex`.

Trong scaffold, `/` là trang chọn locale với link tới hai placeholder. Việc chọn locale theo `Accept-Language`, bảo toàn query qua redirect root và rule production cho `www` thuộc bước hosting/cutover đã chốt; scaffold static không được nhận là đã xử lý các hành vi theo request đó.

`.env.example` ghi các biến dự kiến `PUBLIC_APP_ORIGIN`, `SIGNAPSE_PUBLIC_ORIGIN`, `SIGNAPSE_LANDING_INDEXABLE=false`; giá trị origin để trống/chú thích cho cấu hình sau. Placeholder vẫn chạy khi chưa có origin; chỉ bật các validation gắn với CTA/canonical khi các tính năng ấy được đưa vào. Env ở config cần dùng `process.env` hoặc `loadEnv`, vì `.env` không tự được nạp trong Astro config. [Environment variables](https://docs.astro.build/en/guides/environment-variables/).

Git ignore bao gồm dependency, output/cache và env thật; giữ `.env.example`, source và lockfile. Lint/format tập trung vào source/config đang hoạt động; tài liệu nhập và archive giữ nguyên, không reformat hàng loạt theo scaffold.

## Plan đề nghị duyệt

| Thứ tự | Công việc | Điều kiện xong |
| --- | --- | --- |
| 1 | Bootstrap theo manual setup chính thức trong thư mục đang có tài liệu; thêm package/config mới và khởi tạo Git local riêng. | Docs/README hiện có được bảo toàn, repo có toolchain và lockfile riêng. [Manual setup](https://docs.astro.build/en/install-and-setup/#manual-setup) |
| 2 | Cấu hình static Astro, React, Tailwind, TypeScript strict, alias và env example. | Config được đọc và build độc lập, không cần checkout/runtime của dashboard. |
| 3 | Tạo BaseLayout, i18n tối thiểu và placeholder `/`, `/vi`, `/en`. | Ba route chạy trên dev/preview; locale và HTML đúng, không có nội dung landing thật. |
| 4 | Thêm lint/format, scripts, CI và hướng dẫn README/AGENTS cho repo này. | Cùng một bộ kiểm tra có thể chạy local và trong CI khi có GitHub remote. |
| 5 | Install với lockfile, chạy các kiểm tra và smoke build output. | Các gate bên dưới pass; báo kết quả thật và phần verification chưa chạy. |

## Scripts và gate hoàn thành

| Script | Thực hiện |
| --- | --- |
| `pnpm dev` | `astro dev` |
| `pnpm check` | `astro check` |
| `pnpm lint` | ESLint cho Astro/TS/TSX và config |
| `pnpm format:check` | Prettier check cho source/config |
| `pnpm format` | Format chủ động trong cùng phạm vi |
| `pnpm build` | `astro build` |
| `pnpm preview` | `astro preview` cho output đã build |

CI chuẩn bị các bước `pnpm install --frozen-lockfile`, check, lint, format check và build. Khi chưa có GitHub remote, chạy cùng gate local và không báo CI online đã pass.

Smoke kiểm tra `/`, `/vi`, `/en`, `html lang`, title/noindex, CSS entry và output chỉ chứa hai locale hỗ trợ. Cấu hình React được kiểm chứng qua build; runtime interaction của các islands sẽ được kiểm thử khi chuyển component thật. Scope scaffold không cần dựng trước Vitest/Playwright suite; các kiểm thử hành vi landing được chuyển trong đợt migration.

## Ranh giới và quyết định còn lại

Đợt này chỉ tạo khung repo và trang placeholder. Landing content, brand/font assets, Motion/Three.js, các demo, Articles/CMS, analytics/social cards và deployment/domain nằm trong các bước sau.

Hostname dashboard, hosting provider và GitHub remote chưa chốt. Các lựa chọn này không chặn scaffold local. Nếu plan này được duyệt, công việc được triển khai đến khung chạy/build/kiểm tra được; không tự publish repo, deploy hoặc bắt đầu chuyển landing.

## Kết quả triển khai khung

Khung đã được dựng trong thư mục landing theo phạm vi đã duyệt: Astro static, React integration, Tailwind CSS 4, TypeScript strict và alias, i18n dùng chung để sinh hai locale, layout HTML và ba trang placeholder. Repo có Git local riêng trên branch `codex/astro-scaffold`, toolchain pin, lockfile, env example, lint/format và GitHub Actions workflow. Chưa cấu hình GitHub remote.

Bổ sung `.gitattributes` để thống nhất LF cho source và giữ ảnh ở dạng binary. `pnpm-workspace.yaml` dùng allowlist build script cho `esbuild` và `sharp`, thay vì yêu cầu thao tác approve package khi cài dependency trong CI. Các thư mục components/assets/public chưa có nội dung thật nên chưa tạo file giữ chỗ.

| Kiểm chứng thực tế | Kết quả |
| --- | --- |
| `pnpm install` và `pnpm install --frozen-lockfile` | Pass; cài toolchain đã chọn, lần frozen dùng đúng lockfile. |
| `pnpm check` | Pass: 8 file, 0 errors, 0 warnings, 0 hints. |
| `pnpm lint` | Pass. |
| `pnpm format:check` | Pass; formatter không đổi tài liệu nhập trong `docs/`. |
| `pnpm build` | Pass; output có đúng `index.html`, `vi/index.html`, `en/index.html` và CSS đã biên dịch. |
| Smoke dev và production preview | `/`, `/vi`, `/en` trả 200; lang/title/copy, link locale, current locale và `noindex` đúng. CSS được phục vụ, Tailwind utilities có trong output. `/fr` trả 404. |

Root `/` phục vụ trang chọn ngôn ngữ, không redirect theo request trong scaffold. Không cần backend, session đăng nhập hoặc env origin để chạy các placeholder. React integration được nạp trong check/build; chưa có island để kiểm chứng interaction runtime.

Đối chiếu SHA-256 với snapshot trước bootstrap: 41/43 file tài liệu/ảnh giữ nguyên byte; chỉ mục `docs/README.md` và tài liệu nghiên cứu này được cập nhật trạng thái. Toàn bộ ảnh tham chiếu được bảo toàn. Bước dựng khung không sửa code ứng dụng ở planning/frontend.

Workflow CI đã được cấu hình với các action pin theo commit; bộ gate tương ứng đã chạy local. Chưa chạy hosted CI vì chưa có remote. Nội dung landing thực tế, các demo, canonical/indexability production và hosting vẫn thuộc các bước tiếp theo.
