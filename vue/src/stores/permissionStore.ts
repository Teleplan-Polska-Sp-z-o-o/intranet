import { defineStore } from "pinia";
import {
  IPermission,
  IPermissionGroups,
  IUser,
  StaticGroups,
  UserGroup,
  UserSubgroup,
} from "../interfaces/user/UserTypes";
import { UserPermissionManager } from "../models/user/UserPermissionManager";
import { RouteGroup } from "../models/common/router/RouteGroup";
import { RouterHelper } from "../models/common/router/RouterHelper";
import { SimpleUser } from "../models/user/SimpleUser";

export const usePermissionStore = defineStore("auth", () => {
  const get = async (iUser: IUser): Promise<IPermission> => {
    const user: SimpleUser = new SimpleUser().build(iUser);
    const permission: IPermission = (await new UserPermissionManager().getOne(JSON.stringify(user)))
      .permission;

    return permission;
  };

  const check = async (
    iUser: IUser,
    routeGroup: RouteGroup,
    onlyCheckGroup: boolean = false,
    iUserPermission?: IPermission
  ): Promise<boolean> => {
    const permission: IPermission = iUserPermission || (await get(iUser));

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
    const permission: IPermission = await get(userInfo);

    const orderedGroups: IPermissionGroups = StaticGroups.getAdminGroups();

    // Map tools to promises that resolve to the tool or null
    const toolPromises = tools.map(async (tool) => {
      if (RouterHelper.isTPermissionGroup(tool.meta.group)) {
        try {
          const toolAccess = await check(
            userInfo,
            new RouteGroup(tool.meta.group, null),
            true,
            permission
          );
          if (!toolAccess) return null;

          // Find the group in the user's permissions
          const userGroup = permission.groups.find((group) => group.name === tool.meta.group);
          if (!userGroup) return null;

          // Get the first subgroup name based on the order in orderedGroups
          const firstSubgroupName = orderedGroups[tool.meta.group]?.find((subgroupName) =>
            userGroup.subgroups.some((subgroup) => subgroup.name === subgroupName)
          );

          if (!firstSubgroupName) return null;

          tool.href = `${tool.meta.baseHref}${firstSubgroupName}`;
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
    const permission: IPermission = await get(userInfo);
    // Map tools to promises that resolve to the tool or null
    const toolTabsPromises = toolTabs.map(async (toolTab) => {
      if (
        RouterHelper.isTPermissionGroup(toolTab.meta.group) &&
        RouterHelper.isTPermissionSubgroup(toolTab.meta.subgroup)
      ) {
        try {
          const toolTabAccess = await check(
            userInfo,
            new RouteGroup(toolTab.meta.group, toolTab.meta.subgroup),
            false,
            permission
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

  return { check, filterTools, filterToolTabs, get };
});
