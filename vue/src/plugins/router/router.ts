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

router.beforeEach((to, _from, next) => {
  try {
    const userStore = useUserStore();
    const isUser: false | IUser = userStore.info();

    const isHomeRoute = to.path === "/";

    if (!isUser && !isHomeRoute) {
      // If user is not logged in, store the intended destination route
      if (to.path !== "/") {
        sessionStorage.setItem("intendedRoute", to.fullPath);
      }
      next("/"); // Redirect to the home route
    } else if (!isUser && isHomeRoute) {
      next();
    } else {
      // If user is logged in and intendedRoute is stored, proceed to that route
      const intendedRoute = sessionStorage.getItem("intendedRoute");
      if (intendedRoute) {
        sessionStorage.removeItem("intendedRoute");
        next(intendedRoute); // Redirect to the intended destination route
      } else {
        next(); // Proceed with the navigation
      }
    }
  } catch (error) {
    console.log(error);
  }
});

router.beforeEach((to, _from, next) => {
  try {
    if (to.meta.title) {
      const title = typeof to.meta.title === "function" ? to.meta.title(to) : to.meta.title;
      document.title = title as string;
    }

    const permissionStore = usePermissionStore();

    const meta = {
      read: to.meta.read as boolean,
      write: to.meta.write as boolean,
      control: to.meta.control as boolean,
    };

    const intendedRoute = sessionStorage.getItem("intendedRoute");

    // Compare user and route permissions
    if (!permissionStore.check(meta)) {
      next("/"); // Proceed to
    } else if (intendedRoute) {
      sessionStorage.removeItem("intendedRoute");
      next(intendedRoute); // Redirect to the intended destination route
    } else {
      next(); // Proceed with the navigation
    }
  } catch (error) {
    console.log(error);
  }
});

export { router };
