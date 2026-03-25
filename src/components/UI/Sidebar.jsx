import React from 'react';
import { useChronosStore } from '../../store/useChronosStore';
import { ALGORITHMS } from '../../constants';

export default function Sidebar() {
  const { arraySize, selectedAlgo, setSelectedAlgo, status } = useChronosStore();
  
  const currentAlgo = ALGORITHMS.find(a => a.id === selectedAlgo) || ALGORITHMS[0];

  return (
    <aside className="lsb">
      <div className="sec-lbl">Algorithms</div>
      {ALGORITHMS.map(algo => (
        <div 
          key={algo.id}
          className={`algo-item ${selectedAlgo === algo.id ? 'sel' : ''}`}
          onClick={() => status !== 'running' && setSelectedAlgo(algo.id)}
        >
          <div className="adot"></div>
          {algo.name}
          {algo.complexity && <span className="algo-tag ms-auto">{algo.complexity}</span>}
        </div>
      ))}
      
      <div className="divline my-3"></div>
      
      <div className="sec-lbl">Complexity</div>
      <div className="stat-row"><span className="sk">Best case</span><span className="sv text-success">{currentAlgo.best}</span></div>
      <div className="stat-row"><span className="sk">Average</span><span className="sv text-info">{currentAlgo.average}</span></div>
      <div className="stat-row"><span className="sk">Worst</span><span className="sv text-warning">{currentAlgo.worst}</span></div>
      <div className="stat-row"><span className="sk">Space</span><span className="sv text-secondary">{currentAlgo.space}</span></div>
      <div className="stat-row"><span className="sk">Stable</span><span className="sv text-success">{currentAlgo.stable}</span></div>
      
      <div className="divline my-3"></div>
      
      <div className="sec-lbl">Array</div>
      <div className="stat-row"><span className="sk">Size</span><span className="sv text-secondary">{arraySize}</span></div>
      <div className="stat-row"><span className="sk">Sorted</span><span className="sv text-warning">0%</span></div>
      <div className="stat-row"><span className="sk">Thread</span><span className="sv text-success">Worker #1</span></div>
    </aside>
  );
}
