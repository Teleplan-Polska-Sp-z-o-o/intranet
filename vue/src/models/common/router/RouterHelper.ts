import {
  IPermissionGroups,
  StaticGroups,
  TPermissionGroup,
  TPermissionSubgroup,
} from "../../../interfaces/user/UserTypes";

const permissionGroupsObj: IPermissionGroups = StaticGroups.getAdminGroups();
const permissionGroups: TPermissionGroup[] = [];
const permissionSubgroups: TPermissionSubgroup[] = [];

Object.keys(permissionGroupsObj).forEach((key) => {
  permissionGroups.push(key as TPermissionGroup);
  permissionSubgroups.push(...permissionGroupsObj[key as keyof IPermissionGroups]);
});

class RouterHelper {
  constructor() {}

  static isTPermissionGroup = (name: string): name is TPermissionGroup => {
    return permissionGroups.includes(name as TPermissionGroup);
  };

  static isTPermissionSubgroup = (name: string): name is TPermissionSubgroup => {
    return permissionSubgroups.includes(name as TPermissionSubgroup);
  };
}

export { RouterHelper };
