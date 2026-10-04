# Signapse Landing

Thư mục triển khai website marketing độc lập bằng Astro. Đợt đầu chuyển toàn bộ landing `/vi` và `/en` hiện có từ `signapse-ui`, giữ giao diện, nội dung và các demo; CTA vào ứng dụng luôn dẫn tới dashboard trên frontend.

Khung Astro đã được khởi tạo theo [nghiên cứu đã duyệt](docs/research/astro-scaffold-research.md). Hiện có trang chọn ngôn ngữ `/` và hai placeholder `/vi`, `/en`; tất cả giữ `noindex` trong giai đoạn scaffold. Đọc [mục lục tài liệu](docs/README.md) trước khi chuyển landing thực tế. Tài liệu sản phẩm và design system dùng chung tiếp tục được tham chiếu từ `signapse-planing`.

## Phát triển local

Dùng Node `24.21.0` và pnpm `10.34.5` theo `.node-version` và `packageManager`.

```powershell
pnpm install --frozen-lockfile
pnpm dev
```

Dev server mặc định tại `http://localhost:4321`. Sau khi build, `pnpm preview` phục vụ output production tại cùng port mặc định.

| Lệnh                | Mục đích                            |
| ------------------- | ----------------------------------- |
| `pnpm check`        | Kiểm tra Astro và TypeScript        |
| `pnpm lint`         | Lint Astro/TS/TSX và config         |
| `pnpm format:check` | Kiểm tra format source/config       |
| `pnpm format`       | Format source/config đang hoạt động |
| `pnpm build`        | Sinh website static vào `dist/`     |
| `pnpm preview`      | Chạy production preview của build   |

Các gate trên cũng được khai báo trong `.github/workflows/ci.yml`. Tài liệu trong `docs/` được giữ nguyên định dạng và nằm ngoài phạm vi formatter.

## Cấu hình và phạm vi

Placeholder chạy được khi chưa có env. `.env.example` ghi lại origin dashboard/landing cần cấu hình khi migration và deploy; placeholder vẫn phát `noindex` kể cả khi biến indexability được thay đổi.

Astro sở hữu layout và source static; React đã được tích hợp để nhận các islands trong đợt tiếp theo. Root `/` hiện là trang chọn locale; `Accept-Language`, canonical/social cards, analytics và domain routing được hoàn thiện trong các bước migration/hosting đã thống nhất. Tài liệu và ảnh trong `docs/archive/` không phải runtime assets.
