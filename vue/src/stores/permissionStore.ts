import { defineStore } from "pinia";
import { ref } from "vue";
import { IPermission } from "../interfaces/user/IPermission";

export const usePermissionStore = defineStore("auth", () => {
  const permission = ref<IPermission>({
    read: false,
    write: false,
    control: false,
  });

  const check = (routePermission: IPermission): boolean => {
    const requiredPermission = Object.entries(routePermission).filter(
      ([_, value]) => value === true
    );

    const json: string | null = localStorage.getItem("permission");
    const permission: IPermission = json ? JSON.parse(json) : null;

    for (const [key, _] of requiredPermission) {
      if (!(permission as any)[key]) return false;
    }

    return true;
  };

  const set = (userPermission: IPermission): boolean => {
    try {
      permission.value.read = userPermission.read;
      permission.value.write = userPermission.write;
      permission.value.control = userPermission.control;
      localStorage.setItem("permission", JSON.stringify(permission.value));
    } catch (e) {
      return false;
    }

    return true;
  };

  const getPermissionCode = (
    per: IPermission | null = null,
    upperCased: boolean = false
  ): "user" | "User" | "moderator" | "Moderator" | "Admin" | "admin" => {
    const json: string | null = localStorage.getItem("permission");
    const permission: IPermission = per ? per : json ? JSON.parse(json) : null;

    if (permission.control) return upperCased ? "Admin" : "admin";
    if (permission.write) return upperCased ? "Moderator" : "moderator";
    else return upperCased ? "User" : "user";
  };

  return { check, set, getPermissionCode };
});
