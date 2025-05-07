import { defineStore } from "pinia";
import { ref } from "vue";
import { IUserEntity } from "../interfaces/user/IUserEntity";
import { UserEntity } from "../models/user/UserEntity";
import { UserTokenManager } from "../models/user/UserTokenManager";
// import { useRouter } from "vue-router";

export const useUserStore = defineStore("user", () => {
  const user = ref<IUserEntity>(new UserEntity());
  const userToken = ref<string>("");

  const set = (data: UserEntity): boolean => {
    try {
      user.value = new UserEntity().buildFromUserEntity(data);

      localStorage.setItem("user", JSON.stringify(user.value));

      return true;
    } catch (error) {
      return false;
    }
  };

  const setToken = (token: string): boolean => {
    try {
      if (!token) throw new Error("Token at setToken evaluates to empty string");

      userToken.value = token;
      localStorage.setItem("token", userToken.value);

      return true;
    } catch (error) {
      return false;
    }
  };

  const info = (): IUserEntity | false => {
    try {
      const json: string | null = localStorage.getItem("user");
      if (!json) return false;
      // if (!json) {
      //   throw new Error(
      //     `(Empty object) User object evaluates to empty object. Redirecting to login page.`
      //   );
      // }

      const user: IUserEntity = JSON.parse(json);
      return user;
    } catch (error: unknown) {
      console.error("Error retrieving user info:", error);
      // if (error instanceof Error && error.message.startsWith("(Empty object)")) {
      //   useRouter().push({ path: `/` });
      //   throw new Error(error.message);
      // }
      return false;
    }
  };

  const isEmptyState = (developerUsername: string) => {
    const user: IUserEntity | false = info();
    if (!user) return true;
    return developerUsername !== user.username;
  };

  const getToken = (): string | false => {
    try {
      const token: string | null = localStorage.getItem("token");
      if (!token) return false;
      return token;
    } catch (error) {
      console.error("Error retrieving user token:", error);
      return false;
    }
  };

  const verifyToken = async (): Promise<boolean> => {
    try {
      const token: string | false = useUserStore().getToken();
      if (!token) {
        console.error("No token found");
        userToken.value = "";
        localStorage.setItem("token", "");
        return false;
      }

      const tokenManager = new UserTokenManager();
      const response = await tokenManager.verify(JSON.stringify(token));
      return response;
    } catch (error) {
      console.error("Error verifying user token:", error);
      return false;
    }
  };

  const refreshToken = async (): Promise<string> => {
    try {
      const token: string | false = getToken();
      if (!token) return "";

      const tokenManager = new UserTokenManager();
      const response = await tokenManager.refresh(JSON.stringify(token));

      if (response) {
        userToken.value = response;
        localStorage.setItem("token", response);
      }

      return response;
    } catch (error) {
      console.error("Error retrieving user token:", error);
      return "";
    }
  };

  const clear = (): void => {
    user.value = new UserEntity(); // reset to new empty UserEntity
    userToken.value = "";

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return { clear, set, setToken, info, isEmptyState, getToken, verifyToken, refreshToken };
});
