import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { formatMaskCelular, formatMaskCep, formatMaskCnpj, formatMaskCpf, formatMaskDinheiro, formatMaskNumerico, formatMaskPorcetagem, formatMaskTelefone, formatMaskPlaca } from "@/services/mask";

export enum Masks {
  dinheiro = "R$",
  cpf = "___.___.___-__",
  cnpj = "__-___-___/____-__",
  cep = "_____-___",
  telefone = "____-____",
  celular = "(__) _____-____",
  porcentagem = "%",
  numerico = "",
  placa = "___-____"
}

interface InputInterface {
  name: string,
  mask: Masks,
  value?: string | number,
  setValue: any,
  title?: string,
  disabled?: boolean,
  register?: any,
  type?: string,
  size?: string,
  placeholder?: string
}

export const InputMaskLabel = ({name, title, type, size, disabled, register, mask, value, setValue, placeholder}: InputInterface) => {
  
  // @ts-ignore
  const [valueInput, setValueInput] = useState<string>();

  useEffect(() => {
    if (value === "" || value === 0 || !value ) setValueInput("");
  }, [value]);

  const changeValue = (e: string) => {
    const limpo:string = e.replace(/\D/g, '');
    const limpoZero:string = e.replace(/\D/g, '').replace(/^0+(?=\d)/, '');

    if(mask === Masks.dinheiro) {
      if(limpoZero.length > 14) return
      setValue(name, formatMaskDinheiro(limpoZero));
      setValueInput(formatMaskDinheiro(limpoZero));
    }
    if(mask === Masks.cpf) {
      //if(limpo.length > 14) return
      setValue(name, formatMaskCpf(limpo));
      setValueInput(formatMaskCpf(limpo));
    }
    if(mask === Masks.cnpj) {
      //if(limpo.length > 14) return
      setValue(name, formatMaskCnpj(limpo));
      setValueInput(formatMaskCnpj(limpo));
    }
    if(mask === Masks.cep) {
      if(limpo.length > 8) return
      setValue(name, formatMaskCep(limpo));
      setValueInput(formatMaskCep(limpo));
    }
    if(mask === Masks.telefone) {
      if(limpo.length > 8) return
      setValue(name, formatMaskTelefone(limpo));
      setValueInput(formatMaskTelefone(limpo));
    }
    if(mask === Masks.celular) {
      if(limpo.length > 11) return
      setValue(name, formatMaskCelular(limpo));
      setValueInput(formatMaskCelular(limpo));
    }
    if(mask === Masks.porcentagem) {
      setValue(name, formatMaskPorcetagem(valueInput, e));
      setValueInput(formatMaskPorcetagem(valueInput, e));
    }
    if(mask === Masks.numerico) {
      setValue(name, formatMaskNumerico(limpo));
      setValueInput(formatMaskNumerico(limpo));
    }
    if(mask === Masks.placa) {
      setValue(name, formatMaskPlaca(e));
      setValueInput(formatMaskPlaca(e));
    }
  }

  const sizeDiv = size && size !== "" ? size : 'w-full';

  return (
    <div className={`space-y-2 ${sizeDiv}`}>
      {title && (
        <Label htmlFor={name}>
          {title}
        </Label>
      )}
      <Input
        id={name}
        name={name}
        type={type ?? "text"}
        className="col-span-3"
        disabled={disabled}
        placeholder={placeholder ?? mask}
        {...register}
        value={value ?? ""}
        onChange={e => changeValue(e.target.value)}
      />
    </div>
  )
}