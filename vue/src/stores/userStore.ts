import { defineStore } from "pinia";
import { ref } from "vue";
import { IUser } from "../interfaces/user/IUser";
import { User } from "../models/user/User";
import { IUserEntity } from "../interfaces/user/IUserEntity";

export const useUserStore = defineStore("user", () => {
  const user = ref<IUser>(new User());

  const set = (data: IUser | IUserEntity): boolean => {
    try {
      user.value.id = data.id;
      user.value.username = data.username;
      user.value.domain = data.domain;

      localStorage.setItem("user", JSON.stringify(user.value));
    } catch (error) {
      return false;
    }

    return true;
  };

  const info = (): IUser | false => {
    try {
      if (!localStorage) {
        return false;
      }

      const json: string | null = localStorage.getItem("user");
      if (!json) return false;
      //throw new Error("No user data found in localStorage");
      const user: IUser = JSON.parse(json);
      return user;
    } catch (error) {
      console.error("Error retrieving user info:", error);
      return false;
    }
  };

  return { set, info };
});
