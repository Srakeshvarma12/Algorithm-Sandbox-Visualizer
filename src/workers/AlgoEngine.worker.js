// src/workers/AlgoEngine.worker.js
// ⚠️ This file has NO imports from the React app. It is fully isolated.

let array = [];
let isRunning = false;
let speed = 50; // ms delay between operations

// ─── Snapshot Emitter ────────────────────────────────────────────────────────
// Sends the current array state + active indices to the main thread.
// Call this after EVERY comparison or swap.
function emitSnapshot(activeIndices = [], type = 'compare') {
  self.postMessage({
    type: 'SNAPSHOT',
    payload: {
      array: [...array],        // Always send a copy, never a reference
      activeIndices,
      operationType: type,      // 'compare' | 'swap' | 'sorted'
      timestamp: performance.now(),
    },
  });
}

// ─── Helpers injected into user sandbox ──────────────────────────────────────
function swap(i, j) {
  [array[i], array[j]] = [array[j], array[i]];
  emitSnapshot([i, j], 'swap');
  
  // Artificial delay to allow visualization to breathe
  if (speed > 0) {
    const start = performance.now();
    while (performance.now() - start < speed) {
      // blocking wait for speed delay
    }
  }
}

function compare(i, j) {
  emitSnapshot([i, j], 'compare');
  
  // Artificial delay
  if (speed > 0) {
    const start = performance.now();
    while (performance.now() - start < speed) {
      // blocking wait for speed delay
    }
  }
  
  return array[i] > array[j];
}

// ─── User Sandbox Executor ───────────────────────────────────────────────────
// Wraps user code in new Function() and injects helpers.
// MUST be called only after receiving a 'RUN' message.
function executeSandbox(userCode) {
  try {
    const fn = new Function('arr', 'swap', 'compare', `
      "use strict";
      ${userCode}
    `);
    fn(array, swap, compare);
    // Emit final sorted state
    self.postMessage({ type: 'COMPLETE', payload: { array: [...array] } });
  } catch (err) {
    self.postMessage({ type: 'ERROR', payload: { message: err.message } });
  }
}

// ─── Message Handler ─────────────────────────────────────────────────────────
self.onmessage = (event) => {
  const { type, payload } = event.data;

  switch (type) {
    case 'INIT':
      array = [...payload.array];
      speed = payload.speed ?? 50;
      self.postMessage({ type: 'READY' });
      break;

    case 'RUN':
      isRunning = true;
      executeSandbox(payload.code);
      break;

    case 'SET_SPEED':
      speed = payload.speed;
      break;

    case 'RESET':
      isRunning = false;
      array = [];
      break;

    default:
      // Unknown message — silently ignore, never throw
      break;
  }
};
