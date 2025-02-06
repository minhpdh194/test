import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import KJUR from 'jsrsasign';

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

declare module "axios" {
  export interface AxiosInstance {
    $get: <T>(url: string, config?: AxiosRequestConfig) => Promise<T>;
  }
}

const token = localStorage.getItem("token");

const encryptData = (data: any) => {
  const oHeader = { alg: 'HS256', typ: 'JWT' };
  const sHeader = JSON.stringify(oHeader);
  const sPayload = JSON.stringify(data);
  const jwtLib = KJUR as any;
  const jwtEncodedData = jwtLib.jws.JWS.sign("HS256", sHeader, sPayload, SECRET_KEY);
  return jwtEncodedData;
}

const $http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : null,
  },
});

$http.$get = async <T>(url: string, config?: AxiosRequestConfig) => {
  const response = await $http.get<T>(url, config);
  return response.data;
};

$http.interceptors.request.use(
  (config) => {
    if (config.method !== 'get' && config.data) {
      const encryptedData = encryptData(config.data);
      config.data = encryptedData;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

$http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.reload();
    }

    return Promise.reject(error);
  }
);

const setBearerToken = (token: string) => {
  localStorage.setItem("token", token);
  $http.defaults.headers.Authorization = `Bearer ${token}`;
};

export { $http, setBearerToken };
