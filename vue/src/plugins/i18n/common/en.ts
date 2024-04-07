const enC = {
  common: {
    default_layout: {
      bar: "Intranet",
      drawer: {
        hello: "Hello",
        home: "Home",
        tools: "Tools",
        settings: "Settings",
        logout: "Logout",
      },
      breadcrumbs: {
        pages: {
          home: "Home",
          settings: "Settings",
          tools: "Tools",
        },
        tool: {
          documents: {
            browse: "Documents",
            view: "View",
          },
          matrix: "Matrix",
          admin: "Admin",
        },
      },
      pages: {
        home: {
          card: {
            explore: "Explore",
          },
        },
        tools: {
          documents: {
            title: "Documents",
            text: "Document management system.",
          },
          training: {
            title: "Training",
            text: "Enhancing skills and certifications.",
          },
          cn: {
            title: "CN",
            text: "Creation and approval of change notices.",
          },
          matrix: {
            title: "Matrix",
            text: "Managing data that is utilized by other tools.",
          },
          "8d": {
            title: "8D",
            text: "Addressing complaints and internal issues efficiently.",
          },
          boss: {
            title: "Admin",
            text: "Platform's management.",
          },
        },
        settings: {
          application: {
            name: "APPLICATION",
            theme: {
              name: "Theme",
              dark: "Dark",
              light: "Light",
            },
            language: {
              name: "Language",
              english: "English",
              polish: "Polish",
              ukrainian: "Ukrainian",
            },
          },
          user: {
            name: "USER",
          },
        },
      },
      tool: {
        documents: {
          name: "Documents",
          tabs: {
            my_documents: "MY DOCUMENTS",
            my_favorites: "MY FAVORITES",
            all_documents: "ALL DOCUMENTS",
            recently_browsed: "RECENTLY BROWSED",
          },
        },
        matrix: {
          name: "Matrix",
          tabs: {
            departments: "DEPARTMENTS",
          },
        },
      },
    },
    status_message: {
      post_error: "An error occurred while processing your action.",
      post_success: "Your action was successful.",
      put_error: "An error occurred while performing the operation.",
      put_success: "The operation was successfully completed.",
      get_error: "An error occurred while fetching the data.",
      get_success: "Data fetched successfully.",
      delete_error: "An error occurred while deleting the resource.",
      delete_success: "The resource was successfully deleted.",
      unknown: "Unknown error. Please try again later.",
    },
  },
};

export { enC };
