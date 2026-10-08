import type { FocusEvent, MouseEvent, PointerEvent } from 'react';

export interface PreviewItemProps {
  onPointerEnter: (event: PointerEvent<HTMLElement>) => void;
  onFocus: (event: FocusEvent<HTMLElement>) => void;
  onClick: (event: MouseEvent<HTMLElement>) => void;
}

function isTouchClick(event: MouseEvent<HTMLElement>): boolean {
  const pointerType = (event.nativeEvent as { pointerType?: string }).pointerType;
  if (pointerType === 'touch' || pointerType === 'pen') return true;
  return window.matchMedia('(hover: none)').matches;
}

// Hover-to-preview items that are also links. Mouse hover and keyboard focus
// preview and a click follows the link. On touch there is no hover, so a tap
// only selects (previews) the item and never navigates — each section has an
// explicit "view" button for that. Touch browsers fire emulated hover/focus
// before a tap's click, so those are ignored unless from a real mouse or
// keyboard.
export function useTapToPreview(setActive: (index: number) => void) {
  return (index: number): PreviewItemProps => ({
    onPointerEnter: (event) => {
      if (event.pointerType === 'mouse') setActive(index);
    },
    onFocus: (event) => {
      if (event.currentTarget.matches(':focus-visible')) setActive(index);
    },
    onClick: (event) => {
      if (isTouchClick(event)) {
        event.preventDefault();
        setActive(index);
      }
    },
  });
}
