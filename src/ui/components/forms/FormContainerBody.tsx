import React from 'react'

export default function FormContainerBody({children}: {children: React.ReactNode}) {
  return (
    <div className='p-5 flex flex-col gap-2'>
      {children}
    </div>
  )
}
