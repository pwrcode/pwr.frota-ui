import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FieldValues, UseFormSetValue } from "react-hook-form";

type propsType = {
  name: string,
  options: {value: any, label: string}[],
  setValue: UseFormSetValue<FieldValues>,
  register: any
}

export const RadioButtons = ({name, options, setValue, register}: propsType) => {
  //
  return (
    <>
      {options.map(option => {
        //
        return (
          <div className="flex items-center space-x-2" key={option.value}>
            <Input
              type="radio"
              name={name}
              value={option.value}
              {...register}
              className={cn(
                "aspect-square h-4 w-4 rounded-full border border-neutral-900 text-neutral-900 ring-offset-white focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-900 dark:text-neutral-50 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300"
              )}
            />
            <Label onClick={() => setValue(name, option.value)}>{option.label}</Label>
          </div>
        )
      })}
    </>
  )
}