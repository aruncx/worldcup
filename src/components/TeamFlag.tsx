import React from 'react';

interface TeamFlagProps {
  flag?: string;
  name?: string;
  size?: number; // logical height in px; width = size * 1.5 (standard flag ratio)
  className?: string;
  style?: React.CSSProperties;
}

export default function TeamFlag({ flag, name, size = 20, className, style }: TeamFlagProps) {
  if (!flag) return null;

  const isUrl = 
    flag.startsWith('http://') || 
    flag.startsWith('https://') || 
    flag.startsWith('/') || 
    flag.includes('.') || 
    flag.includes('/');

  if (isUrl) {
    const h = size;
    const w = Math.round(size * 1.5);
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={flag}
        alt={name ? `${name} flag` : 'flag'}
        className={className}
        style={{
          width: `${w}px`,
          height: `${h}px`,
          objectFit: 'contain',
          borderRadius: '3px',
          display: 'inline-block',
          verticalAlign: 'middle',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          flexShrink: 0,
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
