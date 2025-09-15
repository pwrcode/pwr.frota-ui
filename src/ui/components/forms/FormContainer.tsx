import React from 'react';

type props = {
  children: React.ReactNode,
  size?: string
}

export default function FormContainer({children, size}: props) {
  return (
    <div className={`
      ${size ?? "w-full"}
      bg-white rounded-lg shadow dark:bg-slate-800/50 dark:border-slate-600 dark:text-white
    `}>
      {children}
    </div>
  )
}
