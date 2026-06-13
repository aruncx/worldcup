import React from 'react';

interface TeamFlagProps {
  flag?: string;
  name?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function TeamFlag({ flag, name, className, style }: TeamFlagProps) {
  if (!flag) return null;

  const isUrl = 
    flag.startsWith('http://') || 
    flag.startsWith('https://') || 
    flag.startsWith('/') || 
    flag.includes('.') || 
    flag.includes('/');

  if (isUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={flag}
        alt={name ? `${name} flag` : 'flag'}
        className={className}
        style={{
          width: '24px',
          height: '16px',
          objectFit: 'contain',
          borderRadius: '2px',
          display: 'inline-block',
          verticalAlign: 'middle',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          ...style
        }}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
    );
  }

  return (
    <span 
      className={className} 
      style={{ 
        display: 'inline-block', 
        verticalAlign: 'middle', 
        lineHeight: 1,
        ...style 
      }}
    >
      {flag}
    </span>
  );
}
