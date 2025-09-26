//import React from 'react'
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useController, type Control } from 'react-hook-form';

interface InputInterface {
    name?: string,
    title?: string,
    placeholder?: string,
    isDisabled?: boolean,
    type?: string,
    size?: string,
    style?: string,
    readOnly?: boolean,
    control: Control<any>,
}

export default function InputFiltroPesquisa({ name, title, placeholder, isDisabled, type, size, style, readOnly, control }: InputInterface) {
    const { field: { value, onChange } } = useController({ control, name: name ?? "pesquisa" });

    return (
        <div className={style ?? `space-y-2 ${size ?? "w-full"}`
        }>

            <Label htmlFor={name} className="text-right" >
                {title ?? "Pesquisar"}
            </Label>

            <Input
                autoComplete='off'
                id={name ?? "pesquisa"}
                name={name ?? "pesquisa"}
                type={type ?? "text"}
                className={` ${readOnly && " cursor-not-allowed bg-gray-100 "}`} // Estilo em uso apenas no modal de trocas senha usuario logado
                disabled={isDisabled}
                placeholder={placeholder}
                value={value}
                onChange={e => onChange && onChange(e.target.value)}
                readOnly={readOnly ?? false}
            />
        </div>
    )
}
