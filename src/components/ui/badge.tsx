import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-neutral-900 text-neutral-50 hover:bg-neutral-900/80 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/80",
        secondary:
          "border-transparent bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800/80",
        destructive:
          "border-transparent bg-red-500 text-neutral-50 hover:bg-red-500/80 dark:bg-red-900 dark:text-neutral-50 dark:hover:bg-red-900/80",
        outline: "text-neutral-950 dark:text-neutral-50 dark:border-neutral-100",
        success:
          "border-transparent bg-green-500 text-white hover:bg-green-500/80",
        warning:
          "border-transparent bg-orange-500 text-white hover:bg-orange-500/80",
        blue:
          "border-transparent bg-blue-500 text-white",
        green:
          "border-transparent bg-green-500 text-white",
        yellow:
          "border-transparent bg-yellow-500 text-white",
        red:
          "border-transparent bg-red-500 text-white",
        lightGreen:
          "border-transparent bg-green-200 text-green-900 hover:bg-green-200/80",
        darkGreen:
          "border-transparent bg-green-600 text-white hover:bg-green-600/80",
        lightRed:
          "border-transparent bg-red-200 text-red-700 hover:bg-red-200/80",
        lightOrange:
          "border-transparent bg-orange-200 text-orange-700 hover:bg-orange-200/80",
        lightYellow:
          "border-transparent bg-yellow-200 text-white hover:bg-yellow-200/80",
        lightBlue:
          "border-transparent bg-blue-200 text-white hover:bg-blue-200/80",
        lightPurple:
          "border-transparent bg-purple-200 text-purple-800 hover:bg-purple-200/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
