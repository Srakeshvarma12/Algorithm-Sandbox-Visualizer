import React, { useEffect, useRef, useCallback } from 'react';
import { useChronosStore } from './store/useChronosStore';
import { useWorker } from './hooks/useWorker';
import { useBufferedQueue } from './hooks/useBufferedQueue';

import Header from './components/UI/Header';
import Sidebar from './components/UI/Sidebar';
import RightSidebar from './components/UI/RightSidebar';
import Controls from './components/UI/Controls';
import CodePanel from './components/UI/CodePanel';
import Visualization from './components/Stage/Visualization';

export default function App() {
  const { 
    array, setArray, 
    arraySize, 
    status, setStatus, 
    speed, delay,
    userCode,
    incrementComparisons, incrementSwaps,
    resetMetrics
  } = useChronosStore();

  const visualizationRef = useRef(null);
  const timerRef = useRef(null);

  const randomizeArray = useCallback(() => {
    const newArray = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 90) + 10);
    setArray(newArray);
    resetMetrics();
    setStatus('idle');
    if (visualizationRef.current) visualizationRef.current.reset(newArray);
  }, [arraySize, setArray, resetMetrics, setStatus]);

  useEffect(() => {
    randomizeArray();
  }, [arraySize, randomizeArray]);

  const onFrame = useCallback((snapshot) => {
    if (visualizationRef.current) visualizationRef.current.applySnapshot(snapshot);
    if (snapshot.operationType === 'compare') incrementComparisons();
    if (snapshot.operationType === 'swap') incrementSwaps();
  }, [incrementComparisons, incrementSwaps]);

  const { enqueue, startDraining, stopDraining } = useBufferedQueue(onFrame);

  const onWorkerMessage = useCallback((message) => {
    if (message.type === 'SNAPSHOT') enqueue(message.payload);
    else if (message.type === 'COMPLETE') setStatus('complete');
    else if (message.type === 'ERROR') {
      setStatus('error');
      stopDraining();
    }
  }, [enqueue, setStatus, stopDraining]);

  const { postMessage } = useWorker(onWorkerMessage);

  const handleRun = () => {
    if (status === 'paused') {
      setStatus('running');
      startDraining();
    } else {
      resetMetrics();
      setStatus('running');
      postMessage({ type: 'INIT', payload: { array, speed: delay } });
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

  useEffect(() => {
    postMessage({ type: 'SET_SPEED', payload: { speed: delay } });
  }, [delay, postMessage]);

  return (
    <div className="app d-flex flex-column" style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <div className="noise"></div>
      <div className="glow1"></div>
      <div className="glow2"></div>

      <Header />

      <main className="body d-flex flex-grow-1 overflow-hidden">
        <Sidebar />
        
        <div className="stage-wrap d-flex flex-column flex-grow-1">
          <div className="stage flex-grow-1 position-relative">
            <div className="grid-bg"></div>
            <div className="stage-label d-flex align-items-center gap-2 m-3 text-uppercase small text-secondary">
              <span className="adot" style={{ background: '#6366f1', boxShadow: '0 0 10px #6366f1' }}></span>
              Visualization Stage
            </div>
            <div className="bars-wrap position-absolute bottom-0 start-0 end-0 p-3 h-75">
              <Visualization ref={visualizationRef} arraySize={arraySize} />
            </div>
          </div>

          <Controls 
            onRun={handleRun}
            onPause={handlePause}
            onReset={handleReset}
            onRandomize={randomizeArray}
          />
        </div>

        <RightSidebar />
      </main>

      <CodePanel />

      <style jsx="true">{`
        .stage-label { font-size: 10px; letter-spacing: 0.1em; }
        .grid-bg { position: absolute; inset: 0; background-image: linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px); background-size: 36px 36px; }
      `}</style>
    </div>
  );
}
