import React from 'react'

function Button({label = '', type = 'button', className = '', ...props}) {
  return (
    <button
        type={type}
        className={`rounded bg-indigo-500 p-2 text-md font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${className}`}
        {...props}>
        {label}
    </button>
  )
}

export default Button