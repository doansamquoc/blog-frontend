import type { AxiosInstance, AxiosRequestConfig } from "axios";
import axios from "axios";
import type { SignupRequest } from "./request/SignupRequest";
import type { checkUsernameRequest } from "./request/CheckUsernameRequest";
import type { CheckEmailAddressRequest } from "./request/CheckEmaillAddressRequest";
import type { SigninRequest } from "./request/SigninRequest";
import { tokenStore } from "@/store/tokenStore";

const BASE_URL = "http://localhost:8080";
const USER_PATH = "/api/users";
const AUTH_PATH = "/api/auth";

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

api.interceptors.request.use((config) => {
  const token = tokenStore.get();
  console.log(token);
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let queuedRequests: Array<(token: string) => void> = [];

api.interceptors.response.use(
  (res) => res,

  async (error) => {
    console.log(error);
    const original = error.config;

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Nếu lỗi đến từ /auth/refresh → logout
    if (original.url.includes("/auth/refresh")) {
      tokenStore.clear();
      return Promise.reject(error);
    }

    // Ngăn retry vô hạn
    if (original._retry) {
      tokenStore.clear();
      return Promise.reject(error);
    }
    original._retry = true;

    // Nếu đang refresh → đợi
    if (isRefreshing) {
      return new Promise((resolve) => {
        queuedRequests.push((newToken) => {
          original.headers.Authorization = `Bearer ${newToken}`;
          resolve(api(original));
        });
      });
    }

    // Thực hiện refresh
    isRefreshing = true;
    try {
      const refreshRes = await authApi.refresh();
      const newToken = refreshRes.data.data.accessToken;

      tokenStore.set(newToken);

      queuedRequests.forEach((cb) => cb(newToken));
      queuedRequests = [];

      original.headers.Authorization = `Bearer ${newToken}`;
      return api(original);
    } catch (err) {
      tokenStore.clear();
      queuedRequests = [];
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

function handleAxiosError(e: any) {
  if (e.response) {
    const { status, data } = e.response;
    return Promise.reject({
      status,
      ...data,
    });
  }
  if (e.request) return Promise.reject({ message: "No response from server" });
  return Promise.reject({ message: e.message });
}

export async function get<T = any>(url: string, config?: AxiosRequestConfig) {
  try {
    const res = await api.get<T>(url, config);
    return res.data;
  } catch (e) {
    return handleAxiosError(e);
  }
}

export async function post<T = any, B = any>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig
) {
  try {
    return await api.post<T>(url, body, config);
  } catch (e) {
    return handleAxiosError(e);
  }
}

export async function put<T = any, B = any>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig
) {
  try {
    const res = await api.put<T>(url, body, config);
    return res.data;
  } catch (e) {
    return handleAxiosError(e);
  }
}

export async function del<T = any>(url: string, config?: AxiosRequestConfig) {
  try {
    const res = await api.delete<T>(url, config);
    return res.data;
  } catch (e) {
    return handleAxiosError(e);
  }
}

export const userApi = {
  checkUsername: (payload: checkUsernameRequest) =>
    post(`${USER_PATH}/check-username`, payload),
  checkEmailAddress: (payload: CheckEmailAddressRequest) =>
    post(`${USER_PATH}/check-email`, payload),
};

export const authApi = {
  signin: (payload: SigninRequest) => post(`${AUTH_PATH}/sign-in`, payload),

  signup: (payload: SignupRequest) => post(`${AUTH_PATH}/sign-up`, payload),

  refresh: () => get(`${AUTH_PATH}/refresh`),
};

export default api;
