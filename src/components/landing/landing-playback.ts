import {
  useEffect,
  useState,
  useSyncExternalStore,
  type RefObject,
} from 'react';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function subscribeVisibility(onChange: () => void) {
  document.addEventListener('visibilitychange', onChange);
  return () => document.removeEventListener('visibilitychange', onChange);
}

function getPageVisible() {
  return document.visibilityState === 'visible';
}

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

function getReducedMotion() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

export function useLandingPlayback(
  rootRef: RefObject<HTMLElement | null>,
  active: boolean,
) {
  const [inView, setInView] = useState(false);
  const pageVisible = useSyncExternalStore(
    subscribeVisibility,
    getPageVisible,
    getServerSnapshot,
  );
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getServerSnapshot,
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) =>
        setInView(entry.isIntersecting && entry.intersectionRatio >= 0.2),
      { threshold: [0, 0.2] },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, [rootRef]);

  return {
    canPlay: active && inView && pageVisible && !reducedMotion,
    reducedMotion,
    inView,
  };
}
