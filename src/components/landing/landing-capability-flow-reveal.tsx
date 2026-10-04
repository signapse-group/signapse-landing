'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

export function LandingCapabilityFlowReveal({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;

        setIsActive(entry.isIntersecting && !document.hidden);
      },
      { threshold: 0.35 },
    );

    observer.observe(root);
    const onVisibility = () => {
      if (document.hidden) setIsActive(false);
      else {
        const bounds = root.getBoundingClientRect();
        setIsActive(bounds.top < window.innerHeight && bounds.bottom > 0);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={className}
      data-flow-active={isActive || undefined}
    >
      {children}
    </div>
  );
}
