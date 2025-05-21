import React from 'react'

function Avatar({text = '', color = '', textSize = 'text-3xl md:text-4xl', className = 'size-36'}) {  
  return (
    <div className="relative inline-block">
      <span
          className={`inline-flex items-center justify-center rounded-full border-2 transition-all duration-300 ${className}`}
          style={{ 
            backgroundColor: `${color}33`, // 33 is roughly 20% opacity
            borderColor: color, 
            boxShadow: `0 0 5px ${color}` 
          }}
        >
          <span
            className={`uppercase ${textSize} font-semibold`}
            style={{
              color: color,
              textShadow: `1px 1px 2px ${color}`,
            }}
          >
            {text}
          </span>
      </span>
    </div>
  )
}

export default Avatar