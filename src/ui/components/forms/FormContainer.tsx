import React from 'react';

type props = {
  children: React.ReactNode,
  size?: string
}

export default function FormContainer({children, size}: props) {
  return (
    <div className={`
      ${size ?? "w-full"}
      bg-white rounded-lg shadow dark:bg-card/50 dark:border-border dark:text-foreground
    `}>
      {children}
    </div>
  )
}
