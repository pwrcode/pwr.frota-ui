import { currency } from "./currency";
import { removeNonDigit } from "./utils"; 

export const formatMaskDinheiro = (val: string | undefined) => {
  if(!val) return "";
  let a = "0";
  let b = "0";
  if(val.length === 1) b = `0${val}`;
  else if(val.length === 2) b = `${val}`;
  else {
    a = val.slice(0,-2);
    b = val.slice(-2);
  }
  const final = Number(`${a}.${b}`);
  return currency(final);
}

export const formatMaskCpf = (c: string) => {
  if (!c) return "";
  const l = c.length;
  if (l <= 3) return c;
  if (l > 3 && l <= 6) return c.replace(/(\d{3})(\d)/, "$1.$2");
  if (l > 6 && l <= 9) return c.replace(/(\d{3})(\d{3})(\d)/, "$1.$2.$3");
  if (l > 9) return c.slice(0, 11).replace(/(\d{3})(\d{3})(\d{3})(\d)/, "$1.$2.$3-$4");
}

export const formatMaskCnpj = (c: string) => {
  if (!c) return "";
  const l = c.length;
  if (l <= 2) return c;
  if (l > 2 && l <= 5) return c.replace(/(\d{2})(\d)/, '$1.$2');
  if (l > 5 && l <= 8) return c.replace(/(\d{2})(\d{3})(\d)/, '$1.$2.$3');
  if (l > 8 && l <= 12) return c.replace(/(\d{2})(\d{3})(\d{3})(\d)/, '$1.$2.$3/$4');
  if (l > 12) return c.slice(0, 14).replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d)/, '$1.$2.$3/$4-$5');
}

export const formatMaskCpfCnpj = (c: string) => {
  if (!c) return "";
  if (c.length === 11) return formatMaskCpf(c);
  if (c.length === 14) return formatMaskCnpj(c);
  return c;
}

export const formatMaskCep = (c: string) => {
  if (!c) return "";
  c = c.replace(/\D/g, "");
  c = c.replace(/(\d{5})(\d)/, "$1-$2");
  return c;
}

export const formatMaskTelefone = (t: string) => {
  if (!t) return "";
  const l = t.length;
  if (l > 4 && l <= 8) return t.replace(/(\d{4})(\d)/, '$1-$2');
  return t;
}

export const formatMaskCelular = (c: string) => {
  if (!c) return "";
  const l = c.length;
  if (l <= 2) return c.replace(/(\d)/, '($1');
  if (l > 2 && l <= 6) return c.replace(/(\d{2})(\d)/, '($1) $2');
  if (l > 6 && l <= 10) return c.replace(/(\d{2})(\d{4})(\d)/, '($1) $2-$3');
  if (l === 11) return c.replace(/(\d{2})(\d{5})(\d)/, '($1) $2-$3');
  return c;
}

export const formatMaskPorcetagem = (before: string | undefined, after: string) => {
  if (!after) return "";
  if (after && after.length > 1 && !after.includes("%")) {  // isso é: está tentando apagar o último caractere
    const val = onlyNumbersComma(after);
    return `${val.substring(0, val.length - 1)} %`;
  }
  after = onlyNumbersComma(after.replace(".", ","));
  if (after === ",") return " %"
  if (!after.includes(",")) return `${removeNonDigit(after)} %`;      // se afeter não tem virgula, retornar valor limpo  
  if (!before || before === "") return "%";                           // se after tem vírgula, mas before está vazio, isso é: after = ",", returnar vazio
  if (!before.includes(",")) return `${onlyNumbersComma(after)} %`;   // se after tem virgurla e before nao, retornar after com virgula
  // se before e after tem virgula....
  const parts = onlyNumbersComma(after).split(",");
  const a = parts[0];
  const b = parts[1].slice(0,2);                                      // (0,2)... 2 = tamanho máximo casas decimais
  return `${a},${b} %`;
}

const onlyNumbersComma = (v: string) => {
  return v.split('').filter(char => /\d/.test(char) || char === ",").join('');
}

export const formatMaskNumerico = (v: string | undefined | null) => {
  if(!v) return "";
  return v.replace(/\D/g, "");
}