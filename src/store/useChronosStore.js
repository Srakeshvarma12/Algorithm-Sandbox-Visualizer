import { create } from 'zustand';

export const useChronosStore = create((set) => ({
  // Array state
  array:         [],
  arraySize:     60,
  setArray:      (array)     => set({ array }),
  setArraySize:  (arraySize) => set({ arraySize }),

  // Playback state
  status:        'idle',     // 'idle' | 'running' | 'paused' | 'complete' | 'error'
  setStatus:     (status)    => set({ status }),

  // Speed (ms delay between operations, 0 = max)
  speed:         50,
  setSpeed:      (speed)     => set({ speed }),

  // User code
  userCode:      `// Bubble Sort Example
for (let i = 0; i < arr.length; i++) {
  for (let j = 0; j < arr.length - i - 1; j++) {
    if (compare(j, j + 1)) {
      swap(j, j + 1);
    }
  }
}`,
  setUserCode:   (userCode)  => set({ userCode }),

  // Performance metrics
  comparisons:   0,
  swaps:         0,
  elapsedMs:     0,
  incrementComparisons: () => set((s) => ({ comparisons: s.comparisons + 1 })),
  incrementSwaps:       () => set((s) => ({ swaps:       s.swaps       + 1 })),
  setElapsed:           (ms) => set({ elapsedMs: ms }),

  // Reset all metrics
  resetMetrics: () => set({ comparisons: 0, swaps: 0, elapsedMs: 0 }),
}));
