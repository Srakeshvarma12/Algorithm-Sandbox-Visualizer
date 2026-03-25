// src/components/Stage/Visualization.jsx
import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import $ from 'jquery';

const BAR_COLOR = {
  default:  'rgba(255, 255, 255, 0.08)',
  compare:  '#D946EF',
  swap:     '#6366F1',
  sorted:   '#34D399',
};

const Visualization = forwardRef(({ arraySize = 60 }, ref) => {
  const containerRef = useRef(null);

  // Initialize DOM once
  useEffect(() => {
    const $container = $(containerRef.current);
    $container.empty();

    for (let i = 0; i < arraySize; i++) {
      $('<div>')
        .addClass('bar')
        .attr('data-index', i)
        .css({
          position:  'absolute',
          bottom:    0,
          left:      0,
          width:     `calc(100% / ${arraySize} - 2px)`,
          background: BAR_COLOR.default,
          borderRadius: '4px 4px 0 0',
          transform: `translateX(calc(${i} * 100% + ${i * 2}px))`,
          transition: 'background 80ms ease, height 120ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          willChange: 'transform, height, background',
        })
        .appendTo($container);
    }

    return () => $container.empty();
  }, [arraySize]);

  useImperativeHandle(ref, () => ({
    applySnapshot(snapshot) {
      const { array, activeIndices, operationType } = snapshot;
      const $container = $(containerRef.current);
      const $bars = $container.find('.bar');
      const max = Math.max(...array);

      $bars.each(function (i) {
        const val = array[i];
        const heightPct = (val / max) * 100;
        let color = BAR_COLOR.default;

        if (activeIndices.includes(i)) {
          color = BAR_COLOR[operationType] ?? BAR_COLOR.default;
        }

        $(this).css({
          height: `${heightPct}%`,
          background: color,
        });
      });
    },
    reset(initialArray) {
       const $bars = $(containerRef.current).find('.bar');
       const max = Math.max(...initialArray);
       $bars.each(function(i) {
         const heightPct = (initialArray[i] / max) * 100;
         $(this).css({
           height: `${heightPct}%`,
           background: BAR_COLOR.default
         });
       });
    }
  }));

  return (
    <div
      ref={containerRef}
      className="visualization-stage"
      style={{
        position: 'relative',
        width:    '100%',
        height:   '100%',
        overflow: 'hidden',
        padding: '0 10px'
      }}
    />
  );
});

export default Visualization;
