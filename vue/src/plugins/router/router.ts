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

router.beforeEach((_to, _from, next) => {
  const userStore = useUserStore();
  const isUser: false | IUser = userStore.info();

  if (!isUser) {
    next("/"); // Proceed to
  } else {
    next(); // Proceed with the navigation
  }
});

router.beforeEach((to, _from, next) => {
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

  // Compare user and route permissions
  if (!permissionStore.check(meta)) {
    next("/"); // Proceed to
  } else {
    next(); // Proceed with the navigation
  }
});

export { router };
