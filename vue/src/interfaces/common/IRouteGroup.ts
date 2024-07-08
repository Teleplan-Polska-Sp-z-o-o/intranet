import { TPermissionGroup, TPermissionSubgroup } from "../user/UserTypes";

interface IRouteGroup {
  routePermissionGroup: TPermissionGroup | null;
  routePermissionSubgroup: TPermissionSubgroup | null;
}

export { type IRouteGroup };
