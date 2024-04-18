// 1. Define route components.

import DefaultLayout from "../../layouts/DefaultLayout.vue";
import HomeView from "../../views/HomeView.vue";
import AuthView from "../../views/AuthView.vue";
import SettingsView from "../../views/SettingsView.vue";
import ToolsView from "../../views/ToolsView.vue";
import DocumentsView from "../../views/tools/DocumentsView.vue";
import MatrixView from "../../views/tools/MatrixView.vue";
import DocumentView from "../../views/DocumentView.vue";
import AdminView from "../../views/tools/AdminView.vue";

// change
import ChangeView from "../../views/tools/change/ChangeView.vue";
import ChangeTableView from "../../views/tools/change/ChangeTableView.vue";

import { RouteLocationNormalized } from "vue-router";

// 2. Define routes
const routes = [
  {
    path: "/",
    name: "auth",
    component: AuthView,
    meta: {
      read: false,
      write: false,
      control: false,
      breadcrumbs: {
        include: false,
      },
    },
  },
  {
    path: "/pages",
    name: "pages",
    component: DefaultLayout,
    meta: {
      read: true,
      write: false,
      control: false,
      breadcrumbs: {
        include: true,
        parent: "pages",
        name: "home",
        path: "/pages/home",
      },
    },
    children: [
      {
        path: "",
        name: "redirectHome",
        redirect: { name: "home" },
        meta: {
          read: true,
          write: false,
          control: false,
          breadcrumbs: {
            include: false,
          },
        },
      },
      {
        path: "home",
        name: "home",
        component: HomeView,
        meta: {
          read: true,
          write: false,
          control: false,
          breadcrumbs: {
            include: false,
          },
        },
      },
      {
        path: "settings/:currentTab",
        name: "settings",
        component: SettingsView,
        meta: {
          read: true,
          write: false,
          control: false,
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
          read: true,
          write: false,
          control: false,
          breadcrumbs: {
            include: true,
            parent: "pages",
            name: "tools",
          },
        },
      },
    ],
  },
  {
    path: "/tool",
    name: "tool",
    component: DefaultLayout,
    meta: {
      read: true,
      write: false,
      control: false,
      breadcrumbs: {
        include: true,
        parent: "pages",
        name: "tools",
        path: "/pages/tools",
      },
    },
    children: [
      {
        path: "",
        name: "redirectDocuments",
        redirect: { name: "documents" },
        meta: {
          read: true,
          write: false,
          control: false,
          breadcrumbs: {
            include: false,
          },
        },
      },
      {
        path: "documents",
        name: "documents",
        redirect: { name: "browseDocuments" },
        meta: {
          read: true,
          write: false,
          control: false,
          breadcrumbs: {
            include: true,
            parent: "tool.documents",
            name: "browse",
            path: "",
          },
        },
        children: [
          {
            path: "browse",
            name: "browseDocuments",
            component: DocumentsView,
            meta: {
              read: true,
              write: false,
              control: false,
              breadcrumbs: {
                include: false,
              },
            },
          },
          {
            path: ":fileName/:fileLangs/:fileUUID",
            name: "viewDocuments",
            component: DocumentView,
            meta: {
              read: true,
              write: false,
              control: false,
              title: (route: RouteLocationNormalized) => route.params.fileName,
              breadcrumbs: {
                include: true,
                parent: "tool.documents",
                name: "view",
                path: "",
                disabled: true,
              },
            },
          },
        ],
      },
      {
        path: "admin",
        name: "admin",
        component: AdminView,
        meta: {
          read: true,
          write: true,
          control: true,
          breadcrumbs: {
            include: true,
            parent: "tool",
            name: "admin",
            path: "",
          },
        },
      },
      {
        path: "matrix",
        name: "matrix",
        component: MatrixView,
        meta: {
          read: true,
          write: true,
          control: false,
          breadcrumbs: {
            include: true,
            parent: "tool",
            name: "matrix",
            path: "",
          },
        },
      },
      {
        path: "change",
        name: "change",
        component: ChangeView,
        redirect: { name: "browseChanges" },
        meta: {
          read: true,
          write: true,
          control: false,
          breadcrumbs: {
            include: true,
            parent: "tool.change",
            name: "browse",
            path: "",
          },
        },
        children: [
          {
            path: "browse",
            name: "browseChanges",
            component: ChangeTableView,
            meta: {
              read: true,
              write: true,
              control: false,
              breadcrumbs: {
                include: false,
              },
            },
          },
          {
            path: "x",
            name: "x",
            component: ChangeTableView,
            meta: {
              read: true,
              write: true,
              control: false,
              breadcrumbs: {
                include: true,
                parent: "tool.change",
                name: "x",
                path: "",
                disabled: true,
              },
            },
          },
        ],
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notFound",
    redirect: { name: "home" },
  },
];

export { routes };
