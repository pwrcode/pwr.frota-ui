export const errorMsg = (data: any, msg?: string | null) => {

  if (!data) return msg ?? "Ocorreu algum erro inesperado";

  if (data.response) {
    if (data.response.data && typeof(data.response.data) === "string") return data.response.data;

    if (data.response.data && data.response.data.mensagem && typeof(data.response.data.mensagem) === "string") {
      return data.response.data.mensagem;
    }
    
    if (data.response.data && data.response.data.statusMessage && typeof(data.response.data.statusMessage) === "string") {
      return data.response.data.statusMessage;
    }

    if (data.response.data && data.response.data.message && typeof(data.response.data.message) === "string") {
      return data.response.data.message;
    }
  }

  if (data.message && typeof(data.message) === "string") return data.message;

  if (data.mensagem && typeof(data.mensagem) === "string") return data.mensagem;

  return msg ?? "Ocorreu um erro ao processar a solicitação";
}