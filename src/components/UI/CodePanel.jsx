import React from 'react';
import { useChronosStore } from '../../store/useChronosStore';
import Editor from '../Sandbox/Editor';

export default function CodePanel() {
  const { status } = useChronosStore();
  
  return (
    <div className="code-panel">
      <div className="cp-hdr">
        <div className="cp-tabs">
          <div className="cp-tab on">AlgoEngine.worker.js</div>
          <div className="cp-tab">Visualization.jsx</div>
          <div className="cp-tab">useBufferedQueue.js</div>
        </div>
        <div className="cp-right d-flex align-items-center gap-2">
          <span className="cp-badge">No errors</span>
          <div className="ibtn" style={{ width: '24px', height: '24px', fontSize: '10px' }}>▼</div>
        </div>
      </div>
      <div className="code-body flex-grow-1 overflow-hidden">
        <Editor />
      </div>
    </div>
  );
}
