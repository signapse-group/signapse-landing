import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { en } from '../../src/i18n/messages.ts';
import {
  KNOWLEDGE_GRAPH_DEMO_DURATION,
  KNOWLEDGE_GRAPH_DEMO_FINAL_FRAME,
  getKnowledgeGraphDemoFrame,
} from '../../src/components/landing/landing-knowledge-graph-demo-model.ts';
import {
  MARKET_CHART_DEMO_DURATION,
  MARKET_CHART_DEMO_FINAL_FRAME,
  MARKET_CHART_TICK_INTERVAL,
  getMarketChartDemoFrame,
  getMarketChartOutcomeCount,
  getMarketChartTickTime,
} from '../../src/components/landing/landing-market-chart-demo-model.ts';
import {
  AI_CONVERSATION_DEMO_DURATION,
  AI_CONVERSATION_DEMO_FINAL_FRAME,
  AI_CONVERSATION_DEMO_TIMING as aiTiming,
  getAiConversationDemoFrame,
  getAiConversationFollowUpStream,
  getAiConversationPresentation,
  getAiConversationPromptText,
  getAiConversationResponseStream,
  getAiConversationTypedText,
} from '../../src/components/landing/landing-ai-conversation-demo-model.ts';
import {
  TELEGRAM_DEMO_DURATION,
  TELEGRAM_DEMO_FINAL_FRAME,
  TELEGRAM_DEMO_TIMING as telegramTiming,
  getTelegramDemoCursor,
  getTelegramDemoFrame,
  getTelegramDemoMessage,
} from '../../src/components/landing/landing-scheduled-telegram-demo-model.ts';

describe('Knowledge Graph timeline', () => {
  it('links ingested evidence before inspecting the new entities', () => {
    assert.equal(getKnowledgeGraphDemoFrame(7).phase, 'resolving');
    assert.equal(getKnowledgeGraphDemoFrame(8.5).phase, 'linking');
    assert.equal(getKnowledgeGraphDemoFrame(11).phase, 'graphUpdated');
    assert.equal(getKnowledgeGraphDemoFrame(12.5).phase, 'inspectNarrative');
    assert.equal(getKnowledgeGraphDemoFrame(16).phase, 'inspectEvent');
    assert.equal(getKnowledgeGraphDemoFrame(19.5).phase, 'inspectNews');
  });

  it('retains a stable final inspector and resets to its first frame', () => {
    assert.equal(
      getKnowledgeGraphDemoFrame(KNOWLEDGE_GRAPH_DEMO_DURATION + 10),
      KNOWLEDGE_GRAPH_DEMO_FINAL_FRAME,
    );
    assert.equal(getKnowledgeGraphDemoFrame(0).phase, 'start');
  });
});

describe('Market Chart timeline', () => {
  it('shows the annotation before revealing its price outcome', () => {
    assert.equal(getMarketChartDemoFrame(10).phase, 'annotationReady');
    assert.equal(getMarketChartDemoFrame(14).phase, 'detailOpen');
    assert.equal(getMarketChartOutcomeCount(18.99), 0);
    assert.equal(getMarketChartOutcomeCount(19), 1);
    assert.equal(getMarketChartOutcomeCount(21), 2);
    assert.equal(getMarketChartOutcomeCount(24), 3);
    assert.equal(
      getMarketChartDemoFrame(MARKET_CHART_DEMO_DURATION),
      MARKET_CHART_DEMO_FINAL_FRAME,
    );
  });

  it('holds each simulated market price for a 500ms tick', () => {
    assert.equal(MARKET_CHART_TICK_INTERVAL, 0.5);
    assert.equal(getMarketChartTickTime(0.49), 0);
    assert.equal(getMarketChartTickTime(0.5), 0.5);
    assert.equal(getMarketChartTickTime(0.99), 0.5);
    assert.equal(getMarketChartTickTime(1), 1);
  });
});

describe('AI Conversation timeline', () => {
  it('runs two complete question and answer rounds', () => {
    assert.deepEqual(
      [0, 2.8, 5.5, 10.5, 12.6, 14.5, 17, 19.5, 23.5, 27].map(
        (time) => getAiConversationDemoFrame(time).phase,
      ),
      [
        'welcome',
        'typing',
        'context',
        'answer',
        'evidence',
        'followUpTyping',
        'followUpThinking',
        'followUpAnswer',
        'scenarios',
        'complete',
      ],
    );
    assert.equal(
      getAiConversationDemoFrame(AI_CONVERSATION_DEMO_DURATION + 10),
      AI_CONVERSATION_DEMO_FINAL_FRAME,
    );
  });

  it('types the first prompt and moves the cursor before submitting', () => {
    const prompt = 'Why has XAUUSD risen recently?';
    assert.equal(getAiConversationPromptText(prompt, 1), '');
    const partial = getAiConversationPromptText(
      prompt,
      (aiTiming.typing + aiTiming.submitted) / 2,
    );
    assert.ok(partial.length > 0 && partial.length < prompt.length);
    assert.equal(
      getAiConversationPromptText(prompt, aiTiming.submitted),
      prompt,
    );
    assert.ok(aiTiming.cursorClick < aiTiming.submitted);
  });

  it('hands off from thinking to a streaming response before evidence', () => {
    const thinking = getAiConversationPresentation(aiTiming.submitted);
    assert.equal(thinking.showThinking, true);
    assert.equal(thinking.showResponse, false);
    const answering = getAiConversationPresentation(aiTiming.answer);
    assert.equal(answering.showThinking, false);
    assert.equal(answering.showResponse, true);
    assert.equal(answering.isStreaming, true);
    assert.equal(
      getAiConversationPresentation(aiTiming.evidence).isStreaming,
      false,
    );
  });

  it('types and submits the second question before the follow-up answer', () => {
    const prompt = 'What are the next scenarios?';
    const partial = getAiConversationTypedText(
      prompt,
      (aiTiming.followUpTyping + aiTiming.followUpSubmitted) / 2,
      aiTiming.followUpTyping,
      aiTiming.followUpSubmitted,
    );
    assert.ok(partial.length > 0 && partial.length < prompt.length);
    const submitted = getAiConversationPresentation(aiTiming.followUpSubmitted);
    assert.equal(submitted.showFollowUpUser, true);
    assert.equal(submitted.showFollowUpThinking, true);
    assert.equal(submitted.showFollowUpResponse, false);
    const answering = getAiConversationPresentation(aiTiming.followUpAnswer);
    assert.equal(answering.showFollowUpThinking, false);
    assert.equal(answering.showFollowUpResponse, true);
    assert.equal(answering.isFollowUpStreaming, true);
  });

  for (const [name, getStream, start, end] of [
    [
      'first',
      getAiConversationResponseStream,
      aiTiming.answer,
      aiTiming.evidence,
    ],
    [
      'follow-up',
      getAiConversationFollowUpStream,
      aiTiming.followUpAnswer,
      aiTiming.scenarios,
    ],
  ]) {
    it(`streams the ${name} response fully before displaying supporting details`, () => {
      const heading = 'Market conclusion';
      const body = 'Watch the range boundaries and verify the sources.';
      const midway = getStream(heading, body, (start + end) / 2);
      const length = midway.heading.length + midway.body.length;
      assert.ok(length > 0 && length < heading.length + body.length);
      assert.deepEqual(getStream(heading, body, end), { heading, body });
    });
  }
});

describe('Scheduled Telegram timeline', () => {
  it('configures the schedule, builds the analysis, then delivers it', () => {
    assert.deepEqual(
      [
        0, 1.1, 1.7, 2.4, 2.9, 3.6, 4.1, 4.95, 5.2, 5.5, 5.9, 6.3, 6.7, 7.1,
        7.9, 9.6, 10.6, 12.3,
      ].map((time) => getTelegramDemoFrame(time).phase),
      [
        'start',
        'assetOpen',
        'assetSelected',
        'timeOpen',
        'timeSelected',
        'languageOpen',
        'languageSelected',
        'submit',
        'scheduled',
        'collecting',
        'priceReady',
        'technicalReady',
        'contextReady',
        'normalizing',
        'reasoning',
        'composing',
        'sending',
        'delivered',
      ],
    );
    assert.equal(
      getTelegramDemoFrame(TELEGRAM_DEMO_DURATION),
      TELEGRAM_DEMO_FINAL_FRAME,
    );
    assert.ok(TELEGRAM_DEMO_DURATION - telegramTiming.delivered >= 7);
  });

  it('points to the selected options and presses the submit button', () => {
    const initial = getTelegramDemoCursor(0);
    assert.equal(initial.from, 'center');
    assert.equal(initial.to, 'center');
    for (const [time, target] of [
      [1.65, 'asset-option'],
      [2.85, 'time-option'],
      [4.05, 'language-option'],
    ]) {
      const cursor = getTelegramDemoCursor(time);
      assert.equal(cursor.from, target);
      assert.equal(cursor.to, target);
      assert.equal(cursor.opacity, 1);
    }
    const click = getTelegramDemoCursor(5);
    assert.equal(click.from, 'submit');
    assert.equal(click.to, 'submit');
    assert.ok(Math.abs(click.scale - 0.88) < 0.001);
  });

  it('keeps cursor interpolation bounded and final frames stable', () => {
    for (let time = 0; time <= TELEGRAM_DEMO_DURATION; time += 0.025) {
      const cursor = getTelegramDemoCursor(time);
      assert.ok(cursor.progress >= 0 && cursor.progress <= 1);
      assert.ok(cursor.scale >= 0.879 && cursor.scale <= 1.001);
    }
    assert.equal(getTelegramDemoFrame(12.3), getTelegramDemoFrame(19.9));
  });

  it('uses the analysis output language independently of the page locale', () => {
    const message = getTelegramDemoMessage(en.landing.showcase.telegram, {
      asset: 'XAU/USD',
      sendTime: '08:00',
      outputLanguage: 'vi',
    });
    assert.equal(message.title, '📊 XAUUSD · 16/09/2026 08:00');
    assert.ok(message.horizon.includes('THIÊN HƯỚNG: TĂNG'));
    assert.ok(message.scenario.includes('BUY PULLBACK'));
    assert.ok(message.risk.includes('breakout 3.705'));
    assert.ok(message.meta.includes('Tiếng Việt'));
  });
});
