'use client';

import { useWebHaptics } from 'web-haptics/react';

// Light tap for buttons, toggles, menu opens
const TAP = [{ duration: 30, intensity: 0.4 }];

// Confirmation for add/save/update
const SUCCESS = 'success';

// Destructive action confirmed
const DELETE = 'error';

export function useHaptics() {
  const { trigger } = useWebHaptics();

  return {
    tap: () => trigger(TAP),
    success: () => trigger(SUCCESS),
    delete: () => trigger(DELETE),
  };
}
