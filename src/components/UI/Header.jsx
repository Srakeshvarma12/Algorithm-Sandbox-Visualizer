import React from 'react';
import { useChronosStore } from '../../store/useChronosStore';

export default function Header() {
  const { status, activeTab, setActiveTab } = useChronosStore();
  
  const tabs = [
    { id: 'visualizer', label: 'Visualizer' },
    { id: 'sandbox', label: 'Sandbox' },
    { id: 'performance', label: 'Performance' },
    { id: 'docs', label: 'Docs' }
  ];

  return (
    <header className="hdr">
      <div className="logo d-flex align-items-center gap-2">
        <div className="lmark text-white">⚡</div>
        <div>
          <div className="lname text-white">Chronos</div>
          <div className="lsub">Algorithm Sandbox</div>
        </div>
      </div>
      
      <div className="hdr-center d-flex gap-2">
        {tabs.map(tab => (
          <div 
            key={tab.id}
            className={`nav-pill ${activeTab === tab.id ? 'on' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </div>
      
      <div className="hdr-right d-flex align-items-center gap-3">
        {status === 'running' && (
          <div className="sbadge run">
            <div className="sdot me-2"></div>
            Running
          </div>
        )}
        {status === 'paused' && (
          <div className="sbadge cmp">
            <div className="sdot me-2"></div>
            Paused
          </div>
        )}
        <div className="ibtn text-secondary">⚙</div>
        <div className="ibtn" style={{ background: 'rgba(99, 102, 241, 0.15)', borderColor: 'rgba(99, 102, 241, 0.3)', color: '#a5b4fc' }}>?</div>
      </div>
    </header>
  );
}
