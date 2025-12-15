import { getAuthData } from '@lib/session';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api',
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const authData = getAuthData();

    if (authData && authData.accessToken) {
      config.headers.Authorization = `Bearer ${authData.accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
