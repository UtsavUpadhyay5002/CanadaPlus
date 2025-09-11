import React from 'react';

function StateMessage({ type, text, onRetry }) {
  const getIcon = () => {
    switch (type) {
      case 'loading':
        return <span className="loading-spinner">⏳</span>;
      case 'error':
        return '❌ ';
      case 'info':
        return 'ℹ️ ';
      default:
        return '';
    }
  };

  return (
    <div className={`state-message ${type}`}>
      <p className="state-message-text">
        {getIcon()}
        {text}
      </p>
      {type === 'error' && onRetry && (
        <button 
          className="state-message-button"
          onClick={onRetry}
          type="button"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export default StateMessage;