import React from 'react'

function TopBar() {
  const currentTime = new Date().toLocaleTimeString('en-CA', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  })

  return (
    <div className="absolute top-0 left-0 right-0 h-14 bg-black/20 backdrop-blur-sm border-b border-white/10 flex items-center justify-between px-4 z-30">
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-red-600 rounded-md flex items-center justify-center">
          <span className="text-white font-bold text-xs">C+</span>
        </div>
        <span className="font-semibold text-white text-sm">Canada+</span>
      </div>
      
      <div className="text-white text-sm font-medium">
        {currentTime}
      </div>
    </div>
  )
}

export default TopBar