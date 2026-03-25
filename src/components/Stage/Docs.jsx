import React from 'react';

export default function Docs() {
  return (
    <div className="docs-container p-4 overflow-auto h-100" style={{ background: 'rgba(10, 10, 15, 0.4)', color: 'rgba(255, 255, 255, 0.8)' }}>
      <h2 className="mb-4 text-white" style={{ letterSpacing: '-0.02em', fontWeight: 600 }}>Chronos API & Sandbox Documentation</h2>
      
      <section className="mb-5">
        <h4 className="text-info mb-3">Exposed API</h4>
        <p className="small mb-2">Your sandbox code has access to the following globals:</p>
        <ul className="list-unstyled">
          <li className="mb-3">
            <code className="text-fuchsia" style={{ background: 'rgba(217, 70, 239, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>compare(i, j)</code>
            <p className="text-secondary mt-1 small">Compares elements at index `i` and `j`. Returns `true` if `arr[i] &gt; arr[j]`. Emits a 'compare' snapshot for the visualizer.</p>
          </li>
          <li className="mb-3">
            <code className="text-indigo" style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>swap(i, j)</code>
            <p className="text-secondary mt-1 small">Swaps elements at index `i` and `j` in the underlying array. Emits a 'swap' snapshot.</p>
          </li>
          <li>
            <code className="text-success" style={{ background: 'rgba(52, 211, 153, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>await</code>
            <p className="text-secondary mt-1 small">You can use `await` for recursive or slow-executing algorithms. The engine automatically detects and handles AsyncFunctions.</p>
          </li>
        </ul>
      </section>

      <section>
        <h4 className="text-warning mb-3">Algorithm Examples</h4>
        <div className="example-grid d-flex flex-column gap-4">
          <div className="p-3 rounded" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <h6 className="text-white mb-2">Bubble Sort</h6>
            <pre className="small m-0" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>{`for (let i = 0; i < arr.length; i++) {
  for (let j = 0; j < arr.length - i - 1; j++) {
    if (compare(j, j + 1)) swap(j, j + 1);
  }
}`}</pre>
          </div>
          
          <div className="p-3 rounded" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <h6 className="text-white mb-2">Selection Sort</h6>
            <pre className="small m-0" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>{`for (let i = 0; i < arr.length; i++) {
  let min = i;
  for (let j = i + 1; j < arr.length; j++) {
    if (compare(min, j)) min = j;
  }
  if (min !== i) swap(i, min);
}`}</pre>
          </div>

          <div className="p-3 rounded" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <h6 className="text-white mb-2">Insertion Sort</h6>
            <pre className="small m-0" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>{`for (let i = 1; i < arr.length; i++) {
  let j = i;
  while (j > 0 && compare(j - 1, j)) {
    swap(j, j - 1);
    j--;
  }
}`}</pre>
          </div>
        </div>
      </section>
      
      <style jsx="true">{`
        pre { font-family: 'SF Mono', ui-monospace, monospace; }
        .text-fuchsia { color: #D946EF; }
        .text-indigo { color: #6366F1; }
      `}</style>
    </div>
  );
}
