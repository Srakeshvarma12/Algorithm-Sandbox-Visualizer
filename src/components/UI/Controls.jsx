import React from 'react';
import { useChronosStore } from '../../store/useChronosStore';
import LiquidButton from './LiquidButton';

export default function Controls({ onRun, onPause, onReset, onRandomize }) {
  const { 
    status, 
    speed, setSpeed, 
    arraySize, setArraySize,
    delay, setDelay
  } = useChronosStore();

  const isRunning = status === 'running';

  return (
    <div className="ctrl">
      {!isRunning ? (
        <button className="btn btn-primary" onClick={onRun}>▶ Run</button>
      ) : (
        <button className="btn btn-primary" onClick={onPause}>⏸ Pause</button>
      )}
      
      <button className="btn btn-danger" onClick={onReset}>■ Stop</button>
      <button className="btn btn-ghost" onClick={onRandomize}>↻ Randomize</button>
      
      <div className="cv ms-2 me-2"></div>
      
      <div className="sl-wrap">
        <span className="sl-lbl">Speed</span>
        <input 
          type="range" 
          min="1" max="100" step="1"
          value={speed}
          onChange={(e) => setSpeed(parseInt(e.target.value))}
        />
        <span className="sl-val">{speed}</span>
      </div>

      <div className="sl-wrap ms-3">
        <span className="sl-lbl">Size</span>
        <input 
          type="range" 
          min="20" max="200" step="1"
          value={arraySize}
          onChange={(e) => setArraySize(parseInt(e.target.value))}
          disabled={isRunning}
        />
        <span className="sl-val">{arraySize}</span>
      </div>

      <div className="cv ms-3 me-3"></div>

      <div className="sl-wrap">
        <span className="sl-lbl">Delay</span>
        <input 
          type="range" 
          min="1" max="200" step="1"
          value={delay}
          onChange={(e) => setDelay(parseInt(e.target.value))}
        />
        <span className="sl-val">{delay}ms</span>
      </div>

      <div className="worker-tag ms-auto d-flex align-items-center gap-2 text-secondary small">
        <div className="wdot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399' }}></div>
        Worker Active
      </div>
      
      <style jsx="true">{`
        .cv { width: 1px; height: 18px; background: rgba(255,255,255,.08); }
        .sl-wrap { display: flex; align-items: center; gap: 8px; }
        .sl-lbl { font-size: 10px; color: rgba(255,255,255,.3); text-transform: uppercase; }
        .sl-val { font-size: 10px; font-family: monospace; color: rgba(255,255,255,.5); min-width: 30px; text-align: right; }
        input[type=range] { width: 80px; height: 3px; background: rgba(255,255,255,.1); border-radius: 2px; appearance: none; cursor: pointer; }
        input[type=range]::-webkit-slider-thumb { appearance: none; width: 10px; height: 10px; background: #6366f1; border-radius: 50%; box-shadow: 0 0 6px #6366f1; }
      `}</style>
    </div>
  );
}
