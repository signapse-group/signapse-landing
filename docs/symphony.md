# Symphony consumer cho Signapse Landing

[WORKFLOW.md](../WORKFLOW.md) và 8 skills trong [.agents/skills](../.agents/skills/) là consumer do landing sở hữu, được adapt từ FE revision `34c24e695bb0fe1cf634ac7b5c737565bfd67a94`. Symphony chỉ cung cấp runtime; không cài package skills chung, không cần checkout FE/planning/app để build/test landing.

Người dùng chấp nhận triển khai consumer ngày **2026-10-07** theo [plan](symphony-onboarding-plan.md). Cài đặt, cấu hình và activation trên server sẽ được người dùng thực hiện riêng qua repo Symphony sau cập nhật này. File trong repo không xác nhận một worker đang chạy.

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

Consumer hiện giữ tracker map, `$SYMPHONY_WORKSPACE_ROOT`, clone cố định landing và frozen install. Hook kiểm Node `.node-version` và pnpm `packageManager` trước install: **24.21.0 / 10.34.5**. Credentials nằm ở host environment/credential helper; không ghi Jira/GitHub secrets vào file workflow hoặc app `.env`.

Chưa có deployed landing profile để inherit. Các fields optional về polling, concurrency, timeouts, Codex/model, approval và sandbox/network được để trống, dùng defaults của runtime khi parse. Đây là compatibility baseline; **operator phải kiểm/chốt deployment profile trước activation**. Không copy helper FE, `.env.local`, account files, auth integration lane hoặc model/sandbox policy FE sang landing.

| Input operator cần kiểm | Điều kiện trước activation |
| --- | --- |
| Symphony binary/revision | Có routed Jira support đã kiểm theo source `2a58b987a1eb5b7bc02659fd5a49df8164807a4c` hoặc bản tương thích; source HEAD không chứng minh binary đã cập nhật. |
| Host env và workspace | `JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN`, `SYMPHONY_WORKSPACE_ROOT`; root landing riêng, không source checkout và không overlap worker route khác. |
| Code-host/agent tools | Git auth/helper cho clone/push, GitHub PR/CI tooling, Codex login và independent reviewer; `jira_rest` không cấp GitHub auth. |
| Jira worker account | Đọc Subtask/parent/comments/links, ghi comment/authorized transitions; kiểm native transitions/resume và landing Development-panel linking bằng đúng account. |
| Toolchain/network | Node/pnpm pins, frozen install, sandbox/network/cache permissions, đủ hook timeout đo từ fresh clone; runtime mặc định 60 giây không phải kết quả benchmark. |
| Browser/runtime | Chromium + Linux libraries; một lần cài `pnpm exec playwright install --with-deps chromium` theo operator. Shared lock/port isolation trước concurrent browser checks. |
| Observability và evidence | Profile/process/queue/port được kiểm; evidence tồn tại sau workspace cleanup. `test-results/` ignored không tự đáp ứng retention. |

Không cấp Cloudflare token chỉ để chạy landing quality. App env preview giữ noindex, Analytics off và origins khớp build/browser. Canonical/indexing, hosting và release theo [runbook deployment](deployment/signapse-cloud.md).

### Browser isolation trên shared host

[Playwright](../playwright.config.ts) dùng port `4321`, `workers: 1` và `reuseExistingServer: !CI`. `workers: 1` không khóa giữa nhiều issue workspaces; preview đang chạy của workspace khác có thể làm kết quả sai.

Operator cung cấp một wrapper shared lock cho build/browser trên port đó, hoặc cơ chế port isolation đang có. Mọi invocation, kể cả focused tests/reviewer, dùng cùng cơ chế và `CI=1` để không reuse preview. Nếu chưa có isolation, chưa bật nhiều browser invocations cùng host; báo prerequisite thiếu thay vì dùng preview đang có. Wrapper/lock/service path được thiết lập ở repo Symphony khi setup server, không hardcode trong landing consumer.

Baseline operator chạy trên fresh workspace: frozen install → `pnpm check` → `pnpm lint` → `pnpm format:check` → `pnpm build` → `pnpm test:models` → `pnpm test:browser`, qua wrapper khi cần. Fixtures/app links được intercept; không cần backend, login, dashboard checkout hoặc GPU thật để chứng minh WebGL fallback.

## Kiểm tra consumer offline

[Checker](../scripts/check-symphony-workflow.exs) dùng parser/config, Jira normalization và strict Liquid thực của Symphony với fixture credentials. Từ Symphony Elixir project đã cài deps, truyền absolute paths:

```bash
MIX_ENV=test mix run --no-start /path/to/signapse-landing/scripts/check-symphony-workflow.exs /path/to/signapse-landing/WORKFLOW.md
```

Checker xác minh supervisor chưa chạy; không gọi hooks, polling, clone hoặc Jira writes. Nó kiểm profile/repo, native parent/type, zero/wrong/two routes, wrong project, Ready/Progress dependency categories và 12 fixtures Liquid gồm nullable context/description và retry attempt. Scheduler restart/cleanup coverage thuộc tests Symphony hiện có; consumer không dựng runtime kiểm giả.

Sau sửa root workflow hoặc checker, chạy offline check cùng check/lint/format/build theo repo policy. Skills cần validate frontmatter/metadata, local links, UTF-8/LF và invocation policies; formatter repo loại `.agents/`/docs nên kiểm nội dung riêng. Thay đổi navigation/layout/demo/model vẫn chạy coverage theo [verification](verification/README.md).

## Handoff sang setup server

Giao revision consumer chứa workflow, toàn bộ skills, checker và docs. Operator qua repo Symphony kiểm installed profile và permissions, toolchain/browser isolation, workspace/process inventory; drain chỉ landing instance cũ nếu có, không dừng FE/BE để onboard landing.

Coordinator giao canary scope hẹp sau preflight. Kiểm clone/skills, Ready → Progress, reviewed PR và CI, saved delivery comment, Progress → In Review và worker dừng; scenario restart/review/Blocked resume reuse output được kiểm trong scope canary đã giao. Coordinator quyết định Done và mở queue. Việc `SIGN-113` được normalize hoặc producer Done không tự queue issue đó.

Nếu lỗi, dừng landing instance, giữ workspace/branch/PR/Jira history và reconcile trước chạy lại. Config reload lỗi có thể giữ last-known-good profile; phải đọc logs/effective state, không coi file mới là config đang dùng. Không rollback bằng xóa output hoặc reset hàng loạt issue về Ready.

Kết quả kiểm chứng consumer local của cập nhật này được ghi ở [implementation record](symphony-onboarding-plan.md#6-kết-quả-consumer-implementation). Server/canary và hosted delivery có evidence riêng khi thực hiện.
