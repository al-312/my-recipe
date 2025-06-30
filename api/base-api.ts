import axios from "axios";
import {API_KEY, BASE_URL} from "@/constants/variables";

export const baseApi = axios.create({
    baseURL: BASE_URL,
    headers:{
        "x-api-key": API_KEY,
    },
    timeout: 10000,
})

baseApi.interceptors.request.use(
    (config) => {

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
