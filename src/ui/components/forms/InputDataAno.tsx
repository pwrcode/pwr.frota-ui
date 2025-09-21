import { Label } from "@/components/ui/label"

export default function InputDataAno({ size, title, id, register }: any) {
    return (
        <div className={`${size ? size : "w-full"} space-y-2`}>
            <Label htmlFor={id}>
                {title}
            </Label>
            <input
                {...register}
                id={id}
                type="date"
                className="h-10 peer mt-1 block w-full border border-gray-200 dark:border-neutral-800 bg-card dark:hover:border dark:hover:border-gray-400 rounded-md shadown-sm py-2 px-3 focus:outline-none sm:text-sm dark:[&::-webkit-calendar-picker-indicator]:invert"
                // className={cn(`
                //     flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-base file:border-0 
                //     file:bg-transparent file:text-sm file:font-medium file:text-gray-200 placeholder:text-neutral-500 
                //     focus-visible:outline-none
                //     focus:border-2 hover:bg-neutral-100 hover:text-slate-800 dark:hover:text-gray-200 focus:border-white
                //     disabled:cursor-not-allowed disabled:opacity-50 md:text-sm 
                //     dark:border-slate-800 dark:bg-card dark:file:text-neutral-50 
                //     dark:placeholder:text-slate-200 dark:hover:border-white-400 dark:focus:border-white
                //     peer mt-1 shadow-sm focus:outline-none sm:text-sm dark:[&::-webkit-calendar-picker-indicator]:invert
                // `)}
            />
        </div>
    )
}
