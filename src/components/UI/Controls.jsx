import React from 'react';
import { useChronosStore } from '../../store/useChronosStore';
import LiquidButton from './LiquidButton';
import GlassCard from './GlassCard';

export default function Controls({ onRun, onPause, onReset, onRandomize }) {
  const { 
    status, 
    speed, setSpeed, 
    arraySize, setArraySize 
  } = useChronosStore();

  const isRunning = status === 'running';

  return (
    <div className="d-flex flex-column gap-4">
      <div className="d-flex gap-2">
        {!isRunning ? (
          <LiquidButton 
            variant="primary" 
            onClick={onRun}
            className="flex-grow-1"
          >
            {status === 'paused' ? 'Resume' : 'Run Algorithm'}
          </LiquidButton>
        ) : (
          <LiquidButton 
            variant="default" 
            onClick={onPause}
            className="flex-grow-1"
          >
            Pause
          </LiquidButton>
        )}
        
        <LiquidButton 
          variant="danger" 
          onClick={onReset}
          disabled={status === 'idle'}
        >
          Reset
        </LiquidButton>
      </div>

      <LiquidButton 
        variant="default" 
        onClick={onRandomize}
        disabled={isRunning}
      >
        Randomize Array
      </LiquidButton>

      <div className="d-flex flex-column gap-2">
        <div className="d-flex justify-content-between">
          <label className="text-secondary small">Delay: {speed}ms</label>
        </div>
        <input 
          type="range" 
          className="form-range custom-range" 
          min="0" 
          max="200" 
          step="5"
          value={speed}
          onChange={(e) => setSpeed(parseInt(e.target.value))}
        />
      </div>

      <div className="d-flex flex-column gap-2">
        <div className="d-flex justify-content-between">
          <label className="text-secondary small">Array Size: {arraySize}</label>
        </div>
        <input 
          type="range" 
          className="form-range custom-range" 
          min="10" 
          max="200" 
          step="10"
          value={arraySize}
          onChange={(e) => setArraySize(parseInt(e.target.value))}
          disabled={isRunning}
        />
      </div>
    </div>
  );
}
