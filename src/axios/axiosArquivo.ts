import axios from "axios";

const getAxiosArquivo = async () => {
    const token = JSON.parse(localStorage.getItem("authToken") || 'null');
    const instance = axios.create({
        // @ts-ignore
        baseURL: import.meta.env.VITE_API_URL,
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
        }
    });

    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response && error.response.status === 401) {
                localStorage.removeItem("authToken");
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }
    );

    return instance;
}

export default getAxiosArquivo;