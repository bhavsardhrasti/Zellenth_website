'use client';

import Lenis from 'lenis';
import { useEffect } from 'react';

// Inertia scrolling for mouse/trackpad desktops only. Touch devices keep
// native momentum scrolling (it's already smooth and Lenis fights it), and
// anyone with reduced-motion on keeps plain native scrolling too.
export function SmoothScroll() {
  useEffect(() => {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canHover || reduced) return;

    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });

    // Modals lock the page with body overflow: hidden; Lenis scrolls
    // programmatically so it would still move the page behind them.
    const syncWithScrollLock = (): void => {
      if (document.body.style.overflow === 'hidden') lenis.stop();
      else lenis.start();
    };
    const observer = new MutationObserver(syncWithScrollLock);
    observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });
    syncWithScrollLock();

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
