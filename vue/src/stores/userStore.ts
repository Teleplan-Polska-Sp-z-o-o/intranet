import { defineStore } from "pinia";
import { ref } from "vue";
import { IUser } from "../interfaces/user/IUser";

export const useUserStore = defineStore("user", () => {
  const user = ref<IUser>({
    id: null,
    username: null,
    domain: null,
  });

  const set = (data: IUser): boolean => {
    try {
      user.value.id = data.id;
      user.value.username = data.username;

      localStorage.setItem("user", JSON.stringify(user.value));
    } catch (error) {
      return false;
    }

    return true;
  };

  const info = (): IUser | false => {
    try {
      const json: string | null = localStorage.getItem("user");
      if (!json) throw new Error("No user data found in localStorage");

      const user: IUser = JSON.parse(json);
      return user;
    } catch (error) {
      console.error("Error retrieving user info:", error);
      return false;
    }
  };

  return { set, info };
});
