# Skills design của Signapse Landing

Bộ skill local được sao chép từ `signapse-planing/.agents/skills/` ngày 2026-10-05, gồm toàn bộ 14 tệp của ba skill và các reference đi kèm.

| Skill | Khi dùng |
| --- | --- |
| [frontend-design](frontend-design/SKILL.md) | Định hướng visual, typography, layout và nội dung giao diện; áp dụng vào code khi được yêu cầu triển khai. |
| [design-system-patterns](design-system-patterns/SKILL.md) | Foundation, tokens, themes, components, audit và chuẩn hóa spacing trong Pen; reference code chỉ dùng khi được yêu cầu design-to-code. |
| [prototype](prototype/SKILL.md) | Prototype UI hoặc mô hình trạng thái trong Pen trước triển khai. |

`frontend-design` và `design-system-patterns` giữ nguyên nội dung nguồn. `prototype/SKILL.md` và `prototype/UI.md` được điều chỉnh đường dẫn, document đích và hướng dẫn handoff để dùng trong repository landing. Các skill marketing/copy/media không thuộc bộ UI/design này.

## Baseline và thao tác Pen

Đọc [AGENTS.md](../../AGENTS.md), [mục lục tài liệu](../../docs/README.md) và [LANDING.md](../../docs/design/LANDING.md). Quyết định migration hiện hành trong mục lục được ưu tiên khi tài liệu lịch sử còn mô tả kiến trúc cũ. Bộ skill không tự thay đổi palette, bố cục hoặc nội dung landing đã chốt.

Giữ thiết kế Pen, assets và exports trong `docs/design/pen/`; chỉ tạo document khi yêu cầu có đầu ra thiết kế. Xác nhận document đích qua host trước khi sửa. Không dùng dashboard của planning làm document mặc định cho landing.

Các workflow canvas cần Pen MCP hoặc CLI có native `pen-dev`; bộ skill local này không cài ứng dụng Pen. Nạp `pen-dev`, `pen-schema.md`, `execute.md` và guide liên quan qua host. Đọc và sửa `.pen` bằng công cụ Pen được hỗ trợ, không parse hoặc sửa serialized IDs/references bằng filesystem.

Trước khi sửa, kiểm tra frames, variables, components và screenshot liên quan; dùng bindings và instances hiện có. Giữ bản có thể phục hồi trước khi ghi đè hoặc xóa thiết kế/assets. Sau khi sửa, kiểm tra clipping, overflow, alignment, contrast, legibility và tính nhất quán token/component.

Canvas edit thành công không chứng minh file đã lưu. Với desktop MCP, người dùng lưu qua File → Save hoặc Ctrl/Cmd + S trừ khi host cung cấp thao tác lưu đã xác minh. Với CLI, dùng cơ chế lưu/output được host hỗ trợ. Reopen hoặc đọc lại qua Pen để kiểm tra persistence trước khi báo đã lưu. Kiểm chứng responsive, keyboard, screen reader và reduced motion trong ứng dụng chạy thật khi triển khai nằm trong scope.

## Nguồn và giới hạn

Metadata provenance của các skill được giữ nguyên. `frontend-design` có trường license trỏ tới `LICENSE.txt`, nhưng thư mục nguồn không cung cấp tệp đó; bản cài giữ nguyên khai báo và không tự bổ sung điều khoản license.
