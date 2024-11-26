import DefaultLayout from "../../layouts/DefaultLayout.vue";

import DocumentsView from "../../views/tools/DocumentsView.vue";
import MatrixView from "../../views/tools/MatrixView.vue";
import DocumentView from "../../views/documents/DocumentView.vue";
import AdminView from "../../views/tools/AdminView.vue";
import AnalyticView from "../../views/tools/analytic/AnalyticView.vue";
import ChangeView from "../../views/tools/ChangeView.vue";
import WarehouseView from "../../views/tools/warehouse/WarehouseView.vue";

import { RouteLocationNormalized } from "vue-router";

// documents: ["instructions", "visuals", "msd", "assistant"],
//       change: ["pcr", "pcn"],
//       matrix: ["departments", "documents", "competences"],
//       admin: ["info", "permissions", "news"],

export const toolRoutes = {
  path: "/tool",
  name: "tool",
  component: DefaultLayout,
  redirect: { name: "documents" },
  meta: {
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
        toolName: "documents",
        breadcrumbs: {
          include: true,
          parent: "tool.documents",
          name: "browse",
          path: "",
        },
      },
      children: [
        {
          path: "browse/:tab/:no?",
          name: "browseDocuments",
          component: DocumentsView,
          meta: {
            toolName: "documents",
            breadcrumbs: {
              include: false,
            },
          },
        },
        {
          path: ":tab/:fileName/:fileLangs/:fileUUID",
          name: "viewDocuments",
          component: DocumentView,
          meta: {
            toolName: "documents",
            title: (route: RouteLocationNormalized) => route.params.fileName,
            breadcrumbs: {
              include: true,
              parent: "tool.documents",
              name: (route: RouteLocationNormalized) => route.params.fileName,
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
        toolName: "admin",
        breadcrumbs: {
          include: true,
          parent: "tool",
          name: "admin",
          path: "",
        },
      },
      children: [
        {
          path: "browse/:tab",
          name: "browseAdmin",
          component: AdminView,
          meta: {
            toolName: "admin",
            breadcrumbs: {
              include: false,
            },
          },
        },
      ],
    },
    {
      path: "matrix",
      name: "matrix",
      component: MatrixView,
      meta: {
        toolName: "matrix",
        breadcrumbs: {
          include: true,
          parent: "tool",
          name: "matrix",
          path: "",
        },
      },
      children: [
        {
          path: "browse/:tab",
          name: "browseMatrix",
          component: DocumentsView,
          meta: {
            toolName: "matrix",
            breadcrumbs: {
              include: false,
            },
          },
        },
      ],
    },
    {
      path: "change",
      name: "change",
      component: ChangeView,
      redirect: { name: "browseChanges" },
      meta: {
        toolName: "change",
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
          component: ChangeView,
          meta: {
            toolName: "change",
            breadcrumbs: {
              include: false,
            },
          },
        },
        // {
        //   path: "x",
        //   name: "x",
        //   component: ChangeView,
        //   meta: {
        //     breadcrumbs: {
        //       include: true,
        //       parent: "tool.change",
        //       name: "x",
        //       path: "",
        //       disabled: true,
        //     },
        //   },
        // },
      ],
    },
    // {
    //   path: "safety",
    //   name: "safety",
    //   component: MatrixView,
    //   meta: {
    //     toolName: "safety",
    //     breadcrumbs: {
    //       include: true,
    //       parent: "tool",
    //       name: "safety",
    //       path: "",
    //     },
    //   },
    //   children: [
    //     {
    //       path: "browse/:tab",
    //       name: "browseSafety",
    //       component: DocumentsView,
    //       meta: {
    //         toolName: "safety",
    //         breadcrumbs: {
    //           include: false,
    //         },
    //       },
    //     },
    //   ],
    // },
    {
      path: "analytic",
      name: "analytic",
      component: AnalyticView,
      meta: {
        toolName: "analytic",
        breadcrumbs: {
          include: true,
          parent: "tool",
          name: "analytic",
          path: "",
        },
      },
      children: [
        {
          path: "browse/:program/:cat?/:sub?",
          name: "browseAnalytic",
          component: AnalyticView,
          meta: {
            toolName: "analytic",
            breadcrumbs: {
              include: false,
            },
          },
        },
      ],
    },
    {
      path: "warehouse",
      name: "warehouse",
      component: WarehouseView,
      meta: {
        toolName: "warehouse",
        breadcrumbs: {
          include: true,
          parent: "tool",
          name: "warehouse",
          path: "",
        },
      },
      children: [
        {
          path: "browse/:program/:cat?/:sub?",
          name: "browseWarehouse",
          component: WarehouseView,
          meta: {
            toolName: "warehouse",
            breadcrumbs: {
              include: false,
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
