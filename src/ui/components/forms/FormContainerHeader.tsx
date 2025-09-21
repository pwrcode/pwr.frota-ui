import React from 'react'

type FormHeadProps = {
  title: string,
  subtitle?: string
  children?: React.ReactNode,
  childrenIsBtn?: boolean
}

export default function FormContainerHeader({ title, subtitle, children, childrenIsBtn }: FormHeadProps) {
  return (
    <>
      <div className="flex flex-row justify-between items-center p-5 relative">
        <div className="">
          <h2 className='text-md font-medium'>{title}</h2>
          {subtitle && <p className='mt-1 text-gray-500 dark:text-foreground/50 text-sm'>{subtitle}</p>}
        </div>
        {children && (
          <div className={'flex flex-row items-center ' + `${childrenIsBtn && "absolute right-5"}`}>
            {children}
          </div>
        )}
      </div>

      <hr />
    </>
  )
}