# Kiểm chứng landing Astro

Repo này giữ implementation và bằng chứng chạy landing; baseline đã được người dùng xác nhận ngày **2026-10-04**. Kiểm chứng dựa trên task/AC và [contract tại planning](../../../signapse-planing/ui-design/references/landing/LANDING.md), code và tests trong repo. [README](../../README.md) mô tả cách chạy; [summary.json](summary.json) ghi kết quả local gần nhất.

Boundary dev theo [local handoff policy](../../.agents/skills/agent-execution-policy/references/execution-policy.md#local-handoff-and-live-acceptance): local checks phù hợp cùng review/CI áp dụng kiểm chứng contribution. QA run, hosted delivery/indexing và owner acceptance có gate riêng; fixture/runtime-local evidence không chứng minh live acceptance. Giữ các required SSR/HTTP, metadata, visual và accessibility checks trong scope.

## Checks và bằng chứng

Review độc lập contribution Footer/typography ngày **2026-10-08**: requirement adherence và correctness/standards đạt, không có finding còn mở; đã kiểm source/tests/docs, evidence browser và tám ảnh mới. Đủ bàn giao local, giới hạn hosted/backend/model được ghi trong [tổng hợp](footer-typography-2026-10-08/verification-after.json).

Ngày **2026-10-08**, thực hiện plan Footer/typography được người dùng duyệt: Footer gồm brand, Khám phá (bốn links như header) và Liên hệ (Gửi lời nhắn/email/điện thoại), sửa accessible name logo thành Trang chủ, vùng bấm mobile tối thiểu 44 px và focus outline thống nhất. Hero giảm 32/48/56 px, Audience H2 30/36 px như Providers/contact, bốn item Audience 18/20/22 px; giữ copy các section, showcase/demo và Blog typography. Check/lint/format:check/build pass với Node **24.21.0** / pnpm **10.34.5**. Suite browser có **61/62 pass**; case anchor Telegram mẫu fail vì con trỏ hover vào Market View sau hash scroll, được tái hiện bằng DOM observer. Thay click trên link mẫu bằng native keyboard Enter để kiểm repeated anchor độc lập với hover: chạy lại **2/2 pass**, không retry, source runtime không đổi. Như vậy toàn bộ **62 cases** đã được kiểm chứng qua các lượt chạy, gồm VI/EN, JS/noJS, 375/768/1024/1440 px, short viewport, zoom 200%, axe, shared shell trên Blog và các fallback. [Lượt đầy đủ](footer-typography-2026-10-08/browser-initial.json), [anchor trước](footer-typography-2026-10-08/anchor-before.json), [anchor sau](footer-typography-2026-10-08/anchor-after.json), [ảnh Hero VI](footer-typography-2026-10-08/hero-vi-1440.png), [Audience EN mobile](footer-typography-2026-10-08/audience-en-375.png), [Footer VI mobile](footer-typography-2026-10-08/footer-vi-375.png) và [visual report](footer-typography-2026-10-08/visual-results.json). Chi tiết và giới hạn nằm trong [tổng hợp](footer-typography-2026-10-08/verification-after.json); kiểm chứng local, chưa commit/push/deploy hoặc kiểm backend thật, model không đổi.

Review độc lập lượt sửa contact/header tiếp theo ngày **2026-10-08**: requirement adherence và correctness/standards đạt, không có finding chặn. [Tổng hợp](contact-header-2026-10-08/verification-after.json) giữ kết quả 28 cases liên quan qua hai lượt chạy và giới hạn local; [review footer](contact-header-2026-10-08/footer-review.md) ghi hai đề xuất nhãn link, không sửa footer.

Ngày **2026-10-08**, theo yêu cầu tiếp theo của người dùng, phần liên hệ dùng **Start Your Journey / Contact Us** ở EN và **Bắt đầu hành trình của bạn / Liên hệ với chúng tôi** ở VI. Form bỏ tiêu đề/dòng hướng dẫn ở đầu và viền card ngoài; giữ accessible name, labels/required/validation, nền/padding và viền field. Contact chuyển thành item thứ năm trong header nav desktop/mobile; Footer giữ nguyên source/copy và được [review riêng](contact-header-2026-10-08/footer-review.md). Node **24.21.0** / pnpm **10.34.5**: check/lint/format:check/build pass. Coverage browser liên quan: **24 pass** trong lượt 28 tests; bốn failures do expectation còn đòi border 1 px và selector ảnh footer trùng footer trong demo. Sau cập nhật tests, **4/4 pass**, không retry, source không đổi giữa lượt browser. Phủ navigation/locale/contact, form validation/payload/errors/inflight/noJS/axe/zoom, shared shell VI/EN tại 1440/1024/375 px trên landing/root và Blog list/detail/error states. [Lượt đầu](contact-header-2026-10-08/browser-initial.json), [lượt sau](contact-header-2026-10-08/browser-after.json), [ảnh contact EN](contact-header-2026-10-08/contact-en-1440.png), [header VI](contact-header-2026-10-08/header-vi-1440.png) và [đo focus/footer](contact-header-2026-10-08/visual-focus.json). Ảnh contact/footer được kiểm thêm trên static built HTML với page mới, nền form và viền field giữ nguyên. Chưa commit/push/deploy/backend thật; model không đổi nên không chạy lại model tests; cảnh báo chunk lớn có sẵn vẫn còn.

Review độc lập của contribution header/navigation/điện thoại ngày **2026-10-08**: requirement adherence và correctness/standards đạt; không còn finding source/docs/visual sau khi kiểm tám ảnh. [Tổng hợp kiểm chứng](header-navigation-2026-10-08/verification-after.json) ghi rõ hai lượt browser và giới hạn local.

Ngày **2026-10-08**, thực hiện plan người dùng chốt: header có bốn link trực tiếp và Contact CTA, mobile menu phẳng, không còn roadmap placeholder; thêm `0933.80.99.36` (`tel:+84933809936`) ở contact/Footer và sửa repeated Audience anchor. Copy ngoài navigation và nhãn điện thoại được đối chiếu với Git HEAD và giữ nguyên. Node **24.21.0** / pnpm **10.34.5**: check, lint, format:check và build pass. Built Worker preview dùng fixture API local, không public origin và noindex. Suite đầy đủ có **56 pass**, hai regression Audience fail do link mẫu bị giữ lại giữa hai viewport; sửa cleanup của test rồi chạy riêng hai regression: **2/2 pass**, mỗi test phủ 1440/375 px, VI/EN. Source không đổi giữa các lượt browser; không retry. Navigation/phone được kiểm trên landing/root và Blog list/detail/404/502, JS/noJS, 1440/1024/375 px; đích header có scroll margin. [Regression trước sửa](header-navigation-2026-10-08/regression-before.json), [suite đầy đủ](header-navigation-2026-10-08/browser-full.json), [regression sau sửa](header-navigation-2026-10-08/audience-after.json), [header VI](header-navigation-2026-10-08/header-vi-1440.png) và [contact VI](header-navigation-2026-10-08/contact-vi-1440.png). Model không thay đổi nên không chạy lại model tests. Kiểm chứng local, chưa commit/push/deploy hoặc kiểm backend thật; cảnh báo chunk lớn từ trước vẫn còn.

Ngày **2026-10-08**, theo yêu cầu người dùng, foundation token landing được áp dụng tại `BaseLayout` cho mọi trang public; Blog bỏ các token chép riêng. Dashboard chưa mở quyền user access nên Header/Footer gỡ toàn bộ dashboard entry, action model và copy VI/EN tương ứng. Quy tắc được ghi trong `AGENTS.md`. Node **24.21.0** / pnpm **10.34.5**: check, lint, format:check và build pass. Chromium trên built Worker preview với public origin `https://signapse.cloud`, noindex và fixture API local: **56/56 pass**, không retry/flaky. Regression trước sửa đã fail đúng hai trường hợp: còn 2 dashboard links và menu Blog cao 38 px thay vì 44 px. Bốn tests mới trong `tests/e2e/public-shell.spec.ts` phủ VI/EN, JS/noJS, viewport 1440/1024/375 px, landing/root, Blog list/detail và 404/502; kiểm geometry, locale popup, mailto, overflow và không có dashboard entry. Review độc lập không có finding source. [Bằng chứng và ảnh sau sửa](header-layout-2026-10-08/verification-after.json). Model không thay đổi nên không chạy lại model tests. Đây là kiểm chứng local, chưa commit/push/deploy hoặc kiểm domain live; build vẫn có cảnh báo chunk trên 500 kB từ trước.

| Nhóm              | Cách kiểm chứng                                                                                                   |
| ----------------- | ----------------------------------------------------------------------------------------------------------------- |
| Toolchain         | Node 24.21.0 / pnpm 10.34.5 theo pin repository                                                                   |
| Source/config     | `pnpm check`, `pnpm lint`, `pnpm format:check`, `pnpm build`                                                      |
| Models            | `pnpm test:models`: 14 tests, 4 suites cho timeline/stream/tick/cursor và Telegram VI/EN                          |
| Browser           | `pnpm test:browser`: browser coverage Chromium trên Cloudflare Worker production preview; [kết quả](browser-results.json) |
| Blog SIGN-136     | [Handoff/evidence local](public-blog/sign-136/README.md): SSR/API fixture coverage, design captures và giới hạn xác nhận |
| Ảnh               | [capture report](preview/results.json), [capture script](capture-preview.mjs); [contact VI](preview/contact-form-vi-desktop.png) và [contact EN](preview/contact-form-en-desktop.png) được chụp từ built output ở 1440 px |
| Boundary 1024     | [Report](preview/boundary-1024.json), hai locale, bốn sticky stages                                               |
| Theme             | [OS/class dark isolation](preview/theme-isolation.json)                                                           |
| Env               | [Policy report](environment-policy.json): canonical/hreflang, indexable validation, app URLs và analytics default |
| Runtime preview   | [Smoke](final-preview-smoke.json): root/VI/EN, robots và metadata                                                 |
| Cloudflare release | [Local checks](cloudflare-release-local.json): source checks, 14 model tests, 31 browser tests production, 3 metadata tests preview và validation origins |
| Cloudflare routing | [Wrangler local](cloudflare-local-routing.json): 10 endpoint checks, URL không slash cuối và 404 thật; không phải hosted deployment |
| Cloudflare hosted | [Release 2026-10-05](cloudflare-hosted-release.json): main deploy qua GitHub Actions, Custom Domain, nội dung khớp Workers, metadata/assets và redirects; [ảnh domain thật](signapse-cloud-desktop.png) |
| Cloudflare hosted mới nhất | [Release 2026-10-07](cloudflare-hosted-release-2026-10-07.json): main `2ea7124`, nội dung VI/EN mới khớp Workers, 12 assets và redirects; CI success với 30 browser tests pass ngay, 1 pass sau retry |
| Cleanup           | [Audit](cleanup-audit.json): copy còn dùng giữ nguyên, bytes runtime assets giữ nguyên, liên kết tài liệu hợp lệ  |
| Native visibility | [Diagnostic](native-visibility.json): giới hạn của automation khi đổi tab/window                                  |

Model và browser tests assert hành vi thay vì dùng screenshot equality làm gate. Build có cảnh báo kích thước dynamic Three chunk; renderer chỉ được tải khi cần.

Blog SSR coverage dùng fixture API HTTP cục bộ qua chính server-to-API fetch path của Worker preview. Nó kiểm tra status/HTML/metadata, `no-store`, pagination và locale links trong HTML không JavaScript, renderer structured content v1, empty/missing/nonpublic/upstream/schema states, ảnh lỗi, cập nhật trạng thái khi đọc lại, navigation từ menu đến list/page/detail/locale/home, mobile overflow và axe. Browser runner tạm ghi fixture origin vào `dist/server/.dev.vars` rồi khôi phục trạng thái trước test; fixture không xác nhận producer deployment hoặc live content. Handoff cho SIGN-136 lưu thời gian chạy và evidence folder dưới Symphony evidence root khi các gate hoàn tất.

Ngày **2026-10-08**, [CI run 37751037824](https://github.com/signapse-group/signapse-landing/actions/runs/37751037824) trên `main` (`bf2dc1e`) fail ở browser step: 5 tests mong canonical `https://landing.example.test`, còn output build dùng `https://signapse.cloud`; 47 tests khác pass và deploy bị skip. Runner ghi đè metadata/indexability sau build, và Blog assertions hardcode origin mẫu. Tái hiện local trước sửa bằng `pnpm test:browser --grep 'public blog list is rendered|vi public shell' --retries=0` với env của CI: cả 2 tests fail đúng canonical mismatch. Runner đã chỉ override `PUBLIC_BLOG_API_ORIGIN` để dùng fixture; Blog metadata assertions nhận origin/indexability từ cùng env dùng build và kiểm tra canonical/hreflang vắng mặt khi không đặt public origin.

Node **24.21.0** / pnpm **10.34.5**: frozen install, check, lint, format:check, build và 14 model tests pass. Browser verification sau sửa dùng `CI=1`, built Worker preview và fixture API local; mọi lượt đều chạy `--retries=0`:

| Build metadata                          | Browser coverage                | Kết quả                 |
| --------------------------------------- | ------------------------------- | ----------------------- |
| `https://signapse.cloud`, noindex        | Toàn bộ suite                   | 52 pass, không retry    |
| `https://signapse.cloud`, indexable      | Blog list/page/detail, VI/EN, root | 6 pass, root vẫn noindex |
| Không public origin, noindex            | Cùng 6 metadata journeys        | 6 pass, không canonical/hreflang |

Hai lượt metadata tập trung chạy sau build với env tương ứng: `pnpm test:browser --grep 'public blog list is rendered|list HTML includes pagination|public blog detail renders structured|public shell, localized metadata|root is a useful' --retries=0`. File Worker vars được khôi phục về trạng thái không tồn tại sau mỗi lượt. Bằng chứng này là local; chưa push bản sửa, chạy lại hosted CI hoặc deploy.

Ngày **2026-10-07**, cập nhật placeholder tên/email/lời nhắn VI/EN theo yêu cầu người dùng. Node 24.21.0 / pnpm 10.34.5: check, lint, format:check và build pass; 8 browser tests liên quan pass, không retry, trên built preview với API mock. Phạm vi gồm labels/placeholders và giá trị ban đầu rỗng, validation/focus/axe, payload/201, no-JS email path, responsive 375/768/1024/1440 px và zoom 200%. Chạy lại bằng `pnpm test:browser --grep 'contact form exposes labels|contact form sends the producer|contact form keeps a useful|contact layout fits'`. Hai ảnh contact desktop được cập nhật; ảnh EN được chụp lại trên page mới sau khi đợi paint ổn định vì capture ngay sau vòng zoom chưa paint đủ nền/viền. Lượt này kiểm chứng local UI, không xác nhận backend thật hoặc hosted deployment.

Lượt chuẩn bị Cloudflare ngày 2026-10-05 dùng Node 24.21.0 / pnpm 10.34.5 / Wrangler 4.143.0, public origin `https://signapse.cloud` và application origin fixture `https://app.example.test`. Browser navigation vẫn intercept app; kết quả không xác nhận dev/dashboard backend. Wrangler config pin compatibility date 2026-10-03 phù hợp runtime local. Hướng dẫn release ở [deploy signapse.cloud](../deployment/signapse-cloud.md).

Hosted release ngày 2026-10-05 dùng commit `0095df9` trên `main`, application origin thực `https://dev.signapse.cloud` và noindex. [Workflow 37306184240](https://github.com/signapse-group/signapse-landing/actions/runs/37306184240) đã pass checks/build, 14 model tests và 31 browser tests trước deploy. Kiểm tra HTTP trên domain thật xác nhận HTTPS, canonical VI/EN, assets, 404, redirect slash/www/HTTP và nội dung khớp Workers. Dashboard VI mở được trong phiên Chrome đăng nhập; HTTP tự động không có session tới app trả 429. Auth/backend và các trang ứng dụng còn lại chưa được kiểm chứng.

Hosted release ngày 2026-10-07 dùng commit `2ea7124`, giữ app origin dev và noindex. [Workflow 37591390406](https://github.com/signapse-group/signapse-landing/actions/runs/37591390406) kết thúc success: source checks/build, 14 model tests, 30 browser tests pass ngay và 1 test reset Graph/Telegram pass sau retry. Kiểm tra sau deploy xác nhận nội dung welcome mới trong VI/EN, output khớp Workers, 12 assets, 404 và 5 redirects. Lỗi assertion trạng thái `incoming` ở lần chạy đầu được ghi trong report; chưa kết luận nguyên nhân. Lượt này không kiểm lại auth/backend ứng dụng.

## Ma trận browser

| Surface/hành vi     | Điều kiện kiểm tra                                                                                                   |
| ------------------- | -------------------------------------------------------------------------------------------------------------------- |
| VI/EN responsive    | 1440×900, 768×1024, 375×800, 1440×620; bốn demo đọc được, không horizontal overflow                                  |
| Boundary desktop    | 1024×768, hai locale; sticky stages và hai Telegram panels                                                           |
| Root/routing        | Landing VI, noindex; locale switch giữ query/hash; unsupported `/fr` 404                                             |
| Desktop navigation  | Năm item trực tiếp, keyboard Enter và đích không bị header che; locale disclosure Escape/focus restore/outside click |
| Mobile navigation   | Native details Enter/touch, menu phẳng, chọn anchor/close và viewport containment                                    |
| Locale/URL          | VI↔EN, encoded query, lang/hreflang, supported hashes; hash ngoài contract bị bỏ; không locale cookie                |
| Capability          | Năm popover, Enter/Space/Escape/focus restore, touch toggle, deep links/repeated anchors, noJS native details        |
| Public shell/contact | Header controls cùng token/geometry trên landing và Blog list/detail/error states, VI/EN, desktop/mobile, có/không JS; không có dashboard entry; Hero `#access`, mailto và phone link ở contact/footer |
| Form liên hệ        | VI/EN labels/placeholders đúng locale và giá trị ban đầu rỗng; validation, JSON body/locale, 201 rỗng, 400/413/415/429/500, network/body failure, duplicate submit, no-JS và responsive; API mock nằm ở consumer boundary |
| Showcase            | Scroll hai hướng, ArrowUp/Down/Home/End, buttons/focus, progress theo playback                                       |
| Graph               | Ingestion/relationship phases, final inspector, animated incoming/restart và model order                             |
| Chart               | Tick 500 ms, annotation trước outcome, final frame, nút đóng event detail                                            |
| AI                  | Typing/submission/thinking/streaming, follow-up/scenario/complete, composer và static transcript                     |
| Telegram            | Asset/time/language/menu/cursor/analysis/sending/delivered; restart, VI/EN output độc lập locale trang, mobile/short |
| Lifecycle           | Pause khi inactive/offscreen/tab hidden; re-entry/reset policies; controlled visibilitychange pause/resume           |
| Hero/Audience       | Keyboard/pointer interaction, bốn Audience choices, repeated anchor khôi phục selection, SVG/WebGL ready/fallback, reduced idle |
| Fallback            | JavaScript tắt, WebGL blocked, thiếu IntersectionObserver: HTML/proofs/navigation và natural flow                    |
| Accessibility/theme | Axe VI/EN và bốn demo, reduced motion, skip link, CSS zoom 200%, OS/class dark palette                               |
| Runtime errors      | Không pageerror, console error, hydration mismatch, font/asset HTTP failure trong các browser journeys               |

## Tái tạo bằng chứng

```powershell
pnpm check
pnpm lint
pnpm format:check
pnpm build
pnpm test
```

Playwright tự mở production preview khi chưa có server. Các test blog khởi chạy fixture HTTP API tự động; `pnpm preview` dùng Cloudflare Worker SSR. Để chụp ảnh landing, mở preview trong terminal riêng rồi chạy:

```powershell
pnpm preview --host 127.0.0.1 --port 4321
node docs/verification/capture-preview.mjs http://127.0.0.1:4321
```

Script chỉ dùng source/dependencies của repo này và một origin landing. Ảnh chụp ở reduced-motion final state, lỗi browser/HTTP và overflow được ghi vào report. Cập nhật ảnh/report khi contract hoặc giao diện thay đổi.

Trace/HTML report nằm trong ignored `test-results/`; chạy `pnpm exec playwright show-report test-results/report` để xem lần mới nhất. JSON trong thư mục này là bằng chứng được lưu; attachment paths bên trong browser report có thể trỏ tới artifact ignored đã được thay thế ở lần chạy sau.

- [VI Hero](preview/vi-desktop-hero.png), [EN Hero](preview/en-desktop-hero.png).
- [Graph](preview/en-desktop-knowledge-graph.png), [Chart](preview/en-desktop-market-chart.png), [AI](preview/en-desktop-ai-conversation.png), [Telegram](preview/en-desktop-scheduled-telegram.png).
- [Contact form VI](preview/contact-form-vi-desktop.png), [Contact form EN](preview/contact-form-en-desktop.png) (`#access`, 1440 px).
- [Mobile](preview/vi-mobile-full.png), [noJS](preview/en-nojs-full.png).

## Giới hạn kiểm chứng

Pause/resume được assert qua controlled `visibilitychange` trong Chromium. Diagnostic Edge headed vẫn thấy document `visible` khi đổi tab/window, nên không chứng minh native hidden-tab hoặc GPU throttling vật lý. CSS zoom và mobile emulation không đại diện mọi thiết bị.

Navigation tests kiểm Blog/locale/contact và sự vắng mặt của dashboard entry; không kiểm auth/backend/Articles của ứng dụng sản phẩm. Contact form tests intercept API tại consumer boundary; chúng không thay thế OpenAPI/CORS check hoặc xác nhận record trên producer. `PUBLIC_CONTACT_API_ORIGIN` phải là origin HTTPS riêng với `PUBLIC_APP_ORIGIN`, và landing origin thực phải nằm trong CORS policy của producer. Analytics ingestion, request-language negotiation, domain redirects, hosted CI và deployment cần kiểm trên hosting thực tế.
