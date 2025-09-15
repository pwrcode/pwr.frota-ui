export const currency = (value: number | string | undefined) => {
  const zero = 0;
  const valueZero = zero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const numVal = Number(value);

  if (isNaN(numVal)) return valueZero;
  if (value) return numVal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  else return valueZero;
}