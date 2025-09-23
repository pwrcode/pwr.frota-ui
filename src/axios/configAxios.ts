import axios from "axios";

const getAxios = async () => {
    const token = JSON.parse(localStorage.getItem("PWR_TOKEN") || 'null');
    const instance = axios.create({
        // @ts-ignore
        baseURL: import.meta.env.VITE_API_URL,
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response && error.response.status === 401) {
                localStorage.removeItem("PWR_TOKEN");
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }
    );

    return instance;
}

export default getAxios;