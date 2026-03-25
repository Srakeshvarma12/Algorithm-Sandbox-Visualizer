import React, { useEffect, useRef } from 'react';
import { useChronosStore } from '../../store/useChronosStore';

export default function Performance() {
  const canvasRef = useRef(null);
  const dataRef = useRef([]);
  const { comparisons, swaps, status } = useChronosStore();
  
  // Track operations
  useEffect(() => {
    if (status === 'running') {
      const ops = comparisons + swaps;
      dataRef.current.push({ time: Date.now(), ops });
      // Keep only last 60 seconds of data
      const limit = Date.now() - 60000;
      dataRef.current = dataRef.current.filter(d => d.time > limit);
    } else if (status === 'idle') {
      dataRef.current = [];
    }
  }, [comparisons, swaps, status]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let rafId;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    window.addEventListener('resize', resize);
    resize();

    const render = () => {
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;
      
      ctx.clearRect(0, 0, width, height);

      if (dataRef.current.length < 2) {
        rafId = requestAnimationFrame(render);
        return;
      }

      const now = Date.now();
      const startTime = now - 60000;

      // Draw Grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const y = (height / 4) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Data
      const maxOps = Math.max(...dataRef.current.map(d => d.ops), 100);
      
      ctx.beginPath();
      ctx.strokeStyle = '#6366F1';
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';

      dataRef.current.forEach((d, i) => {
        const x = ((d.time - startTime) / 60000) * width;
        const y = height - (d.ops / maxOps) * height;
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      
      ctx.stroke();

      // Fill area
      ctx.lineTo(width, height);
      ctx.lineTo(((dataRef.current[0].time - startTime) / 60000) * width, height);
      ctx.fillStyle = 'rgba(99, 102, 241, 0.1)';
      ctx.fill();

      rafId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="w-100 h-100">
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
