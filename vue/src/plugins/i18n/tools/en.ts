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
      deleteItemConfirmation: "Are you sure you want to delete this item?",
      deleteDocumentConfirmation:
        "Deleting this document will also affect all of its associated files.",
      filters: "Filter by using advanced criteria",
    },
    chart: {
      post: {
        title: "Analyzing the Data",
        subtitle: "Upload Overview by user and quantity",
      },
    },
    chips: {
      departments: "Departments",
      workstations: "Workstations",
      programs: "Programs",
      category: "Category",
      subcategory: "Subcategory",
      subSubcategory: "Sub-subcategory",
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
        instructions: {
          name: "INSTRUCTIONS",
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
        visuals: {
          name: "VISUAL AIDS",
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
        msd: {
          name: "Management Systems",
          table: {
            toolbar: "Management Systems",
            select_lang: "Select Language",
            header: {
              name: "Name",
              description: "Description",
              view_document: "View Document",
            },
          },
        },
        assistant: {
          name: "ASSISTANT",
          title: "AI Document Assistant",
          send: "Send",
          placeholder: "Ask me a question.",
          new: "New Conversation",
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
              confidentiality: "Confidentiality",
              description: "Description",
              language: "Languages (files)",
              revision: "Revision",
              subcategory: "Subcategory",
              actions: "Actions",
            },
          },
        },
        competences: {
          name: "COMPETENCES",
          table: {
            toolbar: "Competences",
            header: {
              name: "Name",
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
              position: "Position",
              department: "Department",
              decisionMaker: "Decision Maker",
              confidentiality: "Confidentiality",
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
              modelOrProcessImpacted: "Impact On",
              dateNeeded: "Need Date",
              assessment: "Assessment",
              approvedOrRejectedBy: "Closed By",
              closureDate: "Closure Date",
              viewPcr: "View/Approve PCR",
              numberOfNotice: "Notice No",
              actions: "Actions",

              requestedBy: "Requested By",
              customerContactPerson: "Customer Contact Person",
              customerContactEmail: "Customer Contact Email",
              reconextContactPerson: "Reconext Contact Person",
              costOfImplementation: "Cost Of Implementation",
              impacts: "Impacts",
              riskAnalysis: "Risk Analysis",
              status: "Status",
            },
          },
          stepper: {
            actions: {
              prev: "Previous",
              next: "Next",
            },
            changeReason: "Change Reason",
            changeDescription: "Change Description",
            updateDescriptionRule: "Update description is required.",
            customerContactPersonRule:
              "Please enter both a name and a surname separated by a space.",
            customerContactEmailRule: "Email must be valid.",
            vStepperItem: {
              "1": "Base Info",
              "2": "Contact Info",
              "3": "Need Date",
              "4": "Descriptive Info",
              "5": "Verify",
            },
            vStepperWindowItem: {
              "1": {
                internalOrExternal: "Internal or External",
                dedicatedDepartment: "Dedicated Department",
                program: "Program",
                reconextOwner: "Reconext Owner",
              },
              "2": {
                customerContactPerson: "Customer Contact Person",
                customerContactEmail: "Customer Contact Email",
                reconextContactPerson: "Reconext Contact Person",
              },
              "3": {
                dateNeeded: "Clear Implementation Need Date",
              },
              "4": {
                modelOrProcessImpacted: "Model or Process Impacted",
                costOfImplementation: "Cost of Implementation",
                impacts: "Impacts",
                riskAnalysis: "Risk Analysis",
                updateDescription: "Update Description",
              },
            },
            alerts: {
              remainder: {
                title: "Reminder",
                text: "Please be advised that any updates made to the closed request will automatically trigger its reopening for further review and action.",
                fields: "Keys preview of updated fields.",
              },
              emptyUpdate: {
                title: "Warning",
                text: "Please be aware that proceeding without making any actual edits to the closed request will not yield any effect.",
              },
              removalOfNotice: {
                title: "Warning",
                text: "Please be aware that proceeding will result in the deletion of its related notice.",
              },
            },
          },
        },

        pcn: {
          name: "Process Change Notice",
          table: {
            toolbar: "Notices",
            header: {
              numberOfNotice: "No",
              numberOfRequest: "No Request",
              reconextOwner: "Applicant",
              personDesignatedForImplementation: "Person Designated",
              noticeDate: "Notice Date",
              modelOrProcessImpacted: "Impact On",
              areDocumentationChangesRequired: "Doc Changes Req",
              isNewDocumentationRequired: "New Doc Req",
              isCustomerApprovalRequired: "Customer Approve Req",
              status: "Status",
              engineeringDepartmentApproval: "Eng Approval",
              qualityDepartmentApproval: "Qua Approval",
              dedicatedDepartmentApproval: "Ded Approval",
              closureDate: "Closure Date",
              viewPcn: "View/Approve PCN",
              actions: "Actions",
            },
          },
          stepper: {
            actions: {
              prev: "Previous",
              next: "Next",
            },
            updateDescriptionRule: "Update description is required.",
            qualityDepartmentRule: "Quality and Engineering departments must differ.",
            changeDescription: "Change Description",
            vStepperItem: {
              "1": "Change Description",
              "2": "Documentation",
              "3": "Approvals",
              "4": "Verify",
            },
            vStepperWindowItem: {
              "2": {
                areDocumentationChangesRequired: "Are Documentation Changes Required",
                listOfDocumentationToChange: "List Of Documentation To Change",
                isNewDocumentationRequired: "Is New Documentation Required",
                listOfDocumentationToCreate: "List Of Documentation To Create",
              },
              "3": {
                personDesignatedForImplementation: "Person Designated For Implementation",
                isCustomerApprovalRequired: "Is Customer Approval Required",
                engineeringDepartmentName: "Pick Engineering Department",
                qualityDepartmentName: "Pick Quality Department",
                updateDescription: "Update Description",
              },
            },
            alerts: {
              departmentsRequiredForApproval: {
                title: "PCN Approval Process",
                initial: {
                  title: "Initialization",
                  text: "The PCN form requires specifying the relevant Engineering and Quality departments for Intranet to identify their decision-makers. Once all fields within the PCN are completed, the system automatically informs recipients about the upcoming action they may take to begin approval process.",
                },
                "required-review": {
                  title: "Engineering and Quality Review",
                  text: "The PCN will first be routed to the Engineering department for review. Once approval is received from any of the Engineering decision-makers, the PCN will automatically close and proceed to the Quality department for further review.",
                },
                "optional-review": {
                  title: "Dedicated Department Review (Optional)",
                  text: "If the PCR dedicated department pertains to a specific area outside Engineering and Quality, the system also routes the request for approval to the designated decision-maker(s) within that department.",
                },
              },
              remainder: {
                title: "Reminder",
                text: "Please be advised that any updates made to the closed notice will automatically trigger its reopening for further review and action.",
                fields: "Keys preview of updated fields.",
              },
              emptyUpdate: {
                title: "Warning",
                text: "Please be aware that proceeding without making any actual edits to the closed notice will not yield any effect.",
              },
            },
          },
        },
        dcn: {
          name: "Document Change Notice",
        },
      },
    },
  },
};

export { enT };
