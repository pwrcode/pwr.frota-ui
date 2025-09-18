import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { formatISO } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { ptBR } from 'date-fns/locale';
import { formatarData } from '@/services/date';

interface InputDataInterface {
  title?: string,
  name: string, 
  date: string,
  setDate?: React.Dispatch<React.SetStateAction<string>>,
  setValue?: (name: string, value: string) => void,
  size?: string
  isDisabled?: boolean,
}

export default function InputDataLabel({ title, name, date, setDate, setValue, size, isDisabled }: InputDataInterface) {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`space-y-1 ${size ?? "w-full"}`}>
      {title && (
        <Label htmlFor={name} className="text-right dark:text-white">
          {title}
        </Label>
      )}

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild className='border dark:bg-slate-800 dark:hover:bg-slate-800 dark:text-white border-gray-300 data-[state=open]:border-blue-400 focus-visible:border-blue-400 active:border-blue-400 outline-none rounded-md px-3 py-2 transition'>
          <Button
            variant="data"
            size="lg"
            id={name}
            name={name}
            className="w-full justify-between font-normal dark:text-white text-neutral-500 col-span-3"
            onClick={() => setIsOpen(!isOpen)}
            disabled={isDisabled ?? false}
          >
            <div className={date ? "text-black dark:text-white" : ""}>
              {date ? formatarData(date) : "Selecionar data"}
            </div>
            <CalendarIcon className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0 dark:text-white">
          <Calendar
            className="border-2 border-blue-600 dark:bg-slate-800 dark:border-gray-400 dark:text-white rounded-md"
            mode="single"
            locale={ptBR}
            disabled={isDisabled ?? false}
            selected={date ? new Date(date) : undefined}
            defaultMonth={date ? new Date(date) : undefined} // Abre no mês da data selecionada
            onSelect={(selectedDate) => {
              if (setDate) setDate(selectedDate ? formatISO(selectedDate) : "");
              if (setValue) setValue(name, selectedDate ? formatISO(selectedDate) : "");
              setIsOpen(false); // Fecha o popover ao selecionar a data
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
