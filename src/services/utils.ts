export const toNumberLabel = (num: number | undefined) => {
  if(!num) return "0";
  return new Intl.NumberFormat().format(num);
}

export const toNumber = (num: number | string | any) => {
  if(typeof(num) === "number") return num;
  if(typeof(num) !== "string") return undefined;
  let qtdCommaDot = 0;
  let passedDotsCommas = 0;
  let text = "";
  for (let i = 0; i < num.length; i++) {
    if(num[i] === "," || num[i] === ".") qtdCommaDot += 1;
  }    
  for (let i = 0; i < num.length; i++) {
    const lastDotComma = passedDotsCommas === (qtdCommaDot - 1);
    if(num[i] === "," || num[i] === ".") {
      if (lastDotComma) text += ".";
      passedDotsCommas += 1;
    }
    else text += num[i];
  }
  const final = Number(onlyNumbersExcept(text, "-"));
  if(!isNaN(final)) return final;
}

export const onlyNumbersExcept = (v: string, e: string) => {
  if (!v) return v
  let value = "";
  for (let i = 0; i < v.length; i++) {
    const c = v[i];
    if (c === e || c === "." || c === ",") value += c;
    else value += c.replace(/\D/g, '');
  }
  return value;
}

export const removeNonDigit = (value: string) => {
  if (value) return String(value).replace(/\D/g, '');
  return "";
}

export const removeNonDigitExcept = (v: string, e: string) => {
  if (!v) return v
  let value = "";
  for (let i = 0; i < v.length; i++) {
    const c = v[i];
    if (c === e) value += e;
    else value += c.replace(/\D/g, '');
  }
  return value;
}

export const valueWithLines = (val: string, qtdMax: number) => {
  let clean = removeNonDigit(val);
  let empty = "";
  const qtdClean = clean.length;
  const qtdUnderScore = qtdMax - qtdClean;    
  for (let i = 0; i < qtdUnderScore; i++) clean = clean + "_"; // Add underscore para completar string faltando
  for (let i = 0; i < qtdMax; i++) empty = empty + "_";        // Completa string apenas de underscore caso der problema
  if(clean.length === qtdMax) return clean;
  else if(clean.length > qtdMax) return clean.slice(0, qtdMax);
  else return empty;
}

export const replaceDotComma = (val: string | number | any) => {
  if(typeof(val) === "string" || typeof(val) === "number") {
    return String(val).replace(".", ",");
  }
  else return val;
}

export const capitalizeText = (text: string) => {
  if (!text) return "";
  const words = text.toLowerCase().split(" ");
  let final = "";
  for (let i = 0; i < words.length; i++) {
    const capital = words[i][0].toUpperCase() + words[i].slice(1);
    final += capital;
    if (i < (words.length - 1) || words.length > 1) final += " ";
  }
  return final;
}