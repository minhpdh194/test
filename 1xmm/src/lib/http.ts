import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { JSEncrypt } from 'jsencrypt';
import CryptoJS from "crypto-js";

declare module "axios" {
  export interface AxiosInstance {
    $get: <T>(url: string, config?: AxiosRequestConfig) => Promise<T>;
  }
}

const token = localStorage.getItem("token");
const publicKey = import.meta.env.VITE_SECRET_KEY;
const aesKey = CryptoJS.lib.WordArray.random(32);
const iv = CryptoJS.lib.WordArray.random(16);

function encryptAES(data: any) {
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), aesKey, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
}

// const encryptData = (data: any) => {
//   const oHeader = { alg: 'HS256', typ: 'JWT' };
//   const sHeader = JSON.stringify(oHeader);
//   const sPayload = JSON.stringify(data);
//   const jwtLib = KJUR as any;
//   const jwtEncodedData = jwtLib.jws.JWS.sign("HS256", sHeader, sPayload, SECRET_KEY);
//   return jwtEncodedData;
// }
function encryptAESKeyWithRSA() {
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(publicKey);
  return encryptor.encrypt(CryptoJS.enc.Base64.stringify(aesKey));
}

function encryptData(data: any) {
  return {
    encryptedAESKey: encryptAESKeyWithRSA(),
    iv: CryptoJS.enc.Base64.stringify(iv),
    encryptedData: encryptAES(data),
  };
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
