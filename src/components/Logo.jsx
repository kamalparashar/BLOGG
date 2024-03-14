import React from 'react'

function Logo({width = '', className=''}) {
  return (
    <div className='text-xl font-bold px-2 py-2 bg-zinc-500 rounded-lg border border-zinc-600 sm:text-base m-0 px-0.5'>
      <h1>weBLOGG</h1>
    </div>
  )
}

export default Logo