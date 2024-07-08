import DefaultLayout from "../../layouts/DefaultLayout.vue";

import HomeView from "../../views/HomeView.vue";
import SettingsView from "../../views/SettingsView.vue";
import ToolsView from "../../views/ToolsView.vue";

export const pagesRoutes = {
  path: "/pages",
  name: "pages",
  component: DefaultLayout,
  redirect: { name: "home" },
  meta: {
    breadcrumbs: {
      include: true,
      parent: "pages",
      name: "home",
      path: "/pages/home",
    },
  },
  children: [
    {
      path: "home",
      name: "home",
      component: HomeView,
      meta: {
        breadcrumbs: {
          include: false,
        },
      },
    },
    {
      path: "settings/:tab",
      name: "settings",
      component: SettingsView,
      meta: {
        breadcrumbs: {
          include: true,
          parent: "pages",
          name: "settings",
        },
      },
    },
    {
      path: "tools",
      name: "tools",
      component: ToolsView,
      meta: {
        breadcrumbs: {
          include: true,
          parent: "pages",
          name: "tools",
        },
      },
    },
    {
      path: "*",
      redirect: { name: "home" },
    },
  ],
};
