import { createRouter, createWebHistory } from "vue-router";
import { routes } from "./routes.ts";
import { usePermissionStore } from "./../../stores/permissionStore.ts";
import { useUserStore } from "../../stores/userStore.ts";
import { IUser } from "../../interfaces/user/IUser.ts";

// 3. Create the router instance and pass the `routes` option

const router = createRouter({
  // history: createWebHashHistory(),
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, _from, next) => {
  try {
    if (to.meta.title) {
      const title = typeof to.meta.title === "function" ? to.meta.title(to) : to.meta.title;
      document.title = title as string;
    }

    const userStore = useUserStore();
    const isTokenVerified: boolean = await userStore.verifyToken();
    const isUser: false | IUser = userStore.info();

    const permissionStore = usePermissionStore();

    const meta = {
      read: to.meta.read as boolean,
      write: to.meta.write as boolean,
      control: to.meta.control as boolean,
    };

    if (!isTokenVerified || !isUser || !permissionStore.check(meta)) {
      if (to.path !== "/") {
        sessionStorage.setItem("intendedRoute", to.fullPath);
        next("/");
      } else {
        next();
      }
    } else {
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
  } catch (error) {
    console.log(error);
    next(false); // Cancel navigation in case of an error
  }
});

export { router };
