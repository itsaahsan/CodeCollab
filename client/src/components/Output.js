import React from 'react';
import './Output.css';

function Output({ result, onClose }) {
  return (
    <div className="output-container">
      <div className="output-header">
        <h3>Output</h3>
        <button onClick={onClose}>✕</button>
      </div>

      <div className="output-content">
        {result.success ? (
          <div className="output-success">
            <pre>{result.output}</pre>
            <div className="execution-time">
              Executed in {result.executionTime}ms
            </div>
          </div>
        ) : (
          <div className="output-error">
            <div className="error-message">{result.error}</div>
            {result.stack && (
              <pre className="error-stack">{result.stack}</pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Output;
