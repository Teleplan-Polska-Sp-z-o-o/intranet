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
        subtitle: "Upload Overview by user and quantity from the past six months",
      },
    },
    chips: {
      filterByType: "Filter by document type",
      filterByFolder: "Filter by folders",
      empty: "No folders found",
      departments: "Departments",
      workstations: "Workstations",
      programs: "Programs",
      category: "Category",
      subcategory: "Subcategory",
      subSubcategory: "Sub-subcategory",
    },
    documents: {
      name: "Documents",
      table: {
        header: {
          name: "Name",
          description: "Description",
          view_document: {
            name: "View Document",
            select: "Select Language",
            tooltip: "Open in New Tab",
          },
          quick: {
            name: "Quick Access",
            tooltip_add: "Add to Quick Access",
            tooltip_remove: "Remove from Quick Access",
          },
        },
      },
      tabs: {
        all: {
          name: "DOCUMENTS",
          table: {
            toolbar: "Documents",
          },
        },
        instructions: {
          name: "INSTRUCTIONS",
          table: {
            toolbar: "Instructions",
          },
        },
        visuals: {
          name: "VISUAL AIDS",
          table: {
            toolbar: "Visual Aids",
          },
        },
        msd: {
          name: "Management Systems",
          table: {
            toolbar: "Management Systems",
          },
        },
        //
        quick: {
          name: "Quick Access",
          table: {
            toolbar: "Documents",
          },
        },
        recently: {
          name: "Recently Browsed",
          table: {
            toolbar: "Documents",
          },
        },
        //
        assistant: {
          name: "ASSISTANT",
          title: "AI Document Assistant",
          send: "Send",
          placeholder: "Ask me a question.",
          new: "New Conversation",
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
              // workstations: "Workstations",
              // programs: "Programs",
              categories: "Categories",
              subcategories: "Subcategories",
            },
            header: {
              name: "Name",
              actions: "Actions",
            },
          },
        },
        documents: {
          name: "DOCUMENTS",
          creator: {
            link: {
              title: "Online Document Creator",
              subtitle: "Simplify, create, and share",
              text: "Say goodbye to uploading document files. Our online document creator offers an intuitive, user-friendly interface that ensures a consistent experience every time. Perfect for creating professional documents quickly and efficiently, it’s the modern solution for seamless collaboration and productivity.",
              button: "Open Tool",
            },
            mainView: {
              title: {
                create: "You're about to start a new Draft",
                update: "Updating the Draft titled '{name}'",
                drafts:
                  "This is where you can manage your drafts — search, edit, delete and generate DOCX documents",
              },
              tabs: {
                dashboard: "Dashboard",
                new: "Create",
                drafts: "Drafts",
              },
            },
            createNew: {
              stepper: {
                actions: {
                  previous: "Previous",
                  next: "Next",
                  save: "Save",
                  saveDialog: {
                    title: "Confirmation",
                    text: "Are you sure you want to save this draft?",
                  },
                },
                info: {
                  product: "Product",
                  productHint: "Enter the name of the commodity or item.",
                  owner: "Owner",
                  ownerHint: "Specify the person responsible for the process.",
                  lastUpdate: "Last Update",
                  lastUpdateHint: "The date when this document was last updated.",
                  author: "Author",
                  authorHint: "The individual who made the last change.",
                  created: "Created",
                  createdHint: "The date this document was initially created.",
                  trainingCodes: "Training Codes",
                  trainingCodesHint: "Select codes for related training competencies.",
                  esd: "ESD",
                  esdHint:
                    "Select the ESD (Electrostatic Discharge) or choose N/A if not applicable.",
                  // Added validation rules
                  validationRules: {
                    product: "Product must be specified.",
                    owner: "Owner must be specified and should be a valid name.",
                    author: "Author must be specified and should be a valid name.",
                  },

                  // Added ESD options
                  esdOptionESD: "Electrostatic Discharge (ESD)",
                  esdOptionNA: "Not Applicable (N/A)",
                },
                before: {
                  documentTitle: "Document Title",
                  documentTitleHint: "The title should be clear and concise.",
                  documentTemplate: "Document Template",
                  documentTemplateHint:
                    "Choose a template for Front Page Logos or select 'Custom' to upload your own images.",
                  documentTemplateItems: ["BYD-QA-TMP-0001_01"],
                  logosTemplate: "Logos Template",
                  logosTemplateHint:
                    "Choose a template for Front Page Logos or select 'Custom' to upload your own image.",
                  uploadImageLabel: "Upload image",
                  uploadImageHint: "Drop your file here or click to upload",
                  documentId: "Document Id",
                  documentRevision: "Document Revision",
                  documentRevisionPrefix: "R",
                  documentRevisionPrefixSingleDigit: "R0",
                  validationRules: {
                    title: "Title is required",
                    documentTemplate: "Document Template is required",
                  },
                },
                content: {
                  segmentBody: "Segment Body",
                  addButton: "Add",
                  segmentTitle: "Segment Title",
                  segmentTitleHint: "Edit the segment title.",
                  insertBefore: "Insert Before",
                  insertAfter: "Insert After",
                  remove: "Remove",
                  untitledSegment: "Untitled Segment",
                },
              },
            },
            drafts: {
              original: "Original",
              originalAlert:
                "Choosing the language as 'Original' will skip translation and generate the document as it is.",
              recordId: "Record Id",
              draftName: "Draft Name",
              documentTitle: "Document Title",
              documentIdRev: "Document Id-Rev",
              created: "Created",
              lastUpdate: "Last Update",
              actions: "Actions",
              deleteConfirmation: "Are you sure you want to delete this item?",
              cancel: "Cancel",
              ok: "OK",
              selectDocumentLanguage: "Select Document Language",
              documentLanguage: "Document Language",
              search: "Search",
              editRecordTooltip: "Edit this record.",
              removeRecordTooltip: "Remove this record.",
              generateDocumentTooltip: "Generate Document based on this record.",
              pleaseSelectLanguage: "Please select a language",
              selectOrSearchLanguageHint:
                "Select or search for a language to generate the document accordingly.",
              filters: {
                reset: "Remove Filters",
                locator: {
                  label: "Filter drafts by the time zone of their creation.",
                  messages: {
                    title: "Location",
                  },
                },
                creator: {
                  sideLabel: "Type to filter drafts by username.",
                  messages: {
                    title: "Creator",
                    subtitle: "Toggle to filter drafts by creator.",
                    subtitleMap: {
                      true: "Showing only drafts created by me.",
                      false: "Excluding drafts created by me.",
                      null: "Toggle to filter drafts by creator.",
                    },
                  },
                },
                editor: {
                  sideLabel: "Type to filter drafts by username.",
                  messages: {
                    title: "Editor",
                    subtitle: "Toggle to filter drafts by editor.",
                    subtitleMap: {
                      true: "Showing only drafts edited by me.",
                      false: "Excluding drafts edited by me.",
                      null: "Toggle to filter drafts by editor.",
                    },
                  },
                },
                created: {
                  label: "Filter drafts by their creation date range.",
                  messages: {
                    title: "Created",
                  },
                },
                updated: {
                  label: "Filter drafts by their last updated date range.",
                  messages: {
                    title: "Updated",
                  },
                },
              },
            },
          },
          table: {
            toolbar: "Documents",
            header: {
              name: "Name",
              type: "Type",
              confidentiality: "Confidentiality",
              description: "Description",
              language: "Languages (files)",
              revision: "Revision",
              folderStructure: "Folder Structure",
              actions: "Actions",
            },
          },
          stepper: {
            vStepperItem: {
              "1": "Base Info",
              "2": "Input Files",
              "3": "Verify",
            },
            vStepperWindowItem: {
              "1": {
                type: {
                  label: "Type",
                },

                confidentiality: {
                  label: "Confidentiality",
                },
                name: {
                  label: "Name",
                },
                description: {
                  label: "Description",
                },
                revision: {
                  label: "Revision",
                },
                competences: {
                  label: "Competences",
                },
              },
            },
            actions: {
              prev: "Previous",
              next: "Next",
            },
          },
        },
        competences: {
          name: "COMPETENCES",
          table: {
            toolbar: "Competences",
            header: {
              code: "Code",
              position: "Position",
              name: "Name",
              folderStructure: "Folder Structure",
              actions: "Actions",
            },
          },
          form: {
            code: "Code",
            position: "Position",
            name: {
              label: "Name",
              hint: "This value represents the combination of the Code and Position",
            },
          },
        },
      },
    },
    admin: {
      name: "Admin",
      tabs: {
        "user-info": {
          name: "User Info",
          table: {
            toolbar: "User Info",
            header: {
              username: "Username",
              domain: "Domain",
              position: "Position",
              department: "Department",
              decisionMaker: "Decision Maker",
              actions: "Actions",
            },
          },
        },
        "user-permissions": {
          name: "User Permissions",
          table: {
            toolbar: "User Permissions",
            header: {
              username: "Username",
              confidentiality: "Confidentiality",
              groups: "Groups",
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
        dcr: {
          name: "Document Change Request",
          table: {
            toolbar: "Requests",
            header: {
              no: "No",
              tags: "Tags",
              status: "Status",
              priority: "Priority",
              docxNumber: "Document Name",
              docxRevision: "Document Revision",
              originator: "Originator",
              checker: "Checker",
              approver: "Approver",
              registerer: "Registerer",
              review: "Review",
              actions: "Actions",
            },
          },
          kpi: {
            table: {
              header: {
                no: "No",
                username: "Username",
                role: "Role",
                since: "Action Available Date",
                taken: "Action Taken Date",
                elapsed: "Time Elapsed",
              },
              toolbar: "Reviews",
            },
            legend: {
              title: "Legend: Time Elapsed Color",
              priority: "{priority} priority:",
              days: "days",
            },
            view: {
              title: "View",
              groupBy: "Select Group By",
              group: {
                no: "No",
                username: "Username",
                role: "Role",
                taken: "Taken",
                priority: "Priority",
              },
            },
            filters: {
              title: "Filters",
              myActions: "Show only my actions",
              departments: "Restrict to departments",
            },
          },
          review: {
            tooltip: "Open Review",
            close: "Close",
            title: "Review",
            timeline: "Timeline",
            comment: "Comment",
            files: "Files",
            no_files: "No files found",
            no_affected: "No description of changes",
            changes: "Changes",
            alert: {
              reviewControlsAppearOnComplete:
                "Review controls will appear once the document change request is 'Complete'.",
              reviewGranted: "Review for this document change request has been granted.",
              reviewControlsAppearOnChecked: "Review controls will appear once checked.",
            },
            reviewControls: {
              cancel: "Cancel",
              confirm: "Confirm",
              commentOptional: "Comment (optional)",
              check: "Check",
              approve: "Approve",
              reject: "Reject",
              register: "Register",
              unregister: "Unregister",
              variant: {
                check: "checked",
                approve: "approved",
                reject: "rejected",
                register: "registered",
                unregister: "unregistered",
                question: "Are you sure you want to mark this document change as '{variant}'?",
              },
            },
          },
          stepper: {
            actions: {
              prev: "Previous",
              next: "Next",
              submit: "Review your details before submitting.",
            },
            info: {
              reviewers_title: "Reviewers",
              reviewers_text:
                "To be selectable, the Checker and Registerer must have permission to access the document change request. The Approver must also have decision maker status.",
              check_and_approve_title: "Notifications",
              check_and_approve_text:
                "Upon completion or update of a document change request, a notification is issued to the Checker. After the request is reviewed, the Approver is notified. Once approval is granted, the Registerer receives a notification. In the event of a review failure, the Originator is informed. Notifications are delivered via the intranet and email, with copies (cc) also sent to other departmental decision makers who have access to the document change request.",
            },
            error: {
              revisionToLow:
                "Found an uploaded document of such number having revision {revision}. Please enter a higher revision.",
            },
            message: {
              revisionGreaterThanExpected:
                "You have entered a revision number which is greater than the next expected revision.",
            },
            vStepperItem: {
              "1": "Info",
              "2": "Changes",
              "3": "Files",
              "4": "Reviewers",
              "5": "Training",
              "6": "Verify",
            },
            vStepperWindowItem: {
              "1": {
                tags: {
                  name: "Tags",
                  hint: "Enter characteristic keywords that describe the changes in the document",
                },
                source: {
                  name: "Document Source",
                  hint: "",
                  previously_uploaded: "Previously uploaded",
                  not_previously_uploaded_new: "Not previously uploaded, new document",
                  not_previously_uploaded_existing: "Not previously uploaded, existing document",
                },
                docxNumber: {
                  name: "Document Name",
                  hint: "e.g., BYD-QA-SPE-MOD-0005",
                },
                docxRevision: "Document Revision",
                docxReference: {
                  name: "Document Reference",
                  hint: "",
                },
                priority: {
                  name: "Priority",
                  hint: "Determines the position of the request in the table. Low is placed last.",
                  low: "Low",
                  medium: "Medium",
                  high: "High",
                },
              },
              "2": {
                changes: "Changes",
              },
              "3": {
                files: "Files",
              },
              "4": {
                checker: {
                  name: "Checker",
                  hint: "Type to search.",
                },
                approver: {
                  name: "Approver",
                  hint: "Type to search.",
                },
                registerer: "Registerer",
              },
              "5": {
                affectedCompetences: "Affected Competences",
                requireAcknowledgmentOrTraining: {
                  name: "Require Acknowledgment or Training",
                  acknowledgment: "Acknowledgment",
                  training: "Training",
                },
                trainingDetails: "Training Details",
              },
            },
          },
        },
        dcn: {
          name: "Document Change Notice",
          table: {
            toolbar: "Notices",
            header: {
              no: "No",
              tags: "Tags",
              status: "Status",
              docxNumber: "Document Name",
              docxRevision: "Document Revision",
              docxReference: "Document Reference",
              registerer: "Registerer",
              info: "Info",
            },
          },
        },
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
      },
    },
    safety: {
      name: "Safety",
      tabs: {
        "Manage Acknowledgment": {
          name: "DEPARTMENTS",
        },
        "Document Acknowledged": {
          name: "DEPARTMENTS",
        },
      },
    },
    analytic: {
      name: "Analytic",
      tabs: {
        sky: {
          name: "SKY",
        },
      },
    },
  },
};

export { enT };
