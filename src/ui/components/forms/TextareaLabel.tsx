//import React from 'react'
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface InputInterface {
  name: string,
  title?: string,
  placeholder?: string,
  disabled?: boolean,
  type?: string,
  register: any,
  min?: number,
  step?: string,
  size?: string,
  readOnly?: boolean
}

export default function TextareaLabel({name, title, placeholder, disabled, type , min, register, step, size, readOnly}: InputInterface) {
  return (
    <div className={`space-y-2 ${size ?? "w-full"}`}>
      {title && (
        <Label htmlFor={name} className="text-right">
          {title}
        </Label>
      )}
      <Textarea
        autoComplete='off'
        min={min}
        id={name}
        type={type ?? "text"}
        step={step}
        className="text-[14px]"
        disabled={disabled}
        placeholder={placeholder}
        readOnly={readOnly}
        {...register}
      />
    </div>
  )
}
