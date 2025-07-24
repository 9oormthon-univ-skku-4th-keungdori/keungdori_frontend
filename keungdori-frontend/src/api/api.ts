import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import useAuthStore from '../stores/authStore';

// 사용자 커스텀 axios 인스턴스
const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// 모든 api 요청 시 공통적으로 실행됨
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const { accessToken } = useAuthStore.getState();
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 모든 api 응답 시 공통적으로 실행됨
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const request = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !request._retry) {
            request._retry = true;

            try {
                const response = await api.post('/auth/refresh');
                const newAccessToken = response.data.accessToken;
                useAuthStore.getState().setToken(newAccessToken);
                request.headers.Authorization = `Bearer ${newAccessToken}`;

                return api(request);
            } catch (refreshError) {
                useAuthStore.getState().logout();
                window.location.href = '/';

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;