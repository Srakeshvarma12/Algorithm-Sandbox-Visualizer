import React, { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import { useChronosStore } from '../../store/useChronosStore';

export default function Editor() {
  const { userCode, setUserCode, status } = useChronosStore();

  useEffect(() => {
    Prism.highlightAll();
  }, [userCode]);

  const handleChange = (e) => {
    setUserCode(e.target.value);
  };

  return (
    <div className="code-editor-container position-relative h-100">
      <textarea
        className="editor-textarea"
        value={userCode}
        onChange={handleChange}
        spellCheck="false"
        disabled={status === 'running'}
      />
      <pre className="editor-highlight" aria-hidden="true">
        <code className="language-javascript">
          {userCode + '\n'}
        </code>
      </pre>
      
      <style jsx="true">{`
        .code-editor-container {
          background: rgba(0, 0, 0, 0.2);
          border-radius: var(--radius-md);
          overflow: hidden;
          font-family: var(--font-mono);
          border: 1px solid var(--glass-border);
        }
        .editor-textarea, .editor-highlight {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          padding: 20px;
          margin: 0;
          border: none;
          background: transparent;
          font-family: inherit;
          font-size: 14px;
          line-height: 1.5;
          tab-size: 2;
          white-space: pre-wrap;
          word-break: break-all;
          overflow-y: auto;
        }
        .editor-textarea {
          color: transparent;
          caret-color: var(--accent-indigo);
          z-index: 1;
          resize: none;
          outline: none;
        }
        .editor-highlight {
          z-index: 0;
          pointer-events: none;
        }
        pre[class*="language-"] {
          background: transparent !important;
          margin: 0 !important;
          padding: 0 !important;
        }
      `}</style>
    </div>
  );
}
