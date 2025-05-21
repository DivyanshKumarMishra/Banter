import React from 'react'

function Tooltip({ content = '', children, bgColor = 'bg-black', textColor = 'text-white', position = 'top' }) {
  const positionClassMap = {
    top: 'bottom-full mb-1',
    bottom: 'top-full mt-1',
    left: 'right-full mr-1',
    right: 'left-full ml-1',
  }

  const positionClasses = positionClassMap[position] || 'bottom-full mb-1'

  return (
    <div className="relative flex flex-col items-center group">
      {children}
      <div className={`absolute ${positionClasses} hidden flex-col items-center group-hover:flex`}>
        <span className={`relative z-10 rounded-md px-2 py-1.5 text-sm whitespace-nowrap ${bgColor} ${textColor}`}>
          {content}
        </span>
      </div>
    </div>
  )
}

export default Tooltip