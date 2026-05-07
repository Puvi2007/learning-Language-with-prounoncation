import React from 'react';

const ProgressBar = ({ value = 0, height = 10, showLabel = false }) => {
  const pct = Math.min(100, Math.max(0, value));

  return (
    <div style={{ width: '100%' }}>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span className="text-muted" style={{ fontSize: '14px' }}>Progress</span>
          <span style={{ fontWeight: 600 }}>{pct}%</span>
        </div>
      )}
      <div className="progress-bar-track" style={{ height: `${height}px` }}>
        <div className="progress-bar-fill" style={{ width: `${pct}%` }}></div>
      </div>
    </div>
  );
};

export default ProgressBar;
