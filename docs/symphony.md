# Symphony consumer cho Signapse Landing

[WORKFLOW.md](../WORKFLOW.md) và 8 skills trong [.agents/skills](../.agents/skills/) là consumer do landing sở hữu, được adapt từ FE revision `34c24e695bb0fe1cf634ac7b5c737565bfd67a94`. Symphony chỉ cung cấp runtime; không cài package skills chung, không cần checkout FE/planning/app để build/test landing.

Người dùng chấp nhận triển khai consumer ngày **2026-10-07** theo [plan](symphony-onboarding-plan.md), rồi yêu cầu cập nhật profile/browser sau khảo sát revision `ec4a2b8`. Cài đặt, cấu hình và activation trên server được thực hiện riêng qua repo Symphony. Trạng thái hiện tại là consumer đã được cập nhật; chưa có evidence activation/canary để xác nhận landing worker đã triển khai.

## Contract và lifecycle

Tracker Jira `SIGN`; chỉ nhận native Subtask có parent hợp lệ và đúng một recognized route là `route-landing`. Full routing set giữ BE/FE/QA/MDG/LANDING để loại issue thiếu/sai/nhiều route. Prefix `LANDING:` giúp đọc title; route và Deliverable quyết định repo, assignee/parent Ready không thay quyền dispatch.

| Trạng thái | Worker và owner |
| --- | --- |
| Open | Ngoài dispatch; coordinator define/approve contribution. |
| Ready | Coordinator chủ động giao việc; agent recheck contract/dependencies rồi chuyển Progress. |
| Progress | Execute/resume cùng workspace, branch và PR; review feedback trở lại đây. |
| In Review | Non-terminal human handoff; worker dừng. |
| Blocked | Worker dừng sau saved blocker comment; coordinator giải quyết và resume đúng pre-Blocked status. |
| Done | Terminal; coordinator hoàn tất gate áp dụng. Merge không tự hoàn tất Jira. |

Ready/Progress là dispatch và active states. Native Blocks được kiểm trước initial/retry admission; blocker category `done` mới đủ, `Resolved`/`In Review` chưa đủ. Parent không tự là dependency. Agent đọc live Subtask/parent/comments/references khi start, resume và handoff; planning sở hữu requirement/design/copy contract.

Trong assigned workflow, thay đổi files của repo dùng một reviewed PR vào default branch, title `[<Jira-key>] <current Subtask title>`. Một reviewer độc lập kiểm **Requirement adherence** và **Correctness & Standards**. CI cần `Verify`/job `check` của revision giao và required checks thực tế. Push/merge vào `main` tự chạy CI/deploy Cloudflare; manual `workflow_dispatch` trên `main` cũng deploy, nên không dùng nó để theo dõi PR quality nếu chưa được giao deployment. Worker giữ boundary tại In Review; chủ thể được cấp quyền merge phải biết merge vào `main` sẽ kích hoạt deployment. GitHub for Atlassian/Development-panel linking phải kiểm riêng trước khi tuyên bố đã liên kết.

Một agent-owned Jira delivery comment giữ repo/revision, review, checks, deploy hoặc pending owner/Not applicable, conditional producer API evidence, durable links và gaps. Đọc lại comment sau ghi; không sửa comment người khác hoặc duplicate sau ambiguous writes. Coordinator giữ Done/parent acceptance, maintainer giữ merge; deploy chỉ trong scope được giao. Ordinary requests và consumer maintenance không tự bật tracker lifecycle/PR workflow.

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
| Symphony binary/revision | Có routed Jira support đã kiểm theo source `2a58b987a1eb5b7bc02659fd5a49df8164807a4c` hoặc bản tương thích; source HEAD không chứng minh binary đã cập nhật. |
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

Baseline operator chạy trên fresh workspace: frozen install → `pnpm check` → `pnpm lint` → `pnpm format:check` → `pnpm build` → `pnpm test:models` → `pnpm test:browser`, qua wrapper khi cần. Fixtures/app links được intercept; không cần backend, login, dashboard checkout hoặc GPU thật để chứng minh WebGL fallback.

## Kiểm tra consumer offline

[Checker](../scripts/check-symphony-workflow.exs) dùng parser/config, Jira normalization và strict Liquid thực của Symphony với fixture credentials. Từ Symphony Elixir project đã cài deps, truyền absolute paths:

```bash
MIX_ENV=test mix run --no-start /path/to/signapse-landing/scripts/check-symphony-workflow.exs /path/to/signapse-landing/WORKFLOW.md
```

Checker xác minh supervisor chưa chạy; không gọi hooks, polling, clone hoặc Jira writes. Nó kiểm concurrency/timeout/Codex/sandbox đã chốt, executable clone line đúng repo và destination `.` cùng helper cho clone/push, native parent/type, zero/wrong/two routes, wrong project, Ready/Progress dependency categories và 12 fixtures Liquid gồm nullable context/description và retry attempt. Khi đổi clone line, phải kiểm lại mutations sai repo, clone vào subdir, URL chỉ nằm trong comment và mất helper persistence. Scheduler restart/cleanup coverage thuộc tests Symphony hiện có; consumer không dựng runtime kiểm giả.

Sau sửa root workflow hoặc checker, chạy offline check cùng check/lint/format/build theo repo policy. Skills cần validate frontmatter/metadata, local links, UTF-8/LF và invocation policies; formatter repo loại `.agents/`/docs nên kiểm nội dung riêng. Thay đổi navigation/layout/demo/model vẫn chạy coverage theo [verification](verification/README.md).

## Handoff sang setup server

Giao revision consumer chứa workflow, toàn bộ skills, checker và docs. Operator qua repo Symphony kiểm installed profile và permissions, toolchain/browser isolation, workspace/process inventory; drain chỉ landing instance cũ nếu có, không dừng FE/BE để onboard landing.

Coordinator giao canary scope hẹp sau preflight. Kiểm clone/skills, Ready → Progress, reviewed PR và CI, saved delivery comment, Progress → In Review và worker dừng; scenario restart/review/Blocked resume reuse output được kiểm trong scope canary đã giao. Coordinator quyết định Done và mở queue. Việc `SIGN-113` được normalize hoặc producer Done không tự queue issue đó.

Chỉ đổi trạng thái thành **landing worker đã triển khai** sau khi lưu evidence activation (revision/binary, service/process và effective profile/env đã sanitize) cùng delivery canary (issue/PR/review/CI, Development-panel linking, saved handoff và worker dừng tại In Review). Baseline tests hoặc file workflow trên đĩa chưa đủ. Push/merge vào `main` tự deploy Cloudflare sau Verify; manual dispatch trên `main` cũng deploy. Release evidence của website và activation evidence của Symphony worker là hai gate riêng.

Nếu lỗi, dừng landing instance, giữ workspace/branch/PR/Jira history và reconcile trước chạy lại. Config reload lỗi có thể giữ last-known-good profile; phải đọc logs/effective state, không coi file mới là config đang dùng. Không rollback bằng xóa output hoặc reset hàng loạt issue về Ready.

Kết quả consumer ban đầu được ghi ở [implementation record](symphony-onboarding-plan.md#6-kết-quả-consumer-implementation); record đó mô tả cấu hình trước lượt cập nhật profile/browser này. Kiểm lại checker và affected checks trên revision giao. Server/canary và hosted delivery có evidence riêng khi thực hiện.
