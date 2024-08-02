import axios from "axios";
import { useUserStore } from "../../stores/userStore";
import { useRouter } from "vue-router";
import { nodeConfig } from "../env";

const jwtAxios = axios.create({
  baseURL: `${nodeConfig.origin}:${nodeConfig.port}`,
  headers: {
    "Content-Type": "application/json",
  },
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

export default jwtAxios;
