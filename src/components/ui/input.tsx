import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
          `flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-base file:border-0 
           file:bg-transparent file:text-sm file:font-medium file:text-neutral-950 placeholder:text-neutral-500 
           focus-visible:outline-none focus-visible:ring-0
           focus:border-2 hover:bg-neutral-100 focus:border-blue-600 
           disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:text-white
           dark:border-neutral-800 dark:bg-slate-800 dark:file:text-neutral-50 
           dark:placeholder:text-neutral-400 dark:hover:border-gray-400 dark:focus:border-white`,
        className
      )}
      {...props}
    />
  )
}

export { Input }
