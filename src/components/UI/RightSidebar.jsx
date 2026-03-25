import React from 'react';
import { useChronosStore } from '../../store/useChronosStore';
import Performance from '../Sandbox/Performance';

export default function RightSidebar() {
  const { comparisons, swaps, elapsedMs } = useChronosStore();
  
  return (
    <aside className="rsb">
      <div className="sec-lbl">Live Metrics</div>
      
      <div className="mcard">
        <div className="mc-lbl">Comparisons</div>
        <div className="mc-val text-info">{comparisons.toLocaleString()}</div>
        <div className="mc-sub">total operations</div>
      </div>
      
      <div className="mcard">
        <div className="mc-lbl">Swaps</div>
        <div className="mc-val text-fuchsia" style={{ color: '#D946EF' }}>{swaps.toLocaleString()}</div>
        <div className="mc-sub">array mutations</div>
      </div>
      
      <div className="mcard">
        <div className="mc-lbl">Elapsed</div>
        <div className="mc-val text-success">{(elapsedMs / 1000).toFixed(1)}s</div>
        <div className="mc-sub">wall clock</div>
      </div>
      
      <div className="perf-card d-flex flex-column">
        <div className="pc-lbl d-flex justify-content-between align-items-center mb-2">
          <span>Performance</span>
          <span className="text-success small">● LIVE</span>
        </div>
        <div className="flex-grow-1" style={{ minHeight: '80px' }}>
          <Performance />
        </div>
      </div>
    </aside>
  );
}
