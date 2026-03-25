// src/hooks/useBufferedQueue.js
// The rAF loop that drains snapshots from the Worker into the renderer.
import { useRef, useCallback, useEffect } from 'react';

export function useBufferedQueue(onFrame) {
  const queueRef = useRef([]);
  const rafRef   = useRef(null);
  const isRunRef = useRef(false);

  const enqueue = useCallback((snapshot) => {
    queueRef.current.push(snapshot);
  }, []);

  const startDraining = useCallback(() => {
    if (isRunRef.current) return;
    isRunRef.current = true;

    function drain() {
      if (!isRunRef.current) return;

      if (queueRef.current.length > 0) {
        // In "Max Speed" mode, drain multiple frames per tick
        // If queue is backed up, process more frames to catch up
        const batchSize = queueRef.current.length > 50 ? (queueRef.current.length > 200 ? 20 : 5) : 1;
        const frames = queueRef.current.splice(0, batchSize);
        frames.forEach(frame => onFrame(frame));
      }

      rafRef.current = requestAnimationFrame(drain);
    }

    rafRef.current = requestAnimationFrame(drain);
  }, [onFrame]);

  const stopDraining = useCallback(() => {
    isRunRef.current = false;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    queueRef.current = [];
  }, []);

  // Cleanup on unmount
  useEffect(() => () => stopDraining(), [stopDraining]);

  return { enqueue, startDraining, stopDraining };
}
