import { formatISO } from 'date-fns';

export const formatarData = (isoDate: string, format = 'dd/mm/yyyy') => {
  if (!isoDate || isoDate === "") return "";
  const d = isoDate.includes("T")
    ? new Date(isoDate.replace("Z", ""))
    : new Date(+isoDate.split("T")[0].split("-")[0], +isoDate.split("T")[0].split("-")[1], +isoDate.split("T")[0].split("-")[2]);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  if (format === 'dd/mm/yyyy') {
    return `${day}/${month}/${year}`;
  } else if (format === 'mm/dd/yyyy') {
    return `${month}/${day}/${year}`;
  } else if (format === 'yyyy-mm-dd') {
    return `${year}-${month}-${day}`;
  } else if (format === 'dd/mm/yyyy hh:mm') {
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } else if (format === 'dd/mm/yyyy hh:mm:ss') {
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  } else if (format === 'yyyy-mm-dd hh:mm:ss') {
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } else {
    return isoDate;
  }
}

export const dateCurrent = () => {
  const date = new Date();
  return formatISO(date);
}

export const dateDiaMesAno = (data: string | number | null) => {
  if (!data) return "";
  const formatter = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  const formattedDate = formatter.format(new Date(data));
  return formattedDate;
}

export const dateHoraMinSec = (data: string | number | null) => {
  if (!data) return "";
  const formatter = new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: 'numeric'
  });
  const formattedDate = formatter.format(new Date(data));
  return formattedDate;
}

export const dateHoraMin = (data: string | number | null) => {
  if (!data) return "";
  const formatter = new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });
  const formattedDate = formatter.format(new Date(data));
  return formattedDate;
}

export const firstDayOfYear = () => {
  const actualDate = new Date();
  return formatISO(new Date(actualDate.getFullYear(), 0, 1));
};

export const firstDayOfMonth = () => {
  const actualDate = new Date();
  return formatISO(new Date(actualDate.getFullYear(), actualDate.getMonth(), 1));
};

export const lastDayOfMonth = () => {
  const actualDate = new Date();
  return formatISO(
    new Date(actualDate.getFullYear(), actualDate.getMonth() + 1, 0)
  );
};

export const dateMonthAgo = () => {
  const actualDate = new Date();
  return formatISO(new Date(actualDate.getFullYear(), actualDate.getMonth() - 1, actualDate.getDate()));
}

export const getDateMonthAgo = (date: string) => {
  const cDate = new Date(date);
  return formatISO(new Date(cDate.getFullYear(), cDate.getMonth() - 1, cDate.getDate()));
}

export const nomesMeses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export const mesAno = (date: string) => {
  if (!date) return "";
  const n = new Date(date);
  const mes = n.getUTCMonth();
  const ano = n.getUTCFullYear();
  return `${nomesMeses[mes]}/${ano}`;
}

export const subtractMonth = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const newDate = new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());
  return formatISO(newDate);
}

export const dateDaysDifference = (first: string, last: string) => {
  const firstDate = new Date(first);
  const secondDate = new Date(last);
  // data em ms para melhor comparacao
  const firstDateInMs = firstDate.getTime();
  const secondDateInMs = secondDate.getTime();
  // diferenca das datas em ms
  const differenceBtwDates = secondDateInMs - firstDateInMs;
  // quantos ms em um dia
  const aDayInMs = 24 * 60 * 60 * 1000;
  // diferenca em dias
  const daysDiff = Math.round(differenceBtwDates / aDayInMs);
  return daysDiff;
}