// Controla o tempo de chamada de uma função

export default function debounce(func: any, wait: any) {
    let timeout: any;
    return (...args: any) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
}