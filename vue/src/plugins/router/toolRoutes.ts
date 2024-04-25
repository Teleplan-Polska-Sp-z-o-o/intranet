import DefaultLayout from "../../layouts/DefaultLayout.vue";

import DocumentsView from "../../views/tools/DocumentsView.vue";
import MatrixView from "../../views/tools/MatrixView.vue";
import DocumentView from "../../views/DocumentView.vue";
import AdminView from "../../views/tools/AdminView.vue";

import ChangeView from "../../views/tools/change/ChangeView.vue";
import ChangeTableView from "../../views/tools/change/ChangeTableView.vue";

import { RouteLocationNormalized } from "vue-router";

export const toolRoutes = {
  path: "/tool",
  name: "tool",
  component: DefaultLayout,
  redirect: { name: "documents" },
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
          path: "browse/:tab/:no?",
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
    {
      path: "*",
      redirect: { name: "documents" },
    },
  ],
};
