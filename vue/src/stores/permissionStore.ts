import { defineStore } from "pinia";
import { ref } from "vue";
import {
  IPermission,
  IUser,
  TPermissionStringCode,
  UserGroup,
  UserSubgroup,
} from "../interfaces/user/UserTypes";
import { UserPermissionManager } from "../models/user/UserPermissionManager";
import { RouteGroup } from "../models/common/router/RouteGroup";
import { RouterHelper } from "../models/common/router/RouterHelper";

export const usePermissionStore = defineStore("auth", () => {
  const storedRolePermission = ref<Partial<IPermission>>({
    read: false,
    write: false,
    control: false,
  });

  const get = async (iUser: IUser): Promise<IPermission> => {
    const permission: IPermission = (
      await new UserPermissionManager().getOne(JSON.stringify(iUser))
    ).permission;

    return permission;
  };

  const set = (userPermission: IPermission): boolean => {
    try {
      storedRolePermission.value.read = userPermission.read;
      storedRolePermission.value.write = userPermission.write;
      storedRolePermission.value.control = userPermission.control;
    } catch (e) {
      return false;
    }

    return true;
  };

  const check = async (
    iUser: IUser,
    routeGroup: RouteGroup,
    onlyCheckGroup: boolean = false
  ): Promise<boolean> => {
    const permission: IPermission = await get(iUser);
    set(permission);

    let requiredGroup: UserGroup | undefined = undefined;
    if (routeGroup.routePermissionGroup !== null) {
      requiredGroup = permission.groups.find(
        (group) => group.name === routeGroup.routePermissionGroup
      );
      if (requiredGroup === undefined) return false;
    }
    if (onlyCheckGroup === false && requiredGroup && routeGroup.routePermissionSubgroup !== null) {
      const requiredSubgroup: UserSubgroup | undefined = requiredGroup.subgroups.find(
        (subgroup) => subgroup.name === routeGroup.routePermissionSubgroup
      );
      if (requiredSubgroup === undefined) return false;
    }

    return true;
  };

  // const filterTabs = <
  //   T extends {
  //     href: string;
  //     meta: {
  //       group: string;
  //       baseHref: string;
  //     };
  //   }
  // >(
  //   userInfo: IUser,
  //   tools: Array<T>
  // ): T[] => {
  //   return tools.filter(async (tool) => {
  //     if (RouterHelper.isTPermissionGroup(tool.meta.group)) {
  //       const toolAccess = await check(userInfo, new RouteGroup(tool.meta.group, null), true);
  //       if (toolAccess === false) return false;
  //       const permission: IPermission = await get(userInfo);
  //       const firstSubgroup: string | undefined = permission.groups
  //         .find((group) => group.name === tool.meta.group)
  //         ?.subgroups.at(0)?.name as string | undefined;

  //       if (firstSubgroup === undefined) return false;
  //       tool.href = `${tool.meta.baseHref}${firstSubgroup}`;

  //       return toolAccess;
  //     } else true;
  //   });
  // };

  /**
   * Filters tools based on user permissions and updates their href property.
   *
   * @template T - A type that extends an object with href and meta properties.
   * @param {IUser} userInfo - The user information object.
   * @param {Array<T>} tools - An array of tools to be filtered.
   * @returns {Promise<T[]>} - A promise that resolves to an array of tools that the user has access to.
   */
  const filterTools = async <
    T extends {
      href: string;
      meta: {
        group: string;
        baseHref: string;
      };
    }
  >(
    userInfo: IUser,
    tools: Array<T>
  ): Promise<T[]> => {
    // Map tools to promises that resolve to the tool or null
    const toolPromises = tools.map(async (tool) => {
      if (RouterHelper.isTPermissionGroup(tool.meta.group)) {
        try {
          const toolAccess = await check(userInfo, new RouteGroup(tool.meta.group, null), true);
          if (!toolAccess) return null;

          const permission: IPermission = await get(userInfo);
          const firstSubgroup: string | undefined = permission.groups
            .find((group) => group.name === tool.meta.group)
            ?.subgroups.at(0)?.name as string | undefined;

          if (!firstSubgroup) {
            return null;
          }

          tool.href = `${tool.meta.baseHref}${firstSubgroup}`;
          return tool;
        } catch (error) {
          console.error(`Error processing tool ${tool.meta.group}: ${error}`);
          return null;
        }
      }
      return tool;
    });

    // Wait for all promises to resolve
    const resolvedTools = await Promise.all(toolPromises);

    // Filter out null values
    const filteredTools = resolvedTools.filter((tool) => tool !== null) as T[];
    return filteredTools;
  };

  const filterToolTabs = async <
    T extends {
      meta: {
        group: string;
        subgroup: string;
      };
    }
  >(
    userInfo: IUser,
    toolTabs: Array<T>
  ): Promise<T[]> => {
    // Map tools to promises that resolve to the tool or null
    const toolTabsPromises = toolTabs.map(async (toolTab) => {
      if (
        RouterHelper.isTPermissionGroup(toolTab.meta.group) &&
        RouterHelper.isTPermissionSubgroup(toolTab.meta.subgroup)
      ) {
        try {
          const toolTabAccess = await check(
            userInfo,
            new RouteGroup(toolTab.meta.group, toolTab.meta.subgroup)
          );
          if (!toolTabAccess) return null;

          return toolTab;
        } catch (error) {
          console.error(
            `Error processing toolTab: ${toolTab.meta.group}, tab: ${toolTab.meta.subgroup}: ${error}`
          );
          return null;
        }
      }
      return toolTab;
    });

    // Wait for all promises to resolve
    const resolvedToolTabs = await Promise.all(toolTabsPromises);

    // Filter out null values
    const filteredTools = resolvedToolTabs.filter((toolTab) => toolTab !== null) as T[];
    return filteredTools;
  };

  /**
   *
   * @param permission (Optional) If none given, function will return StringCode based on user stored permission.
   * @returns (TPermissionStringCode) "user" | "moderator" | "admin"
   */
  const translatePermissionToStringCode = (
    permission: IPermission | null = null
  ): TPermissionStringCode => {
    if (permission ? permission.control : storedRolePermission.value.control) return "admin";
    if (permission ? permission.write : storedRolePermission.value.write) return "moderator";
    else return "user";
  };

  return { check, filterTools, filterToolTabs, set, translatePermissionToStringCode };
});
