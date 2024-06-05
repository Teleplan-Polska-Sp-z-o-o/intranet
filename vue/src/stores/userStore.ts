import { defineStore } from "pinia";
import { ref } from "vue";
import { IUserEntity } from "../interfaces/user/IUserEntity";
import { UserEntity } from "../models/user/UserEntity";
import { UserTokenManager } from "../models/user/UserTokenManager";

export const useUserStore = defineStore("user", () => {
  const user = ref<IUserEntity>(new UserEntity());
  const userToken = ref<string>("");

  // const set = (data: IUser | IUserEntity): boolean => {
  const set = (data: IUserEntity): boolean => {
    try {
      // user.value.id = data.id;
      // user.value.username = data.username;
      // user.value.domain = data.domain;
      user.value = new UserEntity().buildFromIUserEntity(data);

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

  // const info = (): IUser | false => {
  const info = (): IUserEntity | false => {
    try {
      const json: string | null = localStorage.getItem("user");
      if (!json) return false;
      //throw new Error("No user data found in localStorage");
      // const user: IUser = JSON.parse(json);
      const user: IUserEntity = JSON.parse(json);
      return user;
    } catch (error) {
      console.error("Error retrieving user info:", error);
      return false;
    }
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
      const token: string | false = getToken();
      if (!token) return false;

      const tokenManager = new UserTokenManager();
      const response = await tokenManager.verify(JSON.stringify(token));

      if (!response) {
        userToken.value = "";
        localStorage.setItem("token", "");
      }

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

  return { set, setToken, info, getToken, verifyToken, refreshToken };
});
