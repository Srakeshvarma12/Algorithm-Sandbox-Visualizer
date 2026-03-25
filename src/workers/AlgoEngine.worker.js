// src/workers/AlgoEngine.worker.js
let array = [];
let speed = 50; 

function emitSnapshot(activeIndices = [], type = 'compare') {
  self.postMessage({
    type: 'SNAPSHOT',
    payload: {
      array: [...array],
      activeIndices,
      operationType: type,
      timestamp: performance.now(),
    },
  });
}

function swap(i, j) {
  if (i < 0 || i >= array.length || j < 0 || j >= array.length) return;
  [array[i], array[j]] = [array[j], array[i]];
  emitSnapshot([i, j], 'swap');
  
  if (speed > 0) {
    const start = performance.now();
    while (performance.now() - start < speed) {}
  }
}

function compare(i, j) {
  if (i < 0 || i >= array.length || j < 0 || j >= array.length) return false;
  emitSnapshot([i, j], 'compare');
  
  if (speed > 0) {
    const start = performance.now();
    while (performance.now() - start < speed) {}
  }
  
  return array[i] > array[j];
}

async function executeSandbox(userCode) {
  try {
    // Check if code uses await to determine if we should wrap in async
    const isAsync = userCode.includes('await');
    const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
    
    const fn = isAsync 
      ? new AsyncFunction('arr', 'swap', 'compare', `"use strict"; ${userCode}`)
      : new Function('arr', 'swap', 'compare', `"use strict"; ${userCode}`);
    
    if (isAsync) {
      await fn(array, swap, compare);
    } else {
      fn(array, swap, compare);
    }
    
    self.postMessage({ type: 'COMPLETE', payload: { array: [...array] } });
  } catch (err) {
    self.postMessage({ type: 'ERROR', payload: { message: err.message } });
  }
}

self.onmessage = (event) => {
  const { type, payload } = event.data;
  switch (type) {
    case 'INIT':
      array = [...payload.array];
      speed = payload.speed ?? 50;
      break;
    case 'RUN':
      executeSandbox(payload.code);
      break;
    case 'SET_SPEED':
      speed = payload.speed;
      break;
    case 'RESET':
      array = [];
      break;
  }
};
