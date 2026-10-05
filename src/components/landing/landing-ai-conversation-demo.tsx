import { useEffect, useRef, useState, type RefObject } from 'react';
import { animate } from 'motion/react';

import type { Dictionary } from '@/i18n/messages';
import {
  AI_CONVERSATION_DEMO_DURATION,
  AI_CONVERSATION_DEMO_FINAL_FRAME,
  getAiConversationDemoFrame,
} from './landing-ai-conversation-demo-model';
import { LandingAiConversationWindow } from './landing-ai-conversation-window';
import { useLandingPlayback } from './landing-playback';

type Labels = Dictionary['landing']['showcase']['aiConversation'];

export function LandingAiConversationDemo({
  active,
  labels,
  progressRef,
}: {
  active: boolean;
  labels: Labels;
  progressRef: RefObject<SVGRectElement | null>;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const elapsedRef = useRef(0);
  const {
    canPlay,
    reducedMotion: prefersReducedMotion,
    inView,
  } = useLandingPlayback(rootRef, active);
  const [frame, setFrame] = useState(AI_CONVERSATION_DEMO_FINAL_FRAME);
  const [seconds, setSeconds] = useState(AI_CONVERSATION_DEMO_DURATION);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (!canPlay) {
      if (!active || !inView || prefersReducedMotion) elapsedRef.current = 0;
      return;
    }

    let previous = AI_CONVERSATION_DEMO_FINAL_FRAME;
    const from = elapsedRef.current;
    const playback = animate(from, AI_CONVERSATION_DEMO_DURATION, {
      duration: AI_CONVERSATION_DEMO_DURATION - from,
      ease: 'linear',
      onUpdate: (seconds) => {
        elapsedRef.current = seconds;
        setSeconds(Math.round(seconds * 20) / 20);
        const next = getAiConversationDemoFrame(seconds);
        if (next !== previous) {
          previous = next;
          setFrame(next);
        }
        if (progressRef.current) {
          progressRef.current.style.strokeDashoffset = String(
            (100 * seconds) / AI_CONVERSATION_DEMO_DURATION,
          );
        }
      },
      onComplete: () => {
        elapsedRef.current = 0;
        setCycle((value) => value + 1);
      },
    });

    return () => playback.stop();
  }, [active, canPlay, cycle, inView, prefersReducedMotion, progressRef]);

  const visibleFrame = prefersReducedMotion
    ? AI_CONVERSATION_DEMO_FINAL_FRAME
    : frame;
  const visibleSeconds = prefersReducedMotion
    ? AI_CONVERSATION_DEMO_DURATION
    : seconds;

  useEffect(() => {
    const transcript = transcriptRef.current;
    if (!active || !transcript || (!canPlay && !prefersReducedMotion)) return;

    const animationFrame = window.requestAnimationFrame(() => {
      if (
        visibleFrame.phase === 'welcome' ||
        visibleFrame.phase === 'typing' ||
        visibleFrame.phase === 'submitted'
      ) {
        transcript.scrollTo({ top: 0, behavior: 'auto' });
        return;
      }

      transcript.scrollTo({
        top: transcript.scrollHeight,
        behavior:
          prefersReducedMotion || visibleFrame.phase === 'answer'
            ? 'auto'
            : 'smooth',
      });
    });
    return () => window.cancelAnimationFrame(animationFrame);
  }, [
    active,
    canPlay,
    prefersReducedMotion,
    visibleFrame.phase,
    visibleSeconds,
  ]);

  return (
    <div
      ref={rootRef}
      data-demo-mode="automatic"
      data-demo-renderer="motion"
      data-demo-running={canPlay}
      data-ai-conversation-demo
      data-ai-conversation-playback={
        prefersReducedMotion ? 'complete' : canPlay ? 'autoplay' : 'paused'
      }
      data-ai-conversation-state={visibleFrame.phase}
      role="group"
      aria-label={labels.stageLabel}
    >
      <LandingAiConversationWindow
        labels={labels}
        frame={visibleFrame}
        seconds={visibleSeconds}
        animated
        transcriptRef={transcriptRef}
      />
    </div>
  );
}
