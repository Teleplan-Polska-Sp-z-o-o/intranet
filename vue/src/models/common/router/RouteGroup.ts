import { IRouteGroup } from "../../../interfaces/common/IRouteGroup";
import { TPermissionGroup, TPermissionSubgroup } from "../../../interfaces/user/UserTypes";

class RouteGroup implements IRouteGroup {
  routePermissionGroup: TPermissionGroup | null;
  routePermissionSubgroup: TPermissionSubgroup | null;

  constructor(
    routePermissionGroup: TPermissionGroup | null,
    routePermissionSubgroup: TPermissionSubgroup | null
  ) {
    this.routePermissionGroup = routePermissionGroup;
    this.routePermissionSubgroup = routePermissionSubgroup;
  }
}

export { RouteGroup };
