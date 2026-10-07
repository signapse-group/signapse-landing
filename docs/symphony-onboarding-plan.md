# Kế hoạch skills và workflow Symphony cho Signapse Landing

Khảo sát ngày **2026-10-07**, múi giờ Asia/Bangkok. Người dùng đã chấp nhận triển khai consumer ngày **2026-10-07**; giữ phần khảo sát/đề xuất dưới đây làm baseline và ghi kết quả tại [implementation record](#6-kết-quả-consumer-implementation). Setup/activation server được người dùng thực hiện sau qua repo Symphony; cập nhật consumer không chạy canary hoặc thay đổi Jira.

Đề xuất lấy **8 skills từ FE**, adapt thành policy landing và dùng Jira Subtask worker với `route-landing`. Source Symphony hiện đã hỗ trợ profile cần thiết; chưa có căn cứ cần sửa runtime. Hoàn tất consumer trong repo trước, kiểm tra profile/server thực tế rồi mới chạy canary được coordinator giao.

## 1. Nguồn khảo sát và hiện trạng

Đã đối chiếu `origin` với repo được planning cấu hình và xác nhận local HEAD bằng remote default HEAD; cả bốn default branch là `main`.

| Repository | Revision | Kết quả |
| --- | --- | --- |
| `signapse-landing` | `86bc7550e18b70bae0ae934556488d1193d3a3e5` | Checkout sạch lúc khảo sát; chưa có `WORKFLOW.md` hoặc skills được Git track. Astro static + React islands, build/test độc lập. [Instructions][landing-agents], [toolchain/scripts][landing-package], [CI][landing-ci]. |
| FE: `signapse-ui` | `34c24e695bb0fe1cf634ac7b5c737565bfd67a94` | Checkout sạch; có 24 skills local, Jira consumer đã adapt, policy/review/handoff và offline checker dùng được làm nguồn. [Workflow][fe-workflow], [policy][fe-policy], [adaptation record][fe-plan], [checker][fe-checker]. |
| `signapse-planing` | `03987644910f1b5db65ed0b1331930c458fc80db` + thay đổi local | Sở hữu hierarchy, routing/lifecycle và landing requirement/design. [Workflow chuẩn][planning-workflow], [Subtask][planning-subtask], [handoff][planning-tracker], [landing contract][landing-contract]. |
| `signapse-symphony` | `2a58b987a1eb5b7bc02659fd5a49df8164807a4c` | Checkout sạch; có Jira native Subtask/type/parent, exclusive routing, dependency admission, Progress recovery và `jira_rest`. [Runtime guide][symphony-guide], [selection][symphony-jira], [scheduler][symphony-scheduler], [regression checks][symphony-tests]. |

Planning có thay đổi local ở workflow, issue formats và frontend docs; các phần đã đọc gồm `WORKFLOW.md`, `workflow/project-execution-workflow.md`, `workflow/issue-types/subtask.md`. Diff bổ sung hướng dẫn validation/QA, không đổi route map hoặc lifecycle được dùng trong plan này. Phải đọc lại bản owner publish trước implementation; worker clone không có các thay đổi local đó.

Các phân biệt cần giữ:

- `elixir/WORKFLOW.md` của Symphony dùng GitHub Project để phát triển **chính Symphony**. Landing dùng Jira profile trong runtime guide và FE consumer; không sao chép lifecycle GitHub/merge-only completion đó.
- Planning còn ghi shared execution skills và baseline runtime `77f8c82` trong migration notes. Đây là drift tài liệu: runtime và FE hiện xác định skills do consumer sở hữu, độc lập với Symphony. Planning owner cập nhật riêng; khảo sát source không xác nhận bản cài trên server.
- Requirement, copy contract, Pen/design và ADR landing ở planning. Landing giữ code, runtime copy/assets/demo, tests, runbook và evidence. Workflow mới không chuyển ownership thiết kế về landing hoặc thêm phụ thuộc checkout planning vào build/test.
- CI landing có workflow `Verify`, job `check`, chạy checks/model/browser trên push và PR. `workflow_dispatch` trên `main` còn thực hiện Cloudflare deploy. Chưa xác minh branch protection hoặc hosted CI của revision hiện tại; không suy successful run từ YAML.

### Jira live tại lượt khảo sát ban đầu

Đã đọc metadata tại [Jira Signapse](https://signapse-group.atlassian.net/): project `SIGN` có native `Subtask` với `subtask=true` và đủ `Open`, `Ready`, `Progress`, `In Review`, `Blocked`, `Done`. `Done` thuộc category `done`; `In Review` và `Blocked` thuộc category `indeterminate`.

Query `project = SIGN AND issuetype = Subtask AND labels = "route-landing"` chưa trả issue nào trong phạm vi tài khoản khảo sát đọc được. Tìm thêm theo title phát hiện [SIGN-113](https://signapse-group.atlassian.net/browse/SIGN-113):

- Native Subtask, parent `SIGN-111`, status `Open`, labels rỗng; title vẫn là `FE: Tích hợp form liên hệ trên landing`, trong khi Deliverable chỉ rõ `signapse-landing`.
- Dependency native Blocks trỏ tới `SIGN-112`, hiện `In Review`; chưa đạt routed admission category `done`.
- Reference còn trỏ tới `docs/design/LANDING.md` cũ trong landing; Deliverable còn yêu cầu cập nhật contract landing, nay thuộc planning. Coordinator cần reconcile prefix `LANDING:`, route, references và ownership/scope trước giao việc; không chỉ thêm label rồi queue.

[SIGN-114](https://signapse-group.atlassian.net/browse/SIGN-114) là mẫu FE có route và parent native, đang `Ready`; transitions tài khoản hiện tại đọc được dẫn tới `Progress` và `Blocked`. Đây không phải quyền của tài khoản worker và không chứng minh toàn bộ transition/resume rules. Không có issue/comment/status writes trong khảo sát này.

Khi bắt đầu implementation ngày **2026-10-07**, đã đọc lại `SIGN-113`: title `LANDING:`, route `route-landing`, scope/references theo ownership hiện tại, status vẫn `Open`; producer blocker `SIGN-112` đã `Done`. Các routing/reference gaps ghi trên là lịch sử và đã được planning xử lý. Chưa queue/implement form hay nghiệm thu Story; worker/contract readiness vẫn phải kiểm live trước assignment.

## 2. Skills lấy từ FE

Nguồn là `.agents/skills/` của FE tại revision trên; đích là `.agents/skills/` trong landing, được commit cùng consumer. Copy từng cây skill đầy đủ, gồm references, scripts cần thiết và `agents/openai.yaml`; giữ license/attribution và kiểm tra tất cả links. Sau adapt, landing tự sở hữu các bản này; không dùng symlink tới FE hoặc cài package skills từ Symphony.

| Skill | Vai trò | Adaptation cần làm |
| --- | --- | --- |
| `agent-execution-policy` | Authority, lifecycle, verification/review và delivery handoff | Đổi repo/route thành landing; thay sources/checks FE bằng Astro; tham chiếu contract/design planning; giữ conditional API policy. |
| `implement` | Thực thi assigned contribution tới handoff | Giữ resume cùng workspace/branch/PR và đọc live contract; dùng check/model/browser của landing, không dùng `test:quality` hay integration lane FE. |
| `code-review` | Một independent reviewer, hai axes | Review Requirement adherence và Correctness & Standards; kiểm SSR/islands, VI/EN, fallback, lifecycle cleanup và metadata khi scope liên quan. |
| `setup-workflow` | Duy trì root `WORKFLOW.md` | Đổi profile/clone/refs sang landing; tách repo config khỏi host provisioning/activation; giữ invocation explicit và preflight offline. |
| `tdd` | Verification theo behavior/risk | Dùng `node:test` cho model và Playwright trên built Astro output; external API fixtures được phép ở consumer boundary; không thêm Vitest hoặc backend/database dependency. |
| `diagnosing-bugs` | Reproduce → root cause → regression | Dùng seam hiện có cho hydration, navigation, demo/playback, metadata và browser; ADR/contract theo planning, không giả định `CONTEXT.md` local. |
| `accessibility` | Native semantics, keyboard/focus, reduced motion | Giữ references WCAG/patterns; áp vào Astro HTML và React islands, kiểm VI/EN/noJS/zoom/fallback theo ma trận hiện có. |
| `resolving-merge-conflicts` | Resume và xử lý conflict trong contribution | Sửa chỉ dẫn FE “stage everything” thành stage riêng files được giao; giữ thay đổi người khác và đưa intent/scope conflict chưa rõ về owner. |

Giữ policy activation boundary: cài skill hoặc gọi task thông thường không tự bật Jira lifecycle/PR handoff. Metadata `implement` và `setup-workflow` giữ `allow_implicit_invocation: false`; `agent-execution-policy` hiện là `true`, nhưng nội dung phải tiếp tục giới hạn vào assigned/explicitly activated workflow. Copy metadata đúng từng skill, không bật/tắt hàng loạt. `$implement` trong prompt Symphony là invocation explicit.

Các references cần adapt cùng entrypoint: `agent-execution-policy/references/execution-policy.md`, `decision-gate.md`, `api-handoff.md` và `setup-workflow/references/symphony-workflow.md`. API reference chỉ kích hoạt khi task thật sự tích hợp API, chẳng hạn form công khai; CTA dashboard/Articles và demo fixture hiện tại không cần fetch OpenAPI hoặc có app login.

| Nhóm còn lại | Quyết định |
| --- | --- |
| `technical-design` + companion `codebase-design` | Phù hợp khi human cần thiết kế contribution/seam từ contract đã chốt; để đợt sau khi có nhu cầu, không gọi trong unattended loop. |
| `next-best-practices`, `clerk-nextjs-patterns` | Không chuyển: landing dùng Astro và không sở hữu auth/session. |
| `shadcn`, `migrate-radix-to-base` | Không chuyển trong onboarding: landing không có preset/CLI shadcn; Base UI đang có không đủ lý do mang workflow migration. |
| `frontend-design`, `ui-ux-pro-max` | Không chuyển làm quyền tự chọn visual: palette/fonts/design đã chốt và planning sở hữu design. |
| `improve-codebase-architecture`, `wizard`, skills teaching/questionnaire/writing | Không cần cho worker baseline; bổ sung theo task rõ ràng thay vì copy toàn bộ 24 skills. |

Không copy `skills-lock.json` của FE: nó chứa nguồn của nhiều skills không được chọn. Không tạo cơ chế sync/version/package mới; provenance là FE revision và các adaptation được review trong thay đổi consumer.

## 3. Workflow landing đích

Map đã được planning chốt: **dispatch** `[Ready, Progress]`, **active** `[Ready, Progress]`, **review handoff** `In Review` non-terminal, **terminal** `[Done]`. `Open`, `In Review`, `Blocked` nằm ngoài execution.

Phần repo profile dưới đây là outline để implementation; chưa phải file chạy hoàn chỉnh hoặc host profile đã duyệt:

```yaml
tracker:
  kind: jira
  provider:
    base_url: $JIRA_BASE_URL
    email: $JIRA_EMAIL
    api_token: $JIRA_API_TOKEN
    project_key: SIGN
    issue_types: [Subtask]
    routing_labels:
      - route-backend
      - route-frontend
      - route-quality-assurance
      - route-mdg
      - route-landing
  required_labels: [route-landing]
  dispatch_states: [Ready, Progress]
  active_states: [Ready, Progress]
  review_state: In Review
  terminal_states: [Done]
workspace:
  root: $SYMPHONY_WORKSPACE_ROOT
```

Full routing set giúp runtime loại issue có hai recognized routes; business labels khác vẫn được giữ. Worker kiểm native type/parent, đúng repo trong Deliverable và native dependencies trước initial/retry admission. Prefix/assignee/parent Ready không thay route hoặc quyền dispatch. Runtime admission dùng blocker category `done`; `Resolved` hoặc `In Review` chưa đạt. Parent relationship không tự là dependency.

Prompt và local policy phải đủ các nội dung sau:

1. Đọc `AGENTS.md`, README/docs index, applicable instructions, `$agent-execution-policy` rồi gọi `$implement`. Reread live Subtask, parent Story/Task/Bug, accepted comments, links/dependencies và design/AC đúng revision ở start/resume/handoff bằng `jira_rest`. Liquid context gồm immutable ID, key, type/parent, title/state/URL/labels/description và attempt, guard các nullable fields.
2. Ready là assignment của coordinator; agent recheck rồi chuyển `Progress` trước implementation. Progress phục hồi cùng output. Dừng tại In Review/Blocked/Done; review feedback trở lại Progress. Resolve transition từ trạng thái đích hiện tại, không hardcode ID. Kết quả write không chắc chắn thì đọc lại trước retry.
3. Giữ static HTML, React islands, typed VI/EN, noJS/reduced-motion/WebGL fallbacks, một showcase island và disposal theo [architecture](architecture.md). App links lấy origin config; thiếu design/reference chặn phần phụ thuộc, không tự tạo requirement/Pen/design mới.
4. Chạy verification đúng scope, một independent reviewer cho hai axes, sửa blocking findings. Đề xuất theo FE: contribution thay đổi files của repo có một reviewed PR vào default branch, title `[SIGN-<key>] LANDING: <title>`; read-only report không bắt buộc PR. Đây là policy consumer cần được chấp nhận khi implement, không phải quy tắc PR bắt buộc đã có ở landing.
5. Khi có PR, theo dõi CI Verify của revision giao; không gọi manual deploy lane nếu scope chưa giao deployment. Một agent-owned Jira delivery comment theo planning format, cập nhật thay vì duplicate, đọc lại sau ghi. Record repo/revision, review, checks, deploy hoặc Not applicable/pending owner, durable evidence và gaps; conditional API fields theo producer contract.
6. Prompt cấp quyền scoped implementation, commits/push/PR/CI, comments trên assigned Subtask và `Ready → Progress`, `Progress → In Review`, active → Blocked theo gate. Coordinator giữ Open → Ready, Blocked resume đúng pre-Blocked state, Done và parent acceptance. Merge/deploy/đổi requirement/tạo ticket khác chỉ trong scope được human giao rõ.

Blocked cần điều kiện bên ngoài khiến không còn tiến triển có ý nghĩa: lưu reason/checks/needed owner/pre-Blocked và đọc lại comment trước transition. Resume phải xác minh resolution rồi reuse output; đổi status không tự chứng minh đã giải quyết. Native Jira Blocked khác runtime suspension do operator-input; runtime suspension ở memory và mất khi restart.

### Clone, checks và boundaries

Clone cố định `https://github.com/signapse-group/signapse-landing.git`, dùng code-host auth/helper do host cung cấp; bootstrap `pnpm install --frozen-lockfile`. Toolchain lấy `.node-version` (**24.21.0**) và `packageManager` (**pnpm 10.34.5**). Clone bao gồm local skills; không clone FE/planning/app làm prerequisite.

Không copy các đường dẫn/helper FE `prepare-fe-workspace`, `run-fe-quality`, `run-fe-integration`, `SIGNAPSE_UI_APP_ENV`/account files hoặc model/sandbox settings vào landing. Host operator cung cấp profile thực tế: workspace root riêng, hooks/auth helper, polling, concurrency, turn/hook timeouts, Codex/model, approval, sandbox/network và tools. Khi chưa đọc được profile, để phần này là verification gap; không dùng default concurrency như bằng chứng host đã sẵn sàng.

| Thay đổi | Gate local theo policy landing |
| --- | --- |
| Skills/docs thuần nội dung | YAML/metadata, Markdown links, UTF-8/LF, scope và invocation policies; không thêm application tests chỉ để mirror policy. |
| Source/config, gồm root `WORKFLOW.md`/validation script khi triển khai | `pnpm check`, `pnpm lint`, `pnpm format:check`, `pnpm build`; thêm offline workflow check. |
| Navigation/layout/demo | Các browser tests bị ảnh hưởng trên **built** output; models thêm khi timeline/model thay đổi. |
| Toolchain/browser host baseline trước activation | Chạy đủ check/lint/format/build, `pnpm test:models`, `pnpm test:browser` để chứng minh Linux host chạy landing độc lập. |
| API/form integration được giao | Consumer fixture tests giữ build độc lập; producer OpenAPI/publication và live integration evidence cần riêng theo contract. |

Preview giữ `SIGNAPSE_LANDING_INDEXABLE=false`, Analytics off; app origin fixture khớp build và `PLAYWRIGHT_APP_ORIGIN` nếu khác mặc định. Canonical/indexing/domain/Cloudflare release theo [runbook](deployment/signapse-cloud.md), không phải tác dụng phụ của setup Symphony.

## 4. Thứ tự implementation và rollout

Các bước là thứ tự làm việc, không phải tickets mới đã publish. Một consumer contribution bao gồm skills/policy/config/check/runbook liên quan; không chia issue theo từng file hoặc skill.

| Bước | Owner/phạm vi | Output và điều kiện hoàn tất |
| --- | --- | --- |
| 1. Adapt skills/policy | Landing | 8 skill trees và references/metadata đã chuyển, không còn route/repo/checks/auth assumptions của FE. Bổ sung pointers ngắn trong AGENTS/README/docs index; giữ kiến trúc hiện tại và boundaries human request. |
| 2. Dựng consumer | Landing, đọc host profile khi có access | Root `WORKFLOW.md`: tracker map trên, clone/bootstrap và unattended prompt; deployment fields từ profile thực. Policy PR/review/handoff được review như đề xuất; không activate Jira hoặc service trong bước ghi file. |
| 3. Kiểm tra và giao revision | Landing | Adapt FE checker thành `scripts/check-symphony-workflow.exs`; validate offline bằng đúng Symphony runtime. Repo completion checks theo bảng trên, independent review và Verify CI khi giao qua PR. Skills/config/check/runbook phải có trong revision worker clone được. |
| 4. Server preflight/setup | Operator | Installed Symphony revision/profile, permissions/tools/toolchain/browser, env/root/locking, baseline landing checks và observability đã xác nhận. Setup host là scope tiếp theo; khảo sát này chưa thực hiện. |
| 5. Canary và mở queue | Coordinator + operator | Reconcile các issue landing, giao một canary scope hẹp, kiểm transitions/clone/PR/handoff/recovery. Chỉ mở queue sau kết quả được coordinator chấp nhận. |

### Offline consumer check

Tái sử dụng [checker FE][fe-checker], đổi repo, own route và fixture title/workspace thành landing. Giữ real runtime parser/config, Jira normalization và strict Liquid rendering, fixture credentials; chạy `mix run --no-start` từ Symphony Elixir project với paths tới checker và landing workflow. Checker xác minh supervisor chưa chạy, không polling/clone hooks/live writes.

Coverage tối thiểu: valid landing Subtask; reject parent/non-Subtask, missing parent, zero/wrong/two routes, wrong project; Ready/Progress dependencies Done/Closed so với Resolved/unknown/malformed; nullable type/parent/description và attempt; exact clone destination và dispatch/active/review/terminal profile. Reuse scheduler recovery/cleanup tests Symphony đã có, không xây scheduler giả trong landing. Test lifecycle/canary khác với chỉ parse YAML.

Windows hiện không có `mix`/`elixir` trên PATH. Khi implementation, dùng Linux runtime/container có dependencies hoặc host đã kiểm tra; repository build/browser vẫn không phụ thuộc checkout Symphony. Phiên khảo sát này chưa chạy offline checker hay rerun các application/runtime suites.

### Server preflight cần có trước activation

- **Installed runtime:** xác minh binary/revision thực có Jira type/routing/admission/recovery được khảo sát; source HEAD mới không chứng minh service đã cập nhật. Nếu chạy source, theo Elixir 1.19.5/OTP 28 của runtime; release binary có prerequisites riêng theo runtime guide.
- **Profile/processes:** một orchestrator cho route landing, workspace root riêng và không dùng source checkout làm agent cwd. Đọc service manager/env/launch arguments hiện có trước chọn service name, paths, dashboard port hoặc model. Inventory/drain chỉ instance landing cũ nếu tồn tại; không dừng worker FE/BE để onboard landing.
- **Credentials/tools:** Jira worker có Browse/parent/comments/links và scoped comment/transition permissions; GitHub clone/push/PR/CI access riêng, Git/PR tooling và independent reviewer hoạt động. `jira_rest` là host-side tool của runtime; connector đang dùng trong khảo sát không chứng minh worker đã có login/quyền. Không cấp Cloudflare token chỉ để chạy quality.
- **Toolchain/bootstrap:** đúng Node/pnpm pins, network/cache permissions, frozen install. Cài Chromium và Linux libraries một lần bằng quy trình operator; đo fresh bootstrap để chọn hook timeout. Runtime default hook timeout là 60 giây; FE dùng 900 giây, cả hai không chứng minh timeout thích hợp cho host landing.
- **Browser isolation:** [Playwright config](../playwright.config.ts) mặc định port `4321`, `reuseExistingServer: !CI`. Nhiều issue workspaces cùng host có thể kiểm nhầm preview. Đề xuất host wrapper dùng `CI=1` và một shared lock cho lượt build/browser trên port đó, gồm focused browser checks; mọi agent/reviewer dùng cùng wrapper. `workers: 1` chỉ giới hạn một invocation, không khóa giữa các issue. Nếu host đã có cơ chế port/lock dùng lại; chưa đạt isolation thì không mở concurrency nhiều issue. Không cần sửa source để nhân bản port allocator.
- **Env/evidence:** preview noindex, build/test origin khớp, logs/trace không chứa secret; evidence cần durable URL/revision trước terminal cleanup workspace. `test-results/` ignored không tự là retention. Kiểm docs/verification hoặc artifact storage thực tế, không mặc định CI artifact tồn tại lâu đủ yêu cầu.
- **Jira/PR linkage:** đọc lại route, parent/dependencies và transitions với chính worker account. Kiểm GitHub for Atlassian đã cấp quyền cho landing và PR canary xuất hiện thật trong Development panel; planning chỉ ghi xác nhận sáu repo khác. Required checks/branch protection đọc từ GitHub thực tế, không đoán từ tên YAML.

Baseline quality trên fresh landing workspace của server: frozen install → check/lint/format/build → models → browser. Không có backend/login/app checkout; browser tests intercept app links và chạy các WebGL/noJS/reduced-motion fallbacks hiện có. Báo scope và result thực tế, không yêu cầu GPU render pass trên server nếu contract cho phép fallback.

### Canary, handoff và rollback

Coordinator chọn contribution hẹp không bị producer/API/design chặn; chưa dùng `SIGN-113` khi các gaps trên còn tồn tại. Chỉ coordinator quyết định publish/reconcile hoặc Open → Ready; plan này không tự tạo issue hay dùng FE route để thay landing route.

Canary xác minh: clone đúng landing và skills có sau clone; Ready → Progress; scoped branch/PR chứa Jira key; checks/review; một saved delivery comment; Progress → In Review và worker dừng. Kiểm Progress restart/review feedback reuse workspace/branch/PR, Blocked resume theo status trước đó; các scenario live phải được coordinator giao, không cố tình thao tác issue sản phẩm khác để thử workflow. Coordinator giữ Done sau applicable review/check/merge/deploy evidence gate; merge không tự Done.

Nếu canary/config lỗi, operator dừng instance landing, giữ workspaces/branches/PRs/Jira history và reconcile trước chạy lại. Không rollback bằng xóa output hoặc chuyển hàng loạt issue về Ready. Config reload lỗi có thể giữ last-known-good workflow; cần đọc runtime logs/effective state, không coi file mới trên đĩa là config đã áp dụng.

## 5. Hai mốc hoàn tất và gaps còn lại

**Consumer sẵn sàng:** skills/policy/workflow/checker nhất quán, references đúng ownership, offline config/selection/rendering và checks/review của delivered revision đạt, có hướng dẫn server/activation. Không thêm package dependency hoặc sửa runtime nếu existing checks không chỉ ra gap.

**Worker được kích hoạt:** operator kiểm installed profile/quyền, browser isolation/baseline checks, route inventory và canary; Development-panel linking/handoff/recovery được chứng minh, coordinator chấp nhận mở queue. Source readiness và consumer readiness không thay mốc này.

Gaps tại lượt khảo sát: chưa đọc server/profile/binary/worker account, chưa kiểm branch protection/CI hiện tại hoặc landing Development-panel linkage, chưa có canary route landing; planning owner cần refresh migration/package notes. `SIGN-113` và producer dependency đã được đọc lại ở implementation như phần Jira trên. Các gaps deployment không chặn chuẩn bị skills và repo policy, nhưng chặn tuyên bố runtime đã sẵn sàng dispatch.

Evidence của lượt này là đọc source/policy/test definitions, remotes/revisions/dirty diffs và Jira metadata/issues/transitions read-only. Không có kết quả chạy mới cho application tests, Symphony tests, server canary hoặc deploy. Bản plan giữ đề xuất tách biệt với policy đã chốt và evidence thực thi.

## 6. Kết quả consumer implementation

Triển khai local ngày **2026-10-07** theo yêu cầu đã chấp nhận, trên branch `codex/landing-symphony-onboarding`, base `86bc7550e18b70bae0ae934556488d1193d3a3e5`:

- Đã chuyển/adapt đủ 8 skill trees và supporting references/metadata từ FE revision trong bảng khảo sát. Không copy FE auth/runtime helpers hoặc source lock/package; invocation/dependency policies giữ nguyên. Các skill dùng checks Astro và planning-owned references; API lookup chỉ theo scope thực sự tích hợp API.
- Đã tạo root `WORKFLOW.md`, Jira Subtask `route-landing`, Ready/Progress → In Review boundary, cố định clone destination và frozen bootstrap đúng toolchain. Deployment-owned optional settings được để trống; không tạo host/model/sandbox/credential profile mới.
- Đã thêm [offline checker](../scripts/check-symphony-workflow.exs), [consumer runbook](symphony.md) và pointers ở AGENTS/README/docs index. Không sửa source/runtime assets của landing, tính năng form, repo FE/planning/Symphony hoặc issue/status Jira.

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

[landing-agents]: https://github.com/signapse-group/signapse-landing/blob/86bc7550e18b70bae0ae934556488d1193d3a3e5/AGENTS.md
[landing-package]: https://github.com/signapse-group/signapse-landing/blob/86bc7550e18b70bae0ae934556488d1193d3a3e5/package.json
[landing-ci]: https://github.com/signapse-group/signapse-landing/blob/86bc7550e18b70bae0ae934556488d1193d3a3e5/.github/workflows/ci.yml
[fe-workflow]: https://github.com/signapse-group/signapse-ui/blob/34c24e695bb0fe1cf634ac7b5c737565bfd67a94/WORKFLOW.md
[fe-policy]: https://github.com/signapse-group/signapse-ui/blob/34c24e695bb0fe1cf634ac7b5c737565bfd67a94/.agents/skills/agent-execution-policy/references/execution-policy.md
[fe-plan]: https://github.com/signapse-group/signapse-ui/blob/34c24e695bb0fe1cf634ac7b5c737565bfd67a94/docs/jira-workflow-adaptation-plan.md
[fe-checker]: https://github.com/signapse-group/signapse-ui/blob/34c24e695bb0fe1cf634ac7b5c737565bfd67a94/scripts/check-symphony-workflow.exs
[planning-workflow]: https://github.com/signapse-group/signapse-planing/blob/03987644910f1b5db65ed0b1331930c458fc80db/workflow/project-execution-workflow.md
[planning-subtask]: https://github.com/signapse-group/signapse-planing/blob/03987644910f1b5db65ed0b1331930c458fc80db/workflow/issue-types/subtask.md
[planning-tracker]: https://github.com/signapse-group/signapse-planing/blob/03987644910f1b5db65ed0b1331930c458fc80db/workflow/issue-tracker.md
[landing-contract]: https://github.com/signapse-group/signapse-planing/blob/03987644910f1b5db65ed0b1331930c458fc80db/ui-design/references/landing/LANDING.md
[symphony-guide]: https://github.com/signapse-group/signapse-symphony/blob/2a58b987a1eb5b7bc02659fd5a49df8164807a4c/elixir/README.md#routed-jira-subtask-workflows
[symphony-jira]: https://github.com/signapse-group/signapse-symphony/blob/2a58b987a1eb5b7bc02659fd5a49df8164807a4c/elixir/lib/symphony_elixir/jira/client.ex
[symphony-scheduler]: https://github.com/signapse-group/signapse-symphony/blob/2a58b987a1eb5b7bc02659fd5a49df8164807a4c/elixir/lib/symphony_elixir/orchestrator.ex
[symphony-tests]: https://github.com/signapse-group/signapse-symphony/blob/2a58b987a1eb5b7bc02659fd5a49df8164807a4c/elixir/test/symphony_elixir/jira_adapter_test.exs
