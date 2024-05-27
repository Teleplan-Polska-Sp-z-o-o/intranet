import { defineStore } from "pinia";
import { ref } from "vue";
import { IUserEntity } from "../interfaces/user/IUserEntity";
import { UserEntity } from "../models/user/UserEntity";

export const useUserStore = defineStore("user", () => {
  const user = ref<IUserEntity>(new UserEntity());

  // const set = (data: IUser | IUserEntity): boolean => {
  const set = (data: IUserEntity): boolean => {
    try {
      // user.value.id = data.id;
      // user.value.username = data.username;
      // user.value.domain = data.domain;
      user.value = new UserEntity().buildFromIUserEntity(data);

      localStorage.setItem("user", JSON.stringify(user.value));
    } catch (error) {
      return false;
    }

    return true;
  };

  // const info = (): IUser | false => {
  const info = (): IUserEntity | false => {
    try {
      if (!localStorage) {
        return false;
      }

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

  return { set, info };
});
