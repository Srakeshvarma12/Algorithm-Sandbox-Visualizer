import React, { useEffect, useRef, useCallback } from 'react';
import { useChronosStore } from './store/useChronosStore';
import { useWorker } from './hooks/useWorker';
import { useBufferedQueue } from './hooks/useBufferedQueue';

import Visualization from './components/Stage/Visualization';
import GridBackground from './components/Stage/GridBackground';
import Editor from './components/Sandbox/Editor';
import Performance from './components/Sandbox/Performance';
import GlassCard from './components/UI/GlassCard';
import Controls from './components/UI/Controls';
import StatusBadge from './components/UI/StatusBadge';

export default function App() {
  const { 
    array, setArray, 
    arraySize, 
    status, setStatus, 
    speed, 
    userCode,
    comparisons, incrementComparisons,
    swaps, incrementSwaps,
    resetMetrics
  } = useChronosStore();

  const visualizationRef = useRef(null);

  // Initialize Array
  const randomizeArray = useCallback(() => {
    const newArray = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100) + 10);
    setArray(newArray);
    resetMetrics();
    setStatus('idle');
    if (visualizationRef.current) {
       visualizationRef.current.reset(newArray);
    }
  }, [arraySize, setArray, resetMetrics, setStatus]);

  useEffect(() => {
    randomizeArray();
  }, [arraySize]); // Re-randomize when size changes

  // Frame Handling
  const onFrame = useCallback((snapshot) => {
    if (visualizationRef.current) {
      visualizationRef.current.applySnapshot(snapshot);
    }
    if (snapshot.operationType === 'compare') incrementComparisons();
    if (snapshot.operationType === 'swap') incrementSwaps();
  }, [incrementComparisons, incrementSwaps]);

  const { enqueue, startDraining, stopDraining } = useBufferedQueue(onFrame);

  // Worker Handling
  const onWorkerMessage = useCallback((message) => {
    const { type, payload } = message;

    switch (type) {
      case 'SNAPSHOT':
        enqueue(payload);
        break;
      case 'COMPLETE':
        setStatus('complete');
        // stopDraining(); // Finish the queue first?
        break;
      case 'ERROR':
        console.error('Worker Error:', payload.message);
        setStatus('error');
        stopDraining();
        break;
      default:
        break;
    }
  }, [enqueue, setStatus, stopDraining]);

  const { postMessage } = useWorker(onWorkerMessage);

  // Playback Logic
  const handleRun = () => {
    if (status === 'paused') {
      setStatus('running');
      startDraining();
    } else {
      resetMetrics();
      setStatus('running');
      postMessage({ type: 'INIT', payload: { array, speed } });
      postMessage({ type: 'RUN', payload: { code: userCode } });
      startDraining();
    }
  };

  const handlePause = () => {
    setStatus('paused');
    stopDraining();
  };

  const handleReset = () => {
    stopDraining();
    randomizeArray();
    postMessage({ type: 'RESET' });
  };

  // Sync speed with worker
  useEffect(() => {
    postMessage({ type: 'SET_SPEED', payload: { speed } });
  }, [speed, postMessage]);

  return (
    <div className="container-fluid h-100 p-4 position-relative overflow-hidden">
      <GridBackground />
      
      <div className="row h-100 g-4">
        {/* Sidebar */}
        <div className="col-lg-3 d-flex flex-column gap-4 h-100">
          <GlassCard className="p-4 flex-grow-0">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h2 className="m-0 fs-4 fw-bold">Chronos ⚡</h2>
              <StatusBadge status={status} />
            </div>
            
            <Controls 
              onRun={handleRun}
              onPause={handlePause}
              onReset={handleReset}
              onRandomize={randomizeArray}
            />
          </GlassCard>

          <GlassCard className="p-4 flex-grow-1 overflow-hidden d-flex flex-column">
            <div className="d-flex justify-content-between align-items-end mb-3">
               <h3 className="fs-6 text-secondary mb-0">Performance Graph</h3>
               <div className="text-muted small">Ops/Sec</div>
            </div>
            <div className="flex-grow-1">
               <Performance />
            </div>
          </GlassCard>

          <GlassCard className="p-3 flex-grow-0">
            <div className="row g-0 text-center">
              <div className="col-6 border-end border-opacity-10 border-white">
                <div className="text-secondary small">Comparisons</div>
                <div className="fs-5 fw-bold text-fuchsia">{comparisons}</div>
              </div>
              <div className="col-6">
                <div className="text-secondary small">Swaps</div>
                <div className="fs-5 fw-bold text-indigo">{swaps}</div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Main Stage */}
        <div className="col-lg-9 d-flex flex-column gap-4 h-100">
          <GlassCard className="flex-grow-1 p-4 position-relative overflow-hidden" style={{ minHeight: '400px' }}>
            <Visualization ref={visualizationRef} arraySize={arraySize} />
          </GlassCard>

          <GlassCard className="h-40 p-0 overflow-hidden" style={{ height: '35%' }}>
             <Editor />
          </GlassCard>
        </div>
      </div>

      <style jsx="true">{`
        .h-40 { height: 40%; }
        .text-fuchsia { color: var(--accent-fuchsia); }
        .text-indigo { color: var(--accent-indigo); }
      `}</style>
    </div>
  );
}
