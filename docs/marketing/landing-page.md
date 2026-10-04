# Signapse Landing Page Content

- Loại tài liệu: Product / Marketing copy
- Độc giả chính: Product, design, frontend, stakeholder
- Dựa trên: `../../../signapse-planing/docs/product/product-thesis.md`, `../../../signapse-planing/docs/non-dev/project-overview.md`, `../../../signapse-planing/docs/non-dev/features.md`, `../../../signapse-planing/docs/non-dev/ai-behavior.md`, `../../../signapse-planing/docs/non-dev/data-sources.md`, `../../../signapse-planing/docs/design/system-design.md`, `../../../signapse-planing/docs/design/market-chart-event-overlay.md`, `../../../signapse-planing/docs/design/market-query-conversation.md`, `../../../signapse-planing/docs/design/graph-view.md`, `../../../signapse-planing/docs/reference/market-chart-api-contract.md`, `../../../signapse-planing/docs/reference/graph-view-api-contract.md`
- Không phải là: API contract, implementation spec, hay cam kết lợi nhuận hoặc dự báo chắc chắn

## Working Assumption

Landing page là public marketing entry cho Signapse, không phải dashboard nội bộ.

Recommended defaults:

- Route: `/{lang}`
- Primary CTA: `Request access`
- Secondary CTA: `Sign in`
- Authenticated CTA: `Open dashboard`
- Primary audience: trader, analyst, research team, hoặc market-focused power users
- Secondary audience: product/operator/admin cần vận hành source, ingest, prompt, permission
- Visual direction: nếu dashboard thật chưa đủ polished hoặc có dữ liệu nhạy cảm, dùng mock visual product-accurate bằng CSS/canvas thay vì stock image

## Positioning V2

Signapse là một AI Market Intelligence Workspace giúp người dùng hiểu thị trường qua ba bề mặt chính:

```text
Chart annotation
-> nhìn event trên trục thời gian và giá

Market query
-> hỏi thị trường bằng ngôn ngữ tự nhiên trong scope watchlist

Knowledge graph
-> khám phá quan hệ giữa event, asset, theme, narrative và evidence
```

Thông điệp lõi:

```text
Raw market signals
-> structured knowledge
-> personalized market intelligence
```

Signapse không nên được định vị như AI trading bot tự đặt lệnh, dịch vụ bán tín hiệu chắc thắng, hoặc prediction engine. Giá trị của sản phẩm là giúp trader và analyst hiểu điều gì đang xảy ra, tài sản nào bị ảnh hưởng, bằng chứng nằm ở đâu, narrative nào đang được thị trường định giá, và có thể nhận grounded trading guidance từ context hiện có.

## Main-page Trading Guidance Policy

Frontend hiển thị warning này rõ ràng trên main page. Đây là static product copy; không cần backend field, config hoặc persisted acceptance, và không lặp lại trong từng Market Query answer.

### English

> Trading guidance is generated from available market context and may be incomplete, stale, or wrong. Outcomes are not guaranteed. You are responsible for your decisions, and Signapse does not execute trades for you.

### Vietnamese

> Gợi ý giao dịch được tổng hợp từ bối cảnh thị trường hiện có và có thể thiếu, trễ hoặc sai. Không có kết quả nào được đảm bảo. Bạn tự chịu trách nhiệm cho quyết định của mình và Signapse không thực hiện lệnh thay bạn.

## Hero

### Eyebrow

AI Market Intelligence Workspace

### H1

Understand market moves through events, reactions, and narratives.

### H1 - Vietnamese Option

Hiểu biến động thị trường qua event, reaction và narrative.

### Body

Signapse connects news, economic calendar, market candles, asset watchlists, and AI reasoning into one market intelligence workspace. See events on charts, explore market relationships through a knowledge graph, and ask scoped questions grounded in evidence from your own workspace.

### Body - Vietnamese Option

Signapse kết nối tin tức, lịch kinh tế, candle thị trường, watchlist tài sản và AI reasoning vào một workspace phân tích thị trường. Bạn có thể nhìn event trực tiếp trên chart, khám phá quan hệ thị trường bằng knowledge graph, và hỏi AI trong đúng phạm vi tài sản mình đang theo dõi.

### Primary CTA

Request access

### Secondary CTA

Sign in

## Hero Visual Direction

Hero visual nên cho người đọc thấy Signapse là một workspace thật, không phải trang AI chung chung.

Suggested composition:

```text
Left rail
  -> Workspace + watchlist

Main panel
  -> XAU/USD chart
  -> candle move
  -> event annotation marker
  -> popup: event, direction, confidence, evidence

Right panel
  -> Market Query answer
  -> key events
  -> limitations
  -> evidence button

Bottom / side mini-map
  -> Knowledge graph: Event -> Asset -> Theme -> Narrative -> Evidence
```

Avoid:

- stock finance photos
- abstract AI gradients as the primary visual
- fake or ungrounded trading signals and levels, or guaranteed prediction UI

## Problem Section

### Heading

Market data is everywhere. Market context is scattered.

### Vietnamese Heading

Dữ liệu thị trường ở khắp nơi. Bối cảnh thị trường lại bị phân mảnh.

### Body

News arrives continuously. Economic releases change expectations. Price reacts before the full story is clear. Evidence sits across articles, calendar data, charts, and analyst notes. Generic AI can summarize headlines, but it cannot reliably explain your market unless it is grounded in structured events, asset relationships, and your workspace scope.

### Vietnamese Body

Tin tức đến liên tục. Lịch kinh tế làm thay đổi kỳ vọng. Giá phản ứng trước khi câu chuyện trở nên rõ ràng. Bằng chứng nằm rải rác trong bài viết, dữ liệu calendar, chart và các lớp phân tích. AI chung chung có thể tóm tắt headline, nhưng khó giải thích thị trường đáng tin cậy nếu không được grounding vào event, asset relation và scope của workspace.

## Core Thesis Section

### Heading

From raw signals to structured market intelligence.

### Vietnamese Heading

Từ tín hiệu rời rạc đến market intelligence có cấu trúc.

### Body

Signapse turns market inputs into a shared intelligence layer:

```text
News / RSS
Economic calendar
Market candles
Asset catalog
Workspace watchlist
    ->
Event
Reaction
Narrative
Evidence
    ->
Chart annotation
Market query
Knowledge graph
```

The core reasoning model is:

```text
Event -> Reaction -> Narrative
```

An event explains what happened. A reaction explains how the market responded. A narrative explains the broader story the market may be pricing over time.

### Vietnamese Body

Signapse biến các nguồn tín hiệu thị trường thành một lớp intelligence dùng chung:

```text
Tin tức / RSS
Economic calendar
Market candles
Asset catalog
Workspace watchlist
    ->
Event
Reaction
Narrative
Evidence
    ->
Chart annotation
Market query
Knowledge graph
```

Mô hình reasoning cốt lõi là:

```text
Event -> Reaction -> Narrative
```

Event cho biết điều gì đã xảy ra. Reaction cho biết thị trường phản ứng ra sao. Narrative cho biết câu chuyện rộng hơn mà thị trường có thể đang định giá theo thời gian.

## Product Pillars

### 1. Chart Annotation

#### One-line

See why a move happened, not just that it happened.

#### Vietnamese One-line

Nhìn nguyên nhân phía sau biến động giá, không chỉ nhìn cây nến.

#### Description

Signapse overlays market events directly onto asset charts. A marker is not just a label. It links a price move to event timing, affected asset, reaction direction, confidence, reasoning, and supporting evidence.

For a trader watching Gold, this means a sharp XAU/USD candle can be read together with the CPI release, Fed repricing, USD reaction, or news evidence that explains why the move mattered.

#### Vietnamese Description

Signapse đặt event marker trực tiếp lên chart của từng asset. Marker không chỉ là một nhãn trên biểu đồ. Nó liên kết biến động giá với thời điểm event, tài sản bị ảnh hưởng, reaction direction, confidence, reasoning và evidence hỗ trợ.

Với người đang theo dõi Gold, một cây nến mạnh trên XAU/USD có thể được đọc cùng CPI release, Fed repricing, USD reaction hoặc nguồn tin giải thích vì sao biến động đó quan trọng.

#### Current Runtime

- Historical chart endpoint: `GET /market-charts/candles`
- Chart annotation endpoint: `GET /market-charts/annotations`
- Live market stream endpoint: `GET /market-charts/live`
- Candle request theo `assetId`, timeframe, `from`, `to`
- Historical candles qua configured provider
- Annotation derive từ `Event`, `EventAsset`, `MarketReaction`, và linked news evidence
- Annotation popup có đủ dữ liệu cho title, marker time, direction, confidence, reaction reasoning, evidence và event detail link

#### In Scope / Target Direction

- Dashboard chart bắt đầu từ workspace watchlist
- Provider-symbol mapping đầy đủ hơn
- Persisted candle/tick/quote storage
- Severity tốt hơn dựa trên confidence, reaction clarity hoặc realized move
- Frontend chart interaction với marker popup, evidence link và event drill-down

#### Do Not Claim

- Không claim Chart Annotation tự tạo trade signal, entry, stop loss, take profit hoặc price target
- Không claim backtesting hoặc realized return calculation
- Không claim user-created drawing tools
- Không claim prediction engine

### 2. Market Query

#### One-line

Ask market questions inside your own asset scope.

#### Vietnamese One-line

Hỏi thị trường trong đúng phạm vi tài sản bạn đang theo dõi.

#### Description

Market Query is not a generic chatbot. It uses the caller's current workspace and watchlist as the evidence boundary, then builds an answer from structured events, linked evidence, reactions, narratives, and limitations.

When the question is broad, Signapse keeps retrieval inside the workspace asset scope. When the question mentions an out-of-scope asset, Signapse should say so instead of pulling unrelated global evidence.

When requested, the final responder may synthesize grounded buy/sell/hold recommendations and entry, exit, stop-loss, take-profit, leverage, position-sizing, risk/reward, or capital-allocation considerations. Source-backed observations, model judgment, assumptions, data limitations, and downside risk must remain distinguishable.

#### Vietnamese Description

Market Query không phải chatbot hỏi đáp chung chung. Nó dùng current workspace và watchlist làm ranh giới evidence, rồi tổng hợp câu trả lời từ event, evidence, reaction, narrative và limitation.

Khi câu hỏi rộng, Signapse vẫn giữ retrieval trong scope tài sản của workspace. Khi câu hỏi nhắc đến asset ngoài scope, Signapse cần nói rõ giới hạn thay vì lấy global evidence không liên quan.

Khi được yêu cầu, final responder có thể tổng hợp grounded buy/sell/hold recommendation và các consideration về entry, exit, stop loss, take profit, leverage, position sizing, risk/reward hoặc capital allocation. Source-backed observation, model judgment, assumption, data limitation và downside risk phải được phân biệt rõ.

#### Current Runtime

- Conversation-backed query APIs: `POST /market-conversations`, `POST /market-conversations/{id}/messages`
- Backend resolve current workspace
- Workspace assets là evidence scope
- Free-form question input
- Intent understanding cho các kiểu câu như why move, what changed, what matters
- Retrieval từ enriched events, linked evidence, reactions và narratives khi có
- Structured response gồm answer, reasoning chain, key events, key narratives, assets considered, confidence và limitations
- Sparse evidence hoặc out-of-scope asset phải được phản ánh trong limitations

#### In Scope / Target Direction

- Market conversation thay vì chỉ one-shot query
- Conversation history trong workspace
- Assistant analysis message
- Persisted market analysis artifact
- Evidence snapshot ổn định cho từng câu trả lời
- Evidence quick view / drawer
- Lifecycle streaming bằng SSE cho trạng thái xử lý
- Manual Telegram send cho bản analysis đã lưu, không regenerate AI output khi gửi

#### Do Not Claim

- Không claim autonomous multi-agent research
- Không claim luôn trả lời được mọi câu hỏi toàn thị trường
- Không claim AI biết dữ liệu ngoài evidence scope
- Không claim Signapse đặt lệnh hoặc thao tác tài khoản thay người dùng
- Không claim gợi ý giao dịch hoặc kết quả chắc chắn

### 3. Knowledge Graph

#### One-line

Map the market as relationships, not headlines.

#### Vietnamese One-line

Xem thị trường như một mạng quan hệ, không phải một danh sách headline.

#### Description

Knowledge Graph helps users browse the shared market intelligence layer through their workspace watchlist. Instead of reading isolated articles, users can see how events connect to assets, themes, narratives, and source evidence.

The graph is a workspace-focused slice of shared knowledge. Workspace and watchlist decide what appears first, but the event, asset, theme, narrative, evidence, node identity, and relation semantics remain shared.

#### Vietnamese Description

Knowledge Graph giúp người dùng browse lớp market intelligence dùng chung qua watchlist của workspace. Thay vì đọc từng bài viết riêng lẻ, user có thể nhìn thấy event nào liên kết với asset nào, theme nào liên quan, narrative nào đang được củng cố, và evidence nào hỗ trợ event đó.

Graph là một lát cắt được focus bởi workspace, không phải bản sao tri thức riêng của từng user. Workspace và watchlist quyết định phần nào xuất hiện trước, còn event, asset, theme, narrative, evidence, node identity và relation semantics vẫn là shared knowledge.

#### Current Runtime

- Dedicated endpoint: `GET /graph-view`
- Backend resolve current workspace
- Watchlist assets select graph slice
- Empty watchlist returns empty graph, not global fallback
- Runtime graph includes event, asset, theme, news-article và narrative nodes
- Runtime edges include event-asset, event-theme, news-article-event, narrative-event và narrative-asset
- Backend returns semantic nodes and edges, not layout coordinates
- Frontend owns graph layout, zoom, pan, node style và interaction

#### In Scope / Target Direction

- Product visual surface cho graph exploration
- Click-through từ graph node sang event, asset, news/evidence hoặc narrative detail
- Better readability treatment cho confidence, relation strength và evidence role
- Graph as a companion to query and chart, not replacement for either

#### Do Not Claim

- Không claim graph database chuyên dụng
- Không claim global infinite graph explorer
- Không claim query-specific answer graph
- Không claim graph editing hoặc collaborative annotation
- Không claim market-reaction node nếu contract hiện tại chưa hỗ trợ

## Feature Status Matrix

| Capability | Current Runtime | In Scope / Target | Landing Wording |
| --- | --- | --- | --- |
| Workspace & Watchlist | Có | Tiếp tục là personalization lens | Personal workspace for the assets you care about |
| News & Event Intelligence | Có | NewsArticle và EventNewsArticleEvidence là naming/runtime contract hiện tại | Turn scattered news into structured market events |
| Economic Calendar | Có | Alert/assessment tùy feature runtime | Track macro releases that shift expectations |
| Market Chart Candles | Có historical và live stream | Persisted storage/provider mapping deferred | Read price action together with market context |
| Chart Annotation | Có annotation derive runtime | Popup/FE treatment và workspace dashboard polish | Event markers explain moves with reaction and evidence |
| Market Query | Conversation-backed analysis | Evidence drawer, streaming, saved analysis | Ask scoped questions and receive grounded market or trading guidance |
| Knowledge Graph | Có `GET /graph-view` | Visual exploration polish | Browse event, asset, theme, narrative and evidence relationships |
| Telegram | Có khi bot/destination/routing được cấu hình | Manual analysis delivery target | Send or receive analysis when Telegram is configured |

## Suggested Landing Structure

### 1. Hero

Lead with the core promise:

> Understand market moves through events, reactions, and narratives.

Hero visual should show a real product-like workspace:

- watchlist
- chart annotation
- market query answer
- evidence button
- mini knowledge graph

### 2. Three Product Pillars

Use three prominent sections instead of small feature cards:

```text
Chart Annotation
time + price + explanation

Market Query
question + scoped evidence + reasoning

Knowledge Graph
relationships + narratives + provenance
```

### 3. Data Pipeline

Explain why Signapse answers are not generic:

```text
News / RSS
Economic calendar
Market candles
Asset catalog
    ->
Event intelligence
Market reactions
Narratives
Evidence
    ->
Personalized workspace surfaces
```

### 4. Workspace Personalization

Explain `Knowledge = Shared, Experience = Personal`.

Copy:

> Signapse keeps market knowledge shared, but personalizes the experience through your workspace and watchlist. A Macro FX workspace and a Crypto workspace can ask similar questions and receive different context because the evidence boundary is different.

Vietnamese:

> Signapse giữ market knowledge là lớp dùng chung, nhưng cá nhân hóa trải nghiệm bằng workspace và watchlist. Một workspace Macro FX và một workspace Crypto có thể hỏi câu giống nhau nhưng nhận bối cảnh khác nhau vì evidence boundary khác nhau.

### 5. Trust Section

Copy:

> Grounded guidance, not guaranteed outcomes.
>
> Signapse can synthesize market and trading guidance from available evidence. It does not place trades, guarantee forecasts, or replace source verification and user judgment.

Vietnamese:

> Grounded guidance, không cam kết kết quả.
>
> Signapse có thể tổng hợp market và trading guidance từ evidence hiện có. Sản phẩm không đặt lệnh, không cam kết dự báo, và không thay thế việc kiểm chứng nguồn tin hoặc quyết định của người dùng.

## Alternate Hero Options

### Option A

Understand what moved the market, with evidence on the chart and context in the graph.

Vietnamese:

Hiểu điều gì làm thị trường biến động, với evidence trên chart và bối cảnh trong graph.

### Option B

An AI-native workspace for reading events, reactions, and market narratives.

Vietnamese:

Một AI-native workspace để đọc event, reaction và narrative của thị trường.

### Option C

From headline noise to market intelligence you can inspect.

Vietnamese:

Từ nhiễu headline đến market intelligence có thể kiểm chứng.

## Short Tagline Options

1. Event-aware market intelligence for your watchlist.
2. Chart context, scoped AI answers, and a market knowledge graph.
3. Understand market moves through evidence, not guesses.
4. Market intelligence có bằng chứng, cá nhân hóa theo watchlist.
5. Hiểu event, reaction và narrative phía sau biến động thị trường.
