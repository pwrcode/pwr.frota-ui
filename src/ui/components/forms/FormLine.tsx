import React from 'react';

type FormLineProps = {
  children: React.ReactNode,
  justify?: string,
  size?: string,
  className?: string
}

export default function FormLine({ children, justify, size, className }: FormLineProps) {

  const justifyContent = justify ? `justify-${justify}` : "justify-between";

  return (
    <div className={
      className ?? `
      ${size ?? 'w-full'} 
      flex flex-col gap-2 sm:flex-row sm:${justifyContent} sm:items-end  
    `}>
      {children}
    </div>
  )
}