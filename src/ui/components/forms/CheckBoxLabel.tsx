import { Label } from '@/components/ui/label';
import { cn } from "@/lib/utils";

interface CheckBoxInterface {
  name: string;
  title?: string;
  register?: any
  isDisabled?: boolean;
  readOnly?: boolean;
  value?: boolean; // adicionar isso se quiser controlar externamente
}

export const CheckBoxLabel = ({
  name,
  title,
  register,
  isDisabled,
  readOnly,
  value
}: CheckBoxInterface) => {
  return (
    <div className="space-y-2">
      <div className="flex gap-2 items-center">
        <input
          type="checkbox"
          id={name}
          name={name}
          ref={register && register.ref}
          checked={value}
          onBlur={register && register.onBlur}
          readOnly={readOnly}
          onChange={(e) => {
            if (!readOnly && register) {
              register.onChange(e);
            }
          }}
          disabled={isDisabled}
          className={cn(`
            accent-blue-600
            peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
            disabled:cursor-not-allowed disabled:opacity-50 
            data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground
          `)}
        />
        {title && <Label htmlFor={name} className="text-left">{title}</Label>}
      </div>
    </div>
  );
};