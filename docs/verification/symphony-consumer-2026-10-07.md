# Historical Symphony consumer implementation — 2026-10-07

Historical evidence extracted from the onboarding plan; it records the checks and limits observed then, not current policy or runtime adoption. Current assigned execution starts at [WORKFLOW.md](../../WORKFLOW.md). The source record is preserved at [verified revision 1cde8cc](https://github.com/signapse-group/signapse-landing/blob/1cde8cc967cb3b829393f8b077f3d16b10f54f8d/docs/symphony-onboarding-plan.md#6-kết-quả-consumer-implementation).

## 6. Kết quả consumer implementation

Triển khai local ngày **2026-10-07** theo yêu cầu đã chấp nhận, trên branch `codex/landing-symphony-onboarding`, base `86bc7550e18b70bae0ae934556488d1193d3a3e5`:

- Đã chuyển/adapt đủ 8 skill trees và supporting references/metadata từ FE revision trong bảng khảo sát. Không copy FE auth/runtime helpers hoặc source lock/package; invocation/dependency policies giữ nguyên. Các skill dùng checks Astro và planning-owned references; API lookup chỉ theo scope thực sự tích hợp API.
- Đã tạo root `WORKFLOW.md`, Jira Subtask `route-landing`, Ready/Progress → In Review boundary, cố định clone destination và frozen bootstrap đúng toolchain. Deployment-owned optional settings được để trống; không tạo host/model/sandbox/credential profile mới.
- Đã thêm [offline checker](https://github.com/signapse-group/signapse-landing/blob/1cde8cc967cb3b829393f8b077f3d16b10f54f8d/scripts/check-symphony-workflow.exs), [consumer guide](https://github.com/signapse-group/signapse-landing/blob/1cde8cc967cb3b829393f8b077f3d16b10f54f8d/docs/symphony.md) và pointers ở AGENTS/README/docs index. Không sửa source/runtime assets của landing, tính năng form, repo FE/planning/Symphony hoặc issue/status Jira.

Verification của revision làm việc:

| Check | Kết quả |
| --- | --- |
| Toolchain và install | Node **24.21.0**, pnpm **10.34.5**, `pnpm install --frozen-lockfile` đạt; package/lockfile không đổi. Cảnh báo build script workerd ignored là policy hiện có. |
| Astro/check | `pnpm check` đạt, **53 files**, 0 errors/warnings/hints. |
| Lint/format/build | `pnpm lint`, `pnpm format:check`, `pnpm build` đạt; build đủ root/VI/EN. Cảnh báo chunk Three lớn vẫn là giới hạn đã ghi trong verification trước đó. |
| Skill validation | **8** skills đạt `quick_validate.py`; **7** metadata YAML files parse hợp lệ, giữ nguyên invocation/dependency policies của nguồn; skills accessibility không có metadata từ FE. Dùng PyYAML đã có trong temp tooling, không thêm package dependency vào landing. |
| Runtime offline | Elixir **1.19.5/OTP 28**, Symphony source `2a58b98` compile trong container tạm; YAML/config/routing/dependency và **12 strict Liquid fixtures** đạt. Final run đã ngắt container network; `mix run --no-start`, supervisor không chạy, fixture credentials, không hooks/polling/live writes. |
| Runtime regression hiện có | Jira adapter tests và `core_test.exs:354` Progress/review/Blocked/restart reuse check: **17 passed, 0 failures**, 52 unrelated cases excluded. Chỉ chạy bản copy trong container, không sửa sibling repo. |
| Scripts/content | Elixir formatter, shell syntax của bootstrap hook và HITL helper đạt; helper thực thi với stdin fixture. Exact executable clone line/destination được assert; hai mutation fixtures clone vào subdir hoặc chỉ giữ URL trong comment đều bị reject đúng assertion. **31 files** UTF-8/LF/whitespace và **97 local links** đạt. |
| Independent review | Reviewer `consumer_review` kiểm ba tracked diffs và toàn bộ untracked deliverables từ base/HEAD trên: **Requirement adherence đạt; Correctness & Standards đạt**, không còn findings. Gap exact clone assertion được sửa, kiểm lại và reviewer xác nhận; review dùng kết quả checks của implementer cùng source/policy/runtime trực tiếp. |

Lượt đầu runtime check dừng do Docker image thiếu Hex; Hex/Rebar được cài riêng trong container tạm rồi kiểm lại, không thay dependencies/repo. Không chạy lại application model/browser suites vì thay đổi consumer không sửa navigation/layout/demo/model; baseline Linux browser trên server vẫn do operator kiểm trước activation. Kết quả hosted CI/PR, branch protection, installed server, worker account, Development panel, canary và deploy chưa được xác minh bởi các local checks này. Phải publish consumer revision chứa các files trên trước khi server clone/activate; setup/activation tiếp tục là công việc riêng do người dùng thực hiện qua repo Symphony.
