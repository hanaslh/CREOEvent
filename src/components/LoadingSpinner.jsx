const LoadingSpinner = ({ size = 'medium', text = 'Loading...', className = '' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  return (
    <div className={`loading-container ${className}`} style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div 
        className="loading-spinner"
        style={{
          width: size === 'small' ? '32px' : size === 'large' ? '64px' : '48px',
          height: size === 'small' ? '32px' : size === 'large' ? '64px' : '48px',
          border: `3px solid 606060`,
          borderTop: `3px solid #A0A0A0`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: text ? '1rem' : '0'
        }}
      ></div>
      {text && (
        <p style={{
          color: 'var(--text-light)',
          fontSize: '0.9rem',
          margin: 0
        }}>{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;