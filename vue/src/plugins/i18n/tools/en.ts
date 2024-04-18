const enT = {
  tools: {
    common: {
      new: "New",
      edit: "Edit",
      delete: "Delete",
      cancel: "Cancel",
      save: "Save",
      ok: "OK",
      search: "Search",
      deleteItemConfirmation: "Deleting this item will also affect all of its associated children.",
      deleteDocumentConfirmation:
        "Deleting this document will also affect all of its associated files.",
    },
    chips: {
      departments: "Departments",
      workstations: "Workstations",
      programs: "Programs",
    },
    documents: {
      name: "Documents",
      tabs: {
        my_documents: {
          name: "MY DOCUMENTS",
          table: {
            toolbar: "",
            select_lang: "",
          },
        },
        my_favorites: {
          name: "MY FAVORITES",
          table: {
            toolbar: "",
            select_lang: "",
          },
        },
        all_instructions: {
          name: "ALL INSTRUCTIONS",
          table: {
            toolbar: "Instructions",
            select_lang: "Select Language",
            header: {
              name: "Name",
              description: "Description",
              view_document: "View Document",
            },
          },
        },
        all_visuals: {
          name: "ALL VISUAL AIDS",
          table: {
            toolbar: "Visual Aids",
            select_lang: "Select Language",
            header: {
              name: "Name",
              description: "Description",
              view_document: "View Document",
            },
          },
        },
        recently_browsed: {
          name: "RECENTLY BROWSED",
          table: {
            toolbar: "",
            select_lang: "",
          },
        },
      },
    },
    matrix: {
      name: "Matrix",
      tabs: {
        departments: {
          name: "DEPARTMENTS",
          table: {
            toolbar: {
              departments: "Departments",
              workstations: "Workstations",
              programs: "Programs",
            },
            header: {
              name: "Name",
              actions: "Actions",
            },
          },
        },
        documents: {
          name: "DOCUMENTS",
          table: {
            toolbar: "Documents",
            header: {
              name: "Name",
              type: "Type",
              description: "Description",
              language: "Languages (files)",
              revision: "Revision",
              subcategory: "Subcategory",
              actions: "Actions",
            },
          },
        },
      },
      departments: {
        department: "Department",
        program: "Program",
        workstation: "Workstation",
      },
    },
    admin: {
      name: "Admin",
      tabs: {
        permissions: {
          name: "Permissions",
          table: {
            toolbar: "Permissions",
            header: {
              username: "Username",
              domain: "Domain",
              permission: "Permission",
              actions: "Actions",
            },
          },
        },
        news: {
          name: "News",
          table: {
            toolbar: "News",
            header: {
              title: "Title",
              subtitle: "Subtitle",
              actions: "Actions",
            },
          },
        },
      },
    },
    change: {
      name: "Change",
      tabs: {
        pcr: {
          name: "Process Change Request",
          table: {
            toolbar: "Requests",
            header: {
              numberOfRequest: "No",
              requestDate: "Request Date",
              internalOrExternal: "Internal/External",
              reconextOwner: "Owner",
              dedicatedDepartment: "Department",
              program: "Program",
              // projectOfProgram: "Project",
              dateNeeded: "Need Date",
              assessment: "Assessment",
              approvedOrRejectedBy: "Closed By",
              closureDate: "Closure Date",
              viewPcr: "View PCR",
              numberOfNotice: "Notice No",
              actions: "Actions",
            },
          },
        },
        pcn: {
          name: "Process Change Notice",
        },
        dcn: {
          name: "Document Change Notice",
        },
      },
    },
  },
};

export { enT };
