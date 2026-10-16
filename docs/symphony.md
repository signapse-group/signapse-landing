# Symphony consumer cho Signapse Landing

[WORKFLOW.md](../WORKFLOW.md) là điểm vào assigned execution do landing sở hữu. Phase procedures và standards được clone cùng repository; skills hỗ trợ kỹ thuật, không cần Symphony skill-package hay checkout FE/planning/app để build/test landing.

Người dùng chấp nhận triển khai consumer ngày **2026-10-07** theo [historical record](verification/symphony-consumer-2026-10-07.md), rồi yêu cầu cập nhật profile/browser sau khảo sát revision `ec4a2b8`. Cài đặt, cấu hình và activation trên server được thực hiện riêng qua repo Symphony. Trạng thái hiện tại là consumer đã được cập nhật; chưa có evidence activation/canary để xác nhận landing worker đã triển khai.

## Execution entrypoint

Assigned worker thực hiện phase do [WORKFLOW.md](../WORKFLOW.md) chọn; direct/no-PR work giữ boundary riêng. [CONTRIBUTING.md](../CONTRIBUTING.md) sở hữu standards và verification selection. Guide này sở hữu host inputs, browser isolation, offline validation và operator handoff, không sở hữu phase procedure.

Checkout điều khiển trên server giữ nhánh `main` để tương thích nút Update workflow. Issue workspace mới clone từ `dev`; feature PR và delivery nhắm `dev` / `https://dev.signapse.cloud`. Public release dùng PR riêng `dev` → `main`, do coordinator duyệt. Khi cutover, giữ output workspace cũ và đối soát base/PR trước resume; không reset hàng loạt.

## Repo profile và deployment profile

Consumer giữ tracker map, `$SYMPHONY_WORKSPACE_ROOT`, clone cố định nhánh `dev` của landing vào `.` và frozen install. Hook yêu cầu `$SYMPHONY_GIT_CREDENTIAL_HELPER` do host cấp, dùng helper khi clone và lưu cấu hình helper trong Git local để các lượt fetch/push tiếp theo dùng cùng helper. Hook kiểm Node `.node-version` và pnpm `packageManager` trước install: **24.21.0 / 10.34.5**. Host cấp helper executable và secrets; workflow chỉ giữ tên env, không chứa token hoặc copy credentials vào app `.env`.

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

Checker xác minh supervisor chưa chạy; không gọi hooks, polling, clone hoặc Jira writes. Nó kiểm concurrency/timeout/Codex/sandbox đã chốt, executable clone line đúng repo, nhánh `dev` và destination `.` cùng helper cho clone/push, native parent/type, zero/wrong/two routes, wrong project, Ready/Progress/In Review dependency categories và 108 fixtures Liquid cho exclusive phase-runbook selection/unsupported states, nullable/empty context/description và retry. Khi đổi clone line, phải kiểm lại mutations sai repo, clone vào subdir, URL chỉ nằm trong comment, nhánh sai và mất helper persistence. Scheduler restart/cleanup coverage thuộc tests Symphony hiện có; consumer không dựng runtime kiểm giả.

Chọn checks theo [verification selection](../CONTRIBUTING.md#verification-selection): prompt-only thay đổi cần real-runtime offline render và YAML comparison; checker cần formatter/adversarial fixtures; skills cần frontmatter/metadata, links, UTF-8/LF và invocation policies. Actual source/runtime behavior vẫn cần checks tại seam bị ảnh hưởng.

## Handoff sang setup server

Giao revision consumer chứa workflow, standards, phase procedures, technical skills, checker và docs. Operator qua repo Symphony kiểm installed profile và permissions, toolchain/browser isolation, workspace/process inventory; drain chỉ landing instance cũ nếu có, không dừng FE/BE để onboard landing.

Hoàn tất consumer/CI/delivery source và deploy compatible Symphony trước. **Canary do người dùng giao sau**, không tự queue issue để chứng minh config. Operator drain/reconcile route cần cutover, giữ branch/PR/output/status và refresh instructions trong workspace/session mới; không reset Progress/In Review về Ready. Scope/checker hoàn tất có thể bàn giao trước canary, nhưng chỉ claim adopted worker sau effective-profile và authorized canary evidence.

Canary thực hiện profile theo [WORKFLOW.md](../WORKFLOW.md); người dùng nghiệm thu trước mở queue rộng. Restart/feedback/Blocked resume/quiet wait/recovery dùng tests/diagnostics khi thích hợp, không cố gây lỗi public. Website release và Symphony activation là hai evidence khác nhau; reload không thay context/session/checkout cũ.

Nếu lỗi, dừng landing instance, giữ workspace/branch/PR/Jira history và reconcile trước chạy lại. Config reload lỗi có thể giữ last-known-good profile; phải đọc logs/effective state, không coi file mới là config đang dùng. Không rollback bằng xóa output hoặc reset hàng loạt issue về Ready.

Kết quả consumer ban đầu được ghi ở [historical implementation record](verification/symphony-consumer-2026-10-07.md); record đó mô tả cấu hình lịch sử, không phải procedure hiện hành. Kiểm lại checker và affected checks trên revision giao. Server/canary và hosted delivery có evidence riêng khi thực hiện.

[Local organization verification ngày 2026-10-14](verification/symphony-runbooks-2026-10-14.md) ghi real-runtime fixtures, config preservation, skill/link checks và giới hạn adoption.
