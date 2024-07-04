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
          change: {
            browse: "Change",
          },
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
          change: {
            title: "Change",
            text: "Creation and approval of change.",
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
            list: {
              "list-subheader": "General",
              "list-item": {
                "1": {
                  title: "Themes",
                  subtitle: "Choose between light and dark mode",
                },
                "2": {
                  title: "Languages",
                  subtitle:
                    "Select the language for the interface. Note: While English is fully supported, other languages may have limited support.",
                },
              },
            },
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
          notification: {
            name: "NOTIFICATION CENTER",
          },
          user: {
            name: "USER",
          },
        },
      },
    },
    months: {
      jan: "January",
      feb: "February",
      mar: "March",
      apr: "April",
      may: "May",
      jun: "June",
      jul: "July",
      aug: "August",
      sep: "September",
      oct: "October",
      nov: "November",
      dec: "December",
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
      unauthorized: "Unauthorized access to perform this action.",

      auth_invalid_credentials: "Invalid username or password.",
    },
  },
};

export { enC };
