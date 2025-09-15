//import React from 'react'
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface InputInterface {
  name: string,
  title?: string,
  placeholder?: string,
  isDisabled?: boolean,
  type?: string,
  value: any,
  setValue?: React.Dispatch<React.SetStateAction<any>>,
  size?: string,
  style?: string,
  readOnly?: boolean
}

export default function InputLabelValue({name, title, placeholder, isDisabled, type, value, setValue, size, style, readOnly}: InputInterface) {
  return (
    <div className={style ?? `space-y-1 ${size ?? "w-full"}`}>
      {title && (
        <Label htmlFor={name} className="text-right">
          {title}
        </Label>
      )}
      <Input
        autoComplete='off'
        id={name}
        name={name}
        type={type ?? "text"}
        className={` ${readOnly && " cursor-not-allowed bg-gray-100 "}`} // Estilo em uso apenas no modal de trocas senha usuario logado
        disabled={isDisabled}
        placeholder={placeholder}
        value={value}
        onChange={e => setValue && setValue(e.target.value)}
        readOnly={readOnly ?? false}
      />
    </div>
  )
}
