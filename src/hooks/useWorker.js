// src/hooks/useWorker.js
import { useRef, useEffect, useCallback } from 'react';

export function useWorker(onMessage) {
  const workerRef = useRef(null);
  const watchdogTimerRef = useRef(null);

  const stopWatchdog = useCallback(() => {
    if (watchdogTimerRef.current) {
      clearTimeout(watchdogTimerRef.current);
      watchdogTimerRef.current = null;
    }
  }, []);

  const startWatchdog = useCallback(() => {
    stopWatchdog();
    watchdogTimerRef.current = setTimeout(() => {
      // Worker has been silent for 10s — force terminate
      console.warn('[Chronos Watchdog] Execution timed out.');
      workerRef.current?.terminate();
      onMessage({ type: 'ERROR', payload: { message: 'Execution timed out (possible infinite loop).' } });
      // Re-initialize worker after crash
      initWorker();
    }, 10_000);
  }, [onMessage, stopWatchdog]);

  const initWorker = useCallback(() => {
    if (workerRef.current) workerRef.current.terminate();
    
    workerRef.current = new Worker(
      new URL('../workers/AlgoEngine.worker.js', import.meta.url),
      { type: 'module' }
    );

    workerRef.current.onmessage = (event) => {
      if (event.data.type === 'SNAPSHOT') {
        startWatchdog(); // Reset watchdog on activity
      } else if (event.data.type === 'COMPLETE' || event.data.type === 'ERROR') {
        stopWatchdog();
      }
      onMessage(event.data);
    };

    workerRef.current.onerror = (err) => {
      console.error('[Chronos Worker Error]', err);
      stopWatchdog();
    };
  }, [onMessage, startWatchdog, stopWatchdog]);

  useEffect(() => {
    initWorker();
    return () => {
      workerRef.current?.terminate();
      stopWatchdog();
    };
  }, [initWorker, stopWatchdog]);

  const postMessage = useCallback((message) => {
    if (message.type === 'RUN') startWatchdog();
    workerRef.current?.postMessage(message);
  }, [startWatchdog]);

  return { postMessage };
}
