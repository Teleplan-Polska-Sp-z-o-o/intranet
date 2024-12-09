const enC = {
  common: {
    default_layout: {
      auth: {
        rules: {
          login_req: "Login is required",
          login_format: "Please enter the login in the format: 'name.surname'",
          domain_req: "Domain is required",
          password_req: "Password is required",
        },
        template: {
          domain_label: "Computer Login Domain",
          login_label: "Computer Login",
          password_label: "Computer Password",
          password_massage: "Forgot password?",
          proceed: "Proceed",
        },
      },
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
          matrix: {
            browse: "Matrix",
            creator: "Creator",
          },
          admin: "Admin",
          change: {
            browse: "Change",
          },
          safety: "Safety",
          analytic: "Analytic",
          warehouse: "Warehouse",
        },
      },
      pages: {
        home: {
          card: {
            explore: "Explore",
          },
          newsTitle: "News & Announcements",
        },
        viewDocument: {
          small: "Small",
          large: "Large",
          pageMessage: "Page {currentPage} out of {totalPages}",
          important: "Important",
          unsupported:
            "This file cannot be viewed in the browser. Please download it to access the content.",
          download: "DOWNLOAD FILE",
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
          safety: {
            title: "Health and Safety",
            text: "Management of health and safety.",
          },
          analytic: {
            title: "Analytic",
            text: "Delivers data analysis to support decision-making.",
          },
          warehouse: {
            title: "Warehouse",
            text: "Provides efficient inventory management",
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
            "1": {
              subheader: "Info",
              position: "Position",
              department: "Department",
              decision_maker: "Decision Maker",
            },
            "2": {
              subheader: "Permissions",
              confidentiality: "Confidentiality",
              groups: "Groups",
            },
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
      unknownMessage: "Unknown message.",

      decision_maker_error:
        "The request concerns a user who has no permission for decision making.",
      tool_access_error: "The request concerns a user who has no access to the relevant tool.",
      reference_format_error: "Reference value is of invalid format.",
      reference_already_contains_error: "Some document already contains this reference.",

      filters_applied: "The filters have been applied.",
    },
    component: {
      file_form: {
        info_title: "Accepted Formats",
        info_text: "Form accepts files with extensions: '{accepts}'",
        add_file: "File",
        document: "Document",
        langs: "Languages",
      },
    },
  },
};

export { enC };
