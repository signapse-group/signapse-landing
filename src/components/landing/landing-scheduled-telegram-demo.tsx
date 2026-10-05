import { useEffect, useRef, useState, type RefObject } from 'react';
import {
  animate,
  LazyMotion,
  domAnimation,
  m,
  useMotionValue,
} from 'motion/react';
import { MousePointer2Icon } from 'lucide-react';

import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/messages';
import {
  TELEGRAM_DEMO_DURATION,
  TELEGRAM_DEMO_FINAL_FRAME,
  getTelegramDemoCursor,
  getTelegramDemoFrame,
} from './landing-scheduled-telegram-demo-model';
import { LandingTelegramWindows } from './landing-telegram-windows';
import { useLandingPlayback } from './landing-playback';
import styles from './landing-feature-showcase.module.css';

export function LandingScheduledTelegramDemo({
  active,
  labels,
  locale,
  progressRef,
}: {
  active: boolean;
  labels: Dictionary['landing']['showcase']['telegram'];
  locale: Locale;
  progressRef: RefObject<SVGRectElement | null>;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLElement>(null);
  const {
    canPlay,
    reducedMotion: prefersReducedMotion,
    inView,
  } = useLandingPlayback(rootRef, active);
  const elapsedRef = useRef(0);
  const [cycle, setCycle] = useState(0);
  const [frame, setFrame] = useState(TELEGRAM_DEMO_FINAL_FRAME);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const opacity = useMotionValue(1);

  useEffect(() => {
    const window = windowRef.current;
    if (!window) return;
    if (prefersReducedMotion && progressRef.current) {
      progressRef.current.style.strokeDashoffset = '100';
    }
    if (!canPlay) {
      if (!active || !inView || prefersReducedMotion) elapsedRef.current = 0;
      return;
    }

    const targets = new Map<string, { x: number; y: number }>();
    let hasPosition = false;
    const measure = () => {
      const bounds = window.getBoundingClientRect();
      const center = {
        x: (bounds.width - 24) / 2,
        y: (bounds.height - 24) / 2,
      };
      targets.set('center', center);
      window
        .querySelectorAll<HTMLElement>('[data-cursor-target]')
        .forEach((element) => {
          const rect = element.getBoundingClientRect();
          targets.set(element.dataset.cursorTarget!, {
            x: rect.left - bounds.left - window.clientLeft + rect.width * 0.6,
            y: rect.top - bounds.top - window.clientTop + rect.height * 0.5,
          });
        });
      if (!hasPosition && bounds.width > 0 && bounds.height > 0) {
        x.set(center.x);
        y.set(center.y);
        hasPosition = true;
      }
    };
    // Menus stay laid out while hidden so their target coordinates are stable.
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(window);
    window
      .querySelectorAll<HTMLElement>('[data-cursor-target]')
      .forEach((element) => observer.observe(element));

    let previousFrame = TELEGRAM_DEMO_FINAL_FRAME;
    const from = elapsedRef.current;
    const playback = animate(from, TELEGRAM_DEMO_DURATION, {
      duration: TELEGRAM_DEMO_DURATION - from,
      ease: 'linear',
      onUpdate: (seconds) => {
        elapsedRef.current = seconds;
        const nextFrame = getTelegramDemoFrame(seconds);
        if (nextFrame !== previousFrame) {
          previousFrame = nextFrame;
          setFrame(nextFrame);
        }
        if (progressRef.current) {
          progressRef.current.style.strokeDashoffset = String(
            (100 * seconds) / TELEGRAM_DEMO_DURATION,
          );
        }
        const cursor = getTelegramDemoCursor(seconds);
        let from = targets.get(cursor.from);
        let to = targets.get(cursor.to);
        if (!from || !to) {
          measure();
          from = targets.get(cursor.from);
          to = targets.get(cursor.to);
        }
        if (from && to) {
          x.set(from.x + (to.x - from.x) * cursor.progress);
          y.set(from.y + (to.y - from.y) * cursor.progress);
        }
        opacity.set(cursor.opacity);
        scale.set(cursor.scale);
      },
      onComplete: () => {
        elapsedRef.current = 0;
        setCycle((value) => value + 1);
      },
    });

    return () => {
      playback.stop();
      observer.disconnect();
      opacity.set(1);
    };
  }, [
    active,
    canPlay,
    cycle,
    inView,
    locale,
    prefersReducedMotion,
    progressRef,
    x,
    y,
    scale,
    opacity,
  ]);

  const visibleFrame = prefersReducedMotion ? TELEGRAM_DEMO_FINAL_FRAME : frame;

  return (
    <LazyMotion features={domAnimation} strict>
      <div
        ref={rootRef}
        data-demo-renderer="motion"
        data-demo-running={canPlay}
        data-demo-mode="automatic"
        data-telegram-demo-stage
        data-telegram-demo-state={visibleFrame.phase}
        data-telegram-demo-playback={
          prefersReducedMotion ? 'complete' : canPlay ? 'autoplay' : 'paused'
        }
      >
        <LandingTelegramWindows
          labels={labels}
          locale={locale}
          frame={visibleFrame}
          windowRef={windowRef}
          cursor={
            <m.span
              className={styles.demoCursor}
              data-telegram-demo-cursor
              style={{ x, y, scale, opacity }}
              aria-hidden="true"
            >
              <MousePointer2Icon fill="currentColor" />
            </m.span>
          }
        />
      </div>
    </LazyMotion>
  );
}
