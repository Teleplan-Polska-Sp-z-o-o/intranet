import axios from "axios";
import { useUserStore } from "../../stores/userStore";
import { useRouter } from "vue-router";
import { nodeConfig } from "../env";

const jwtAxios = axios.create({
  baseURL: `${nodeConfig.origin}:${nodeConfig.port}`,
});

jwtAxios.interceptors.request.use(
  (config) => {
    const userStore = useUserStore();
    const token = userStore.getToken();

    if (!token) {
      const router = useRouter();
      router.push({ path: `/` });
      console.error(`Cannot create jwtAxios instance, token evaluates to false at userStore.`);
    }
    config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

jwtAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const router = useRouter();
    if (error.response && error.response.status === 401) {
      router.push({ path: `/` });
      console.error(`Unauthorized access - redirecting to login page`);
    }
    return Promise.reject(error);
  }
);

export default jwtAxios;
