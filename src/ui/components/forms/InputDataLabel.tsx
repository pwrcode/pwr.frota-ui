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
    <div className={`space-y-2 ${size ?? "w-full"}`}>
      {title && (
        <Label htmlFor={name} className="text-left dark:text-foreground">
          {title}
        </Label>
      )}

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="data"
            size="lg"
            id={name}
            name={name}
            className="w-full justify-between font-normal text-foreground col-span-3"
            onClick={() => setIsOpen(!isOpen)}
            disabled={isDisabled ?? false}
          >
            <div className={date ? "text-foreground" : "text-neutral-400"}>
              {date ? formatarData(date) : "Selecionar data"}
            </div>
            <CalendarIcon className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            captionLayout="dropdown"
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
            autoFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
