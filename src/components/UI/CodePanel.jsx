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
        <div className="cp-right">
          <span className="cp-badge">No errors</span>
          <div className="ibtn" style={{ width: '28px', height: '28px', fontSize: '10px', borderRadius: '6px' }}>▼</div>
        </div>
      </div>
      <div className="code-body flex-grow-1 overflow-hidden d-flex">
        <div className="line-nums d-none d-md-block" style={{ padding: '12px 10px', fontSize: '11px', color: 'rgba(255,255,255,0.15)', borderRight: '1px solid rgba(255,255,255,0.05)', textAlign: 'right', minWidth: '40px' }}>
          {Array.from({ length: 15 }).map((_, i) => <div key={i}>{i + 1}</div>)}
        </div>
        <div className="flex-grow-1 overflow-auto">
          <Editor />
        </div>
      </div>
    </div>
  );
}
