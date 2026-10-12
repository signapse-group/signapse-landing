# Symphony consumer cho Signapse Landing

[WORKFLOW.md](../WORKFLOW.md) và 8 skills trong [.agents/skills](../.agents/skills/) là consumer do landing sở hữu, được adapt từ FE revision `34c24e695bb0fe1cf634ac7b5c737565bfd67a94`. Symphony chỉ cung cấp runtime; không cài package skills chung, không cần checkout FE/planning/app để build/test landing.

Người dùng chấp nhận triển khai consumer ngày **2026-10-07** theo [plan](symphony-onboarding-plan.md), rồi yêu cầu cập nhật profile/browser sau khảo sát revision `ec4a2b8`. Cài đặt, cấu hình và activation trên server được thực hiện riêng qua repo Symphony. Trạng thái hiện tại là consumer đã được cập nhật; chưa có evidence activation/canary để xác nhận landing worker đã triển khai.

## Contract và lifecycle

Apply the repository-owned [phase procedure](../.agents/skills/agent-execution-policy/references/execution-policy.md#execution-and-review) and [planning profile](https://github.com/signapse-group/signapse-planing/blob/main/workflow/project-execution-workflow.md#profile-fe-và-landing): native SIGN dev Subtask, valid parent, single route-landing, PR into main; Ready Survey → Progress Implement → In Review independent Review/delivery → Done. No-PR/direct requests retain their assigned boundary. [Delivery runbook](delivery.md) owns technical PR/CI/merge/Cloudflare/revision/wait/recovery gates; coordinator retains initial dispatch, Blocked resume, parent/QA lifecycle and acceptance.

WORKFLOW dispatch/active include all three phases, review state In Review and session_boundary_states [Ready]. Moving phase ends the old session for a full new prompt in the same workspace, preserving output and claim until exit. Native dependency admission is checked on dispatch/retry; source support does not prove installed support. Jira comments/feedback/readback follow the phase procedure; public publishing does not authorize infra/secrets/DNS/indexing or live feature effects.

## Repo profile và deployment profile

Consumer giữ tracker map, `$SYMPHONY_WORKSPACE_ROOT`, clone cố định landing vào `.` và frozen install. Hook yêu cầu `$SYMPHONY_GIT_CREDENTIAL_HELPER` do host cấp, dùng helper khi clone và lưu cấu hình helper trong Git local để các lượt fetch/push tiếp theo dùng cùng helper. Hook kiểm Node `.node-version` và pnpm `packageManager` trước install: **24.21.0 / 10.34.5**. Host cấp helper executable và secrets; workflow chỉ giữ tên env, không chứa token hoặc copy credentials vào app `.env`.

Profile dưới đây được chốt sau khảo sát host ngày **2026-10-07**. Codex/model/approval/turn policy và hook timeout kế thừa cấu hình BE/FE đã khảo sát; concurrency landing khởi đầu ở **1**. Đây là cấu hình đã ghi trong repo, chưa phải evidence effective profile của landing service.

| Field | Giá trị |
| --- | --- |
| `agent.max_concurrent_agents` / `max_turns` | `1` / `20`; chỉ tăng concurrency sau khi operator chứng minh isolation và canary. |
| `hooks.timeout_ms` | `900000` (15 phút); đủ budget bootstrap, operator vẫn đo fresh install trước activation. |
| `codex.command` | `codex --config shell_environment_policy.inherit=all --config 'model="gpt-6-luna"' --config model_reasoning_effort=max app-server` |
| Approval / thread sandbox | `never` / `workspace-write` |
| Turn sandbox/network | `type: dangerFullAccess`: turn có filesystem/network access theo user service, gồm ghi `.git` và local skills; không thêm `networkAccess` vào policy loại này. |
| Polling / Codex timeouts | Giữ defaults schema Symphony; không thay lịch polling hoặc turn/read/stall timeouts của host. |

Schema Symphony nhận model qua `codex.command`, không có field `codex.model`. Tham chiếu [Codex configuration](https://developers.openai.com/codex/config-reference) và [App Server sandbox policies](https://developers.openai.com/codex/app-server). Không copy helper FE, `.env.local`, account files hoặc auth integration lane vào landing.

| Input operator cần kiểm | Điều kiện trước activation |
| --- | --- |
| Symphony binary/revision | Có routed Jira support đã kiểm theo source `88c1bd1c1455cce6ef02ce3d43c76535123506bc` có phase boundaries hoặc bản tương thích; source HEAD không chứng minh binary đã cập nhật. |
| Host env và workspace | `JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN`, `SYMPHONY_WORKSPACE_ROOT`; root landing riêng, không source checkout và không overlap worker route khác. |
| Code-host/agent tools | `SYMPHONY_GIT_CREDENTIAL_HELPER` trỏ đến helper của host cho clone/push, GitHub PR/CI tooling, Codex login/model và independent reviewer; `jira_rest` không cấp GitHub auth. |
| Jira worker account | Đọc Subtask/parent/comments/links, ghi comment/authorized transitions; kiểm native transitions/resume và landing Development-panel linking bằng đúng account. |
| Toolchain/network | Node/pnpm pins, frozen install, effective Codex command/approval/sandbox, cache permissions; đo fresh clone/install trong timeout 900 giây đã ghi. |
| Browser/runtime | `SYMPHONY_LANDING_BROWSER_WRAPPER`, Chromium + Linux libraries và landing-only cache; shared lock cùng các browser lanes khác trên host. Operator cài browser qua cùng env cache/platform mà wrapper dùng. |
| Observability và evidence | Profile/process/queue/port được kiểm; evidence tồn tại sau workspace cleanup. `test-results/` ignored không tự đáp ứng retention. |

Không cấp Cloudflare token chỉ để chạy landing quality. App env preview giữ noindex, Analytics off và origins khớp build/browser. Canonical/indexing, hosting và release theo [runbook deployment](deployment/signapse-cloud.md).

### Browser isolation trên shared host

[Playwright](../playwright.config.ts) dùng port `4321`, `workers: 1` và `reuseExistingServer: !CI`. Lệnh preview thêm `--ignore-lock`: Astro `7.3.5` chạy foreground cả khi nhận diện Codex, để Playwright quản lý vòng đời server. Flag này bỏ lock nội bộ `.astro/preview.json`; nó không thay shared host lock hoặc bảo đảm port trống. Tham chiếu [Astro CLI](https://docs.astro.build/en/reference/cli-reference/#--ignore-lock).

Operator cấp `SYMPHONY_LANDING_BROWSER_WRAPPER` là absolute path đến wrapper executable trên host. Interface: wrapper nhận absolute workspace trước, rồi các arguments Playwright tùy chọn; chạy build và browser trong workspace đó, trả exit code thực tế. Mọi invocation, kể cả focused tests/reviewer, dùng wrapper:

```bash
: "${SYMPHONY_LANDING_BROWSER_WRAPPER:?Set the host landing browser wrapper}"
"$SYMPHONY_LANDING_BROWSER_WRAPPER" "$PWD"
"$SYMPHONY_LANDING_BROWSER_WRAPPER" "$PWD" --grep 'public shell'
```

Wrapper giữ `CI=1` cho build/test để không reuse preview, lấy shared resource lock bằng `flock` trong toàn bộ build/browser và dùng `PLAYWRIGHT_BROWSERS_PATH` riêng cho landing. Dùng cùng lock với các browser lanes FE/khác nếu cùng port hoặc tài nguyên host; `workers: 1` và concurrency landing `1` không khóa giữa các service. Không bỏ lock khi chỉ chạy focused check. Wrapper/lock/cache/service paths và host env được thiết lập tại Symphony, không hardcode vào landing.

Khảo sát Ubuntu **26.04** với Playwright **1.58.2** cần `PLAYWRIGHT_HOST_PLATFORM_OVERRIDE=ubuntu24.04-x64`, Linux libraries qua `LD_LIBRARY_PATH` và font config qua `FONTCONFIG_FILE`. Operator kiểm lại trên host đích và cấp cùng env cho install lẫn test; không dùng cache FE hoặc chạy GC lên cache worker khác. `PLAYWRIGHT_SKIP_BROWSER_GC=1` được dùng trong lượt khảo sát. Sau sửa repo, wrapper không cần bỏ `CODEX_THREAD_ID` để né auto-background nữa. Nếu wrapper/cache/isolation chưa được cấp, báo prerequisite thiếu trước browser checks.

Baseline operator chạy trên fresh workspace: frozen install → `pnpm check` → `pnpm lint` → `pnpm format:check` → `pnpm build` → `pnpm test:models` → `pnpm test:browser`, qua wrapper khi cần. Browser runner blog khởi động fixture HTTP API riêng và kiểm tra Worker server-side fetch; fixture/app links không cần backend thật, login, dashboard checkout hoặc GPU thật để chứng minh WebGL fallback.

## Kiểm tra consumer offline

[Checker](../scripts/check-symphony-workflow.exs) dùng parser/config, Jira normalization và strict Liquid thực của Symphony với fixture credentials. Từ Symphony Elixir project đã cài deps, truyền absolute paths:

```bash
MIX_ENV=test mix run --no-start /path/to/signapse-landing/scripts/check-symphony-workflow.exs /path/to/signapse-landing/WORKFLOW.md
```

Checker xác minh supervisor chưa chạy; không gọi hooks, polling, clone hoặc Jira writes. Nó kiểm concurrency/timeout/Codex/sandbox đã chốt, executable clone line đúng repo và destination `.` cùng helper cho clone/push, native parent/type, zero/wrong/two routes, wrong project, Ready/Progress/In Review dependency categories và 108 fixtures Liquid cho ba phase/unsupported states, nullable/empty context/description, retry và permission guards. Khi đổi clone line, phải kiểm lại mutations sai repo, clone vào subdir, URL chỉ nằm trong comment và mất helper persistence. Scheduler restart/cleanup coverage thuộc tests Symphony hiện có; consumer không dựng runtime kiểm giả.

Sau sửa root workflow hoặc checker, chạy offline check cùng check/lint/format/build theo repo policy. Skills cần validate frontmatter/metadata, local links, UTF-8/LF và invocation policies; formatter repo loại `.agents/`/docs nên kiểm nội dung riêng. Thay đổi navigation/layout/demo/model vẫn chạy coverage theo [verification](verification/README.md).

## Handoff sang setup server

Giao revision consumer chứa workflow, toàn bộ skills, checker và docs. Operator qua repo Symphony kiểm installed profile và permissions, toolchain/browser isolation, workspace/process inventory; drain chỉ landing instance cũ nếu có, không dừng FE/BE để onboard landing.

Hoàn tất consumer/CI/delivery source và deploy compatible Symphony trước. **Canary do người dùng giao sau**, không tự queue issue để chứng minh config. Operator drain/reconcile route cần cutover, giữ branch/PR/output/status và refresh instructions trong workspace/session mới; không reset Progress/In Review về Ready. Scope/checker hoàn tất có thể bàn giao trước canary, nhưng chỉ claim adopted worker sau effective-profile và authorized canary evidence.

Canary đi hết Ready → Progress → In Review independent review → merge → Cloudflare/live revision/basic loading → saved delivery → Done. Người dùng nghiệm thu trước mở queue rộng; QA sản phẩm tách riêng, không tạo QA Subtask riêng cho cơ chế. Restart/feedback/Blocked resume/quiet wait/recovery dùng tests/diagnostics khi thích hợp, không cố gây lỗi public. Website release và Symphony activation là hai evidence khác nhau; configuration reload không thay context/session/checkout cũ.

Nếu lỗi, dừng landing instance, giữ workspace/branch/PR/Jira history và reconcile trước chạy lại. Config reload lỗi có thể giữ last-known-good profile; phải đọc logs/effective state, không coi file mới là config đang dùng. Không rollback bằng xóa output hoặc reset hàng loạt issue về Ready.

Kết quả consumer ban đầu được ghi ở [implementation record](symphony-onboarding-plan.md#6-kết-quả-consumer-implementation); record đó mô tả cấu hình trước lượt cập nhật profile/browser này. Kiểm lại checker và affected checks trên revision giao. Server/canary và hosted delivery có evidence riêng khi thực hiện.
