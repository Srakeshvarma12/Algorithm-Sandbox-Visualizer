import { create } from 'zustand';
import { ALGORITHMS } from '../constants';

export const useChronosStore = create((set) => ({
  // Array state
  array:         [],
  arraySize:     64,
  setArray:      (array)     => set({ array }),
  setArraySize:  (arraySize) => set({ arraySize }),

  // Selection
  selectedAlgo:  'bubble',
  setSelectedAlgo: (id) => {
    const algo = ALGORITHMS.find(a => a.id === id);
    if (algo) {
      set({ selectedAlgo: id, userCode: algo.code });
    }
  },

  // Playback state
  status:        'idle',     
  setStatus:     (status)    => set({ status }),

  // Speed & Delay
  speed:         55,
  setSpeed:      (speed)     => set({ speed }),
  delay:         30,
  setDelay:      (delay)     => set({ delay }),

  // User code
  userCode:      ALGORITHMS[0].code,
  setUserCode:   (userCode)  => set({ userCode }),

  // Metrics
  comparisons:   0,
  swaps:         0,
  elapsedMs:     0,
  incrementComparisons: () => set((s) => ({ comparisons: s.comparisons + 1 })),
  incrementSwaps:       () => set((s) => ({ swaps:       s.swaps       + 1 })),
  setElapsed:           (ms) => set({ elapsedMs: ms }),

  resetMetrics: () => set({ comparisons: 0, swaps: 0, elapsedMs: 0 }),
}));
