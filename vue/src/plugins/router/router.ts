import { RouteLocationNormalized, createRouter, createWebHistory } from "vue-router";
import { routes } from "./routes.ts";
import { usePermissionStore } from "./../../stores/permissionStore.ts";
import { useUserStore } from "../../stores/userStore.ts";
import { IUser, TPermissionGroup, TPermissionSubgroup } from "../../interfaces/user/UserTypes.ts";
import { RouteGroup } from "../../models/common/router/RouteGroup.ts";
import { RouterHelper } from "../../models/common/router/RouterHelper.ts";
import { useWebsocketStore } from "../../stores/websocketStore.ts";

// 3. Create the router instance and pass the `routes` option

const router = createRouter({
  // history: createWebHashHistory(),
  history: createWebHistory(),
  routes,
});

const routeRequiredGroupAndSubgroup = (to: RouteLocationNormalized): RouteGroup => {
  const metaToolName: unknown = to.meta.toolName;
  const toolName: string | null = typeof metaToolName === "string" ? metaToolName : null;
  const tabParam: string | string[] = to.params.tab;
  const toolTab =
    Array.isArray(tabParam) || !tabParam ? null : tabParam.length > 0 ? tabParam : null;

  let permissionGroup: TPermissionGroup | null = null;
  let permissionSubgroup: TPermissionSubgroup | null = null;

  if (toolName && RouterHelper.isTPermissionGroup(toolName)) {
    permissionGroup = toolName;
  }

  if (toolTab && RouterHelper.isTPermissionSubgroup(toolTab)) {
    permissionSubgroup = toolTab;
  }

  return new RouteGroup(permissionGroup, permissionSubgroup);
};

router.beforeEach(async (to, from, next) => {
  try {
    if (to.meta.title) {
      const title = typeof to.meta.title === "function" ? to.meta.title(to) : to.meta.title;
      document.title = title as string;
    }

    const userStore = useUserStore();
    const isTokenVerified: boolean = await userStore.verifyToken();
    const isUser: false | IUser = userStore.info();

    const permissionStore = usePermissionStore();

    if (!isTokenVerified || !isUser) {
      if (to.path !== "/") {
        sessionStorage.setItem("intendedRoute", to.fullPath);
        next("/");
      } else {
        next();
      }
    } else {
      if (!(await permissionStore.check(isUser, routeRequiredGroupAndSubgroup(to)))) {
        next("/");
      }
      // User is verified
      const intendedRoute: string | null = sessionStorage.getItem("intendedRoute");
      if (intendedRoute && to.path !== "/") {
        sessionStorage.removeItem("intendedRoute");
        next(intendedRoute); // Redirect to the intended destination route
      } else {
        // Proceed with the navigation
        await userStore.refreshToken();
        next();
      }
    }

    if (to.path === "/" && from.path !== "/") {
      const websocketStore = useWebsocketStore();
      websocketStore.closeConnection();
    }
  } catch (error) {
    console.log(error);
    next(false); // Cancel navigation in case of an error
  }
});

router.afterEach(async (to, _from) => {
  try {
    if (to.path !== "/") {
      const websocketStore = useWebsocketStore();
      websocketStore.openConnection();
    }
  } catch (error) {
    console.log(error);
  }
});

export { router };
