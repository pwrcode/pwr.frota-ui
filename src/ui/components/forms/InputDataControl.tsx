import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { ptBR } from 'date-fns/locale';
import { formatarData } from '@/services/date';
import { useController, type Control } from 'react-hook-form';
import { Input } from '@/components/ui/input';

interface InputDataInterface {
  title?: string,
  name: string,
  control: Control<any>,
  size?: string
  isDisabled?: boolean,
  time?: boolean
}

export default function InputDataControl({ title, name, control, size, isDisabled, time }: InputDataInterface) {
  const { field: { value, onChange } } = useController({ control, name });
  const [firstUpdate, setFirstUpdate] = useState(true);
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    var localData = data;
    var localHora = hora;

    if ((!localData || !localHora) && time) {
      onChange(undefined);
      return;
    }

    if (!time) {
      onChange(localData);
      return;
    }

    onChange(localData + "T" + localHora);
  }, [data, hora]);
  
  useEffect(() => {
    if (!value && !firstUpdate) return;
    
    setFirstUpdate(false);
    setData(value?.split("T")[0] || "");
    setHora(value?.split("T")[1] || "");
  }, [value, firstUpdate]);

  return (
    <div className={`space-y-2 ${size ?? "w-full"}`}>
      {title && (
        <Label htmlFor={name} className="text-left dark:text-foreground">
          {title}
        </Label>
      )}

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <div className='flex gap-2 '>
          <div className='flex-1'>
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
                <div className={data ? "text-foreground" : "text-neutral-400"}>
                  {data ? formatarData(data) : "Selecionar data"}
                </div>
                <CalendarIcon className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
          </div>

          {time && (
            <div>
              <Input
                autoComplete='off'
                id={name}
                type={"time"}
                className="text-[14px] dark:[color-scheme:dark]"
                disabled={isDisabled ?? false}
                value={hora}
                onChange={(value) => setHora(value.target.value)}
              // {...register}
              />
            </div>
          )}
        </div>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            captionLayout="dropdown"
            mode="single"
            locale={ptBR}
            disabled={isDisabled ?? false}
            selected={data ? new Date(data + "T00:00:00") : undefined}
            defaultMonth={data ? new Date(data + "T00:00:00") : undefined} // Abre no mês da data selecionada
            onSelect={(selectedDate) => {
              if (setData) setData(selectedDate?.toISOString().split("T")[0] || "");
              setIsOpen(false); // Fecha o popover ao selecionar a data
            }}
            autoFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
