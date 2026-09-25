'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type Palette = 'current' | 'ash-ember';

const STORAGE_KEY = 'zellenth-palette-demo';

/**
 * Client-demo-only palette switcher. Renders nothing unless the page was
 * opened with ?palette-demo=1, so it has zero footprint for real visitors
 * and doesn't need an auth gate. Lets the client flip the whole live site
 * (not a static mockup) between the current palette and the "Ash & Ember"
 * direction from the palette study artifact.
 */
export function PaletteDemoToggle() {
  const searchParams = useSearchParams();
  const isDemoMode = searchParams.get('palette-demo') === '1';
  const [palette, setPalette] = useState<Palette>('current');

  useEffect(() => {
    if (!isDemoMode) return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'ash-ember') setPalette('ash-ember');
  }, [isDemoMode]);

  useEffect(() => {
    if (!isDemoMode) return;
    if (palette === 'ash-ember') {
      document.documentElement.setAttribute('data-palette', 'ash-ember');
    } else {
      document.documentElement.removeAttribute('data-palette');
    }
    window.localStorage.setItem(STORAGE_KEY, palette);
  }, [palette, isDemoMode]);

  if (!isDemoMode) return null;

  return (
    <div className="bg-surface border-border shadow-elevated fixed bottom-5 left-5 z-50 flex items-center gap-1 rounded-full border p-1">
      <button
        type="button"
        onClick={() => setPalette('current')}
        className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
          palette === 'current'
            ? 'bg-action text-action-text'
            : 'text-text-secondary hover:bg-neutral-tint'
        }`}
      >
        Current
      </button>
      <button
        type="button"
        onClick={() => setPalette('ash-ember')}
        className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
          palette === 'ash-ember'
            ? 'bg-action text-action-text'
            : 'text-text-secondary hover:bg-neutral-tint'
        }`}
      >
        Ash &amp; Ember
      </button>
    </div>
  );
}
