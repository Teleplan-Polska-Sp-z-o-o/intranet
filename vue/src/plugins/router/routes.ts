// authorization before front page
import AuthView from "../../views/AuthView.vue";

// base routes
import { pagesRoutes } from "./pagesRoutes";
import { toolRoutes } from "./toolRoutes";

// 2. Define routes
const routes = [
  {
    path: "/",
    name: "auth",
    component: AuthView,
    meta: {
      breadcrumbs: {
        include: false,
      },
    },
  },
  pagesRoutes,
  toolRoutes,
  {
    path: "/:pathMatch(.*)*",
    name: "notFound",
    redirect: { name: "home" },
  },
];

export { routes };
