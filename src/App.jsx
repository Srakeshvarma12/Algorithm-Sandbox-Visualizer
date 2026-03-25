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
import Docs from './components/Stage/Docs';
import Performance from './components/Sandbox/Performance';
import Editor from './components/Sandbox/Editor';

export default function App() {
  const { 
    array, setArray, 
    arraySize, 
    status, setStatus, 
    speed, delay,
    userCode, setUserCode,
    incrementComparisons, incrementSwaps,
    resetMetrics,
    activeTab
  } = useChronosStore();

  const visualizationRef = useRef(null);

  // ... (randomizeArray, onFrame, useBufferedQueue, onWorkerMessage, useWorker as before)
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

  const renderStage = () => {
    switch (activeTab) {
      case 'visualizer':
        return (
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
        );
      case 'sandbox':
        return (
          <div className="stage flex-grow-1 d-flex flex-column" style={{ background: '#05050A' }}>
             <div className="p-3 border-bottom border-white-5 small text-secondary d-flex justify-content-between align-items-center">
                <span>SANDBOX EDITOR</span>
                <button className="btn btn-primary btn-sm" style={{ height: '24px', fontSize: '10px' }} onClick={handleRun}>Run Script</button>
             </div>
             <div className="flex-grow-1 overflow-hidden">
                <Editor />
             </div>
          </div>
        );
      case 'performance':
        return (
          <div className="stage flex-grow-1 d-flex flex-column p-4 overflow-hidden" style={{ background: '#05050A' }}>
             <div className="stage-label mb-4 d-flex align-items-center gap-2 text-uppercase small text-secondary">
               <span className="adot" style={{ background: '#22D3EE', boxShadow: '0 0 10px #22D3EE' }}></span>
               Performance Analytics
             </div>
             <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                <div style={{ width: '100%', height: '300px' }}>
                   <Performance />
                </div>
             </div>
          </div>
        );
      case 'docs':
        return (
          <div className="stage flex-grow-1 overflow-hidden">
             <Docs />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app d-flex flex-column" style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <div className="noise"></div>
      <div className="glow1"></div>
      <div className="glow2"></div>

      <Header />

      <main className="body d-flex flex-grow-1 overflow-hidden">
        <Sidebar />
        
        <div className="stage-wrap d-flex flex-column flex-grow-1">
          {renderStage()}

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
