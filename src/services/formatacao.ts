export const formatarCpfCnpj = (cpfCnpj: string) => {
  if (!cpfCnpj) return "";
  if (cpfCnpj.length === 11) {
    return cpfCnpj.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  } else if (cpfCnpj.length === 14) {
    return cpfCnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  } else
    return "";
}

export const formatarCelular = (c: string) => {
  if (!c) return "";
  const l = c.length;
  if (l <= 2) return c.replace(/(\d)/, '($1');
  if (l > 2 && l <= 6) return c.replace(/(\d{2})(\d)/, '($1) $2');
  if (l > 6 && l <= 10) return c.replace(/(\d{2})(\d{4})(\d)/, '($1) $2-$3');
  if (l === 11) return c.replace(/(\d{2})(\d{5})(\d)/, '($1) $2-$3');
  return c
}

export const formatarCep = (c: string) => {
  if (!c) return "";
  c = String(c).replace(/\D/g, "").slice(0, 8);
  c = c.replace(/(\d{5})(\d)/, "$1-$2");
  return c
}

export const formatarPercentual = (valor: number | null) => {
  if (!valor) return "0 %";
  return `${String(valor * 100).replace(".", ",")} %`
}

/*
export const formatDateAPI = (d: string | undefined | null) => {
  if (!d) return undefined
  const n = d.replace(/-/g, "/");
  return formatISO(n) ?? undefined;
}
*/
export const formatarDataParaAPI = (data: string | undefined | null) => {
  if (!data) return "";

  if(data.includes("T"))
    return data;

  return data.slice(0, 11).concat("T00:00:00");
}
