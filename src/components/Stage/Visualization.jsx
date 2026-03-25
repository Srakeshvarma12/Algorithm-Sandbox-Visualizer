import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import $ from 'jquery';

const BAR_COLOR = {
  default:  'rgba(99, 102, 241, 0.38)',
  compare:  'rgba(149, 160, 255, 0.95)',
  swap:     'rgba(217, 70, 239, 0.9)',
  sorted:   'rgba(52, 211, 153, 0.6)',
};

const Visualization = forwardRef(({ arraySize = 64 }, ref) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const $container = $(containerRef.current);
    $container.empty();

    for (let i = 0; i < arraySize; i++) {
      $('<div>')
        .addClass('bar')
        .css({
          flex: 1,
          height: '0%',
          background: BAR_COLOR.default,
          borderRadius: '2px 2px 0 0',
          transition: 'height .04s linear, background .06s linear',
          minWidth: '2px',
          margin: '0 0.75px'
        })
        .appendTo($container);
    }
  }, [arraySize]);

  useImperativeHandle(ref, () => ({
    applySnapshot(snapshot) {
      const { array, activeIndices, operationType } = snapshot;
      const $bars = $(containerRef.current).find('.bar');
      const max = Math.max(...array);

      $bars.each(function (i) {
        const heightPct = Math.round((array[i] / max) * 90);
        let color = BAR_COLOR.default;
        let shadow = 'none';

        if (activeIndices.includes(i)) {
          color = BAR_COLOR[operationType] ?? BAR_COLOR.default;
          shadow = operationType === 'swap' ? '0 0 10px rgba(217,70,239,.7)' : '0 0 8px rgba(99,102,241,.6)';
        }

        $(this).css({
          height: `${heightPct}%`,
          background: color,
          boxShadow: shadow
        });
      });
    },
    reset(initialArray) {
       const $bars = $(containerRef.current).find('.bar');
       const max = Math.max(...initialArray);
       $bars.each(function(i) {
         $(this).css({
           height: `${Math.round((initialArray[i] / max) * 90)}%`,
           background: BAR_COLOR.default,
           boxShadow: 'none'
         });
       });
    }
  }));

  return (
    <div
      ref={containerRef}
      className="d-flex align-items-flex-end h-100 w-100"
      style={{ alignItems: 'flex-end' }}
    />
  );
});

export default Visualization;
