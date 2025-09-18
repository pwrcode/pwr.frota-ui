"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, formatISO, startOfMonth, setMonth, setYear } from "date-fns"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface MonthYearPickerProps {
  title?: string
  name: string
  date: string
  setDate: React.Dispatch<React.SetStateAction<string>>
  setValue?: (name: string, value: string) => void
  isDisabled?: boolean
}

export default function InputDataMes({ title, name, date, setDate, setValue, isDisabled }: MonthYearPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [viewDate, setViewDate] = useState<Date>(() => (date ? new Date(date) : new Date()))

  const months = Array.from({ length: 12 }, (_, i) => {
    const month = new Date()
    month.setMonth(i)
    return format(month, "MMM", { locale: ptBR })
  })

  const currentYear = viewDate.getFullYear()

  const handlePreviousYear = () => {
    setViewDate((prev) => setYear(prev, currentYear - 1))
  }

  const handleNextYear = () => {
    setViewDate((prev) => setYear(prev, currentYear + 1))
  }

  const handleSelectMonth = (monthIndex: number) => {
    const newDate = setMonth(setYear(new Date(), currentYear), monthIndex)
    const firstDayOfMonth = startOfMonth(newDate)
    const formattedDate = formatISO(firstDayOfMonth)

    setDate(formattedDate)
    if (setValue) setValue(name, formattedDate)
    setIsOpen(false)
  }

  return (
    <div className="space-y-2 w-full">
      {title && (
        <Label htmlFor={name} className="text-right">
          {title}
        </Label>
      )}

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between font-normal text-muted-foreground dark:bg-slate-800 dark:hover:bg-slate-800 dark:text-white dark:hover:border-gray-400 border-gray-300 data-[state=open]:border-blue-600 focus-visible:border-blue-600 active:border-blue-600 outline-none rounded-md px-3 py-2 transition"
            onClick={() => setIsOpen(!isOpen)}
            disabled={isDisabled}
          >
            <div className={date ? "text-foreground" : ""}>
              {date ? format(new Date(date), "MM/yyyy", { locale: ptBR }) : "Selecionar Mês/Ano"}
            </div>
            <CalendarIcon className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-3 dark:bg-slate-800">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <Button variant="outline" className="dark:bg-slate-900" size="icon" onClick={handlePreviousYear} disabled={isDisabled}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="font-medium">{currentYear}</div>
              <Button variant="outline" className="dark:bg-slate-900" size="icon" onClick={handleNextYear} disabled={isDisabled}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {months.map((month, index) => {
                const isSelected =
                  date && new Date(date).getMonth() === index && new Date(date).getFullYear() === currentYear

                return (
                  <Button
                    key={month}
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                      "h-9 bg-transparent dark:bg-slate-800", 
                      isSelected && "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700"
                    )}
                    onClick={() => handleSelectMonth(index)}
                    disabled={isDisabled}
                  >
                    {month}
                  </Button>
                )
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

