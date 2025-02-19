// // po kolei przetlumaczyc change
// const czT = {
//   tools: {
//     common: {
//       new: "Nový",
//       edit: "Upravit",
//       delete: "Smazat",
//       cancel: "Zrušit",
//       save: "Uložit",
//       ok: "OK",
//       search: "Hledat",
//       deleteItemConfirmation: "Opravdu chcete tento položku smazat?",
//       deleteDocumentConfirmation:
//         "Smazání tohoto dokumentu ovlivní také všechny související soubory.",
//       filters: "Filtrujte pomocí pokročilých kritérií",
//     },
//     chart: {
//       post: {
//         title: "Analýza dat",
//         subtitle: "Přehled nahrávání podle uživatele a množství za posledních šest měsíců",
//       },
//     },
//     chips: {
//       filterByType: "Filtrovat podle typu dokumentu",
//       filterByFolder: "Filtrovat podle složek",
//       empty: "Žádné složky nebyly nalezeny",
//       departments: "Oddělení",
//       workstations: "Pracoviště",
//       programs: "Programy",
//       category: "Kategorie",
//       subcategory: "Podkategorie",
//       subSubcategory: "Pod-podkategorie",
//     },
//     documents: {
//       name: "Dokumenty",
//       table: {
//         header: {
//           name: "Název",
//           description: "Popis",
//           view_document: {
//             name: "Zobrazit dokument",
//             select: "Vybrat jazyk",
//             tooltip: "Otevřít na nové kartě",
//           },
//           quick: {
//             name: "Rychlý přístup",
//             tooltip_add: "Přidat do rychlého přístupu",
//             tooltip_remove: "Odebrat z rychlého přístupu",
//           },
//         },
//       },
//       tabs: {
//         all: {
//           name: "DOKUMENTY",
//           table: {
//             toolbar: "Dokumenty",
//           },
//         },
//         instructions: {
//           name: "INSTRUKCE",
//           table: {
//             toolbar: "Instrukce",
//           },
//         },
//         visuals: {
//           name: "VIZUÁLNÍ POMŮCKY",
//           table: {
//             toolbar: "Vizuální pomůcky",
//           },
//         },
//         msd: {
//           name: "Systémy řízení",
//           table: {
//             toolbar: "Systémy řízení",
//           },
//         },
//         quick: {
//           name: "Rychlý přístup",
//           table: {
//             toolbar: "Dokumenty",
//           },
//         },
//         recently: {
//           name: "Nedávno prohlížené",
//           table: {
//             toolbar: "Dokumenty",
//           },
//         },
//         assistant: {
//           name: "ASISTENT",
//           title: "AI Dokumentový asistent",
//           send: "Odeslat",
//           placeholder: "Zeptejte se mě na cokoli.",
//           new: "Nová konverzace",
//         },
//       },
//     },
//     matrix: {
//       name: "Matice",
//       tabs: {
//         departments: {
//           name: "ODDĚLENÍ",
//           table: {
//             toolbar: {
//               departments: "Oddělení",
//               categories: "Kategorie",
//               subcategories: "Podkategorie",
//             },
//             header: {
//               name: "Název",
//               actions: "Akce",
//             },
//           },
//         },
//         documents: {
//           name: "DOKUMENTY",
//           creator: {
//             link: {
//               title: "Online Tvůrce Dokumentů",
//               subtitle: "Zjednodušte, vytvářejte a sdílejte",
//               text: "Rozlučte se s nahráváním souborů dokumentů. Náš online tvůrce dokumentů nabízí intuitivní a uživatelsky přívětivé rozhraní, které zajišťuje konzistentní zkušenost pokaždé. Ideální pro rychlou a efektivní tvorbu profesionálních dokumentů, je to moderní řešení pro bezproblémovou spolupráci a produktivitu.",
//               button: "Otevřít nástroj",
//             },
//             mainView: {
//               title: {
//                 create: "Chystáte se začít nový návrh",
//                 update: "Aktualizace návrhu s názvem '{name}'",
//               },
//               tabs: {
//                 dashboard: "Nástěnka",
//                 new: "Vytvořit",
//                 drafts: "Návrhy",
//               },
//             },
//             createNew: {
//               stepper: {
//                 actions: {
//                   previous: "Předchozí",
//                   next: "Další",
//                   save: "Uložit",
//                   saveDialog: {
//                     title: "Potvrzení",
//                     text: "Opravdu chcete tento návrh uložit?",
//                   },
//                 },
//                 info: {
//                   product: "Produkt",
//                   productHint: "Zadejte název komodity nebo položky.",
//                   owner: "Vlastník",
//                   ownerHint: "Uveďte osobu odpovědnou za proces.",
//                   lastUpdate: "Poslední aktualizace",
//                   lastUpdateHint: "Datum poslední aktualizace tohoto dokumentu.",
//                   author: "Autor",
//                   authorHint: "Osoba, která provedla poslední změnu.",
//                   created: "Vytvořeno",
//                   createdHint: "Datum, kdy byl dokument původně vytvořen.",
//                   trainingCodes: "Kódy školení",
//                   trainingCodesHint: "Vyberte kódy pro související školení.",
//                   esd: "ESD",
//                   esdHint:
//                     "Vyberte kategorii ESD (Elektrostatický výboj) nebo zvolte N/A, pokud se neaplikuje.",
//                 },
//                 before: {
//                   documentTitle: "Název dokumentu",
//                   documentTitleHint: "Název by měl být jasný a výstižný.",
//                   documentTemplate: "Šablona dokumentu",
//                   documentTemplateHint:
//                     "Vyberte šablonu pro loga na titulní straně nebo zvolte 'Vlastní' pro nahrání vlastního obrázku.",
//                   documentTemplateItems: ["BYD-QA-TMP-0001_01"],
//                   logosTemplate: "Šablona log",
//                   logosTemplateHint:
//                     "Vyberte šablonu pro loga na titulní straně nebo zvolte 'Vlastní' pro nahrání vlastního obrázku.",
//                   uploadImageLabel: "Nahrát obrázek",
//                   uploadImageHint: "Přetáhněte soubor sem nebo klikněte pro nahrání",
//                   documentId: "ID dokumentu",
//                   documentRevision: "Revize dokumentu",
//                   documentRevisionPrefix: "R",
//                   documentRevisionPrefixSingleDigit: "R0",
//                   validationRules: {
//                     title: "Název je povinný",
//                     documentTemplate: "Šablona dokumentu je povinná",
//                   },
//                   content: {
//                     segmentBody: "Tělo segmentu",
//                     addButton: "Přidat",
//                     segmentTitle: "Název segmentu",
//                     segmentTitleHint: "Upravit název segmentu.",
//                     insertBefore: "Vložit před",
//                     insertAfter: "Vložit za",
//                     remove: "Odstranit",
//                     untitledSegment: "Nepojmenovaný segment",
//                   },
//                 },
//               },
//             },
//             drafts: {
//               recordId: "ID záznamu",
//               draftName: "Název návrhu",
//               documentTitle: "Název dokumentu",
//               documentIdRev: "ID dokumentu-Rev",
//               actions: "Akce",
//               deleteConfirmation: "Opravdu chcete tuto položku smazat?",
//               cancel: "Zrušit",
//               ok: "OK",
//               selectDocumentLanguage: "Vyberte jazyk dokumentu",
//               documentLanguage: "Jazyk dokumentu",
//               search: "Hledat",
//               editRecordTooltip: "Upravit tento záznam.",
//               removeRecordTooltip: "Odebrat tento záznam.",
//               generateDocumentTooltip: "Vygenerovat dokument na základě tohoto záznamu.",
//               pleaseSelectLanguage: "Vyberte jazyk",
//               selectOrSearchLanguageHint:
//                 "Vyberte nebo vyhledejte jazyk pro vygenerování dokumentu.",
//             },
//           },
//           table: {
//             toolbar: "Dokumenty",
//             header: {
//               name: "Název",
//               type: "Typ",
//               confidentiality: "Důvěrnost",
//               description: "Popis",
//               language: "Jazyky (soubory)",
//               revision: "Revize",
//               folderStructure: "Struktura složek",
//               actions: "Akce",
//             },
//           },
//           stepper: {
//             vStepperItem: {
//               "1": "Základní informace",
//               "2": "Vstupní soubory",
//               "3": "Ověření",
//             },
//             vStepperWindowItem: {
//               "1": {
//                 type: {
//                   label: "Typ",
//                 },
//                 confidentiality: {
//                   label: "Důvěrnost",
//                 },
//                 name: {
//                   label: "Název",
//                 },
//                 description: {
//                   label: "Popis",
//                 },
//                 revision: {
//                   label: "Revize",
//                 },
//                 competences: {
//                   label: "Kompetence",
//                 },
//               },
//             },
//             actions: {
//               prev: "Předchozí",
//               next: "Další",
//             },
//           },
//         },
//         competences: {
//           name: "KOMPETENCE",
//           table: {
//             toolbar: "Kompetence",
//             header: {
//               code: "Kód",
//               position: "Pozice",
//               name: "Název",
//               folderStructure: "Struktura složek",
//               actions: "Akce",
//             },
//           },
//           form: {
//             code: "Kód",
//             position: "Pozice",
//             name: {
//               label: "Název",
//               hint: "Tato hodnota představuje kombinaci kódu a pozice",
//             },
//           },
//         },
//       },
//     },
//     admin: {
//       name: "Administrace",
//       tabs: {
//         "user-info": {
//           name: "Uživatelské informace",
//           table: {
//             toolbar: "Uživatelské informace",
//             header: {
//               username: "Uživatelské jméno",
//               domain: "Doména",
//               position: "Pozice",
//               department: "Oddělení",
//               decisionMaker: "Rozhodovatel",
//               actions: "Akce",
//             },
//           },
//         },
//         "user-permissions": {
//           name: "Uživatelská oprávnění",
//           table: {
//             toolbar: "Uživatelská oprávnění",
//             header: {
//               username: "Uživatelské jméno",
//               confidentiality: "Důvěrnost",
//               groups: "Skupiny",
//               actions: "Akce",
//             },
//           },
//         },
//         news: {
//           name: "Novinky",
//           table: {
//             toolbar: "Novinky",
//             header: {
//               title: "Název",
//               subtitle: "Podnázev",
//               actions: "Akce",
//             },
//           },
//         },
//       },
//     },
//     change: {
//       name: "Změna",
//       tabs: {
//         dcr: {
//           name: "Žádost o změnu dokumentu",
//           table: {
//             toolbar: "Žádosti",
//             header: {
//               no: "Č.",
//               tags: "Štítky",
//               status: "Stav",
//               priority: "Priorita",
//               docxNumber: "Název dokumentu",
//               docxRevision: "Revize dokumentu",
//               originator: "Původce",
//               checker: "Kontrolor",
//               approver: "Schvalovatel",
//               registerer: "Registrátor",
//               review: "Revize",
//               actions: "Akce",
//             },
//           },
//           kpi: {
//             table: {
//               header: {
//                 no: "Č.",
//                 username: "Uživatelské jméno",
//                 role: "Role",
//                 since: "Datum dostupnosti akce",
//                 taken: "Datum provedení akce",
//                 elapsed: "Uplynulý čas",
//               },
//               toolbar: "Recenze",
//             },
//             legend: {
//               title: "Legenda: Barva uplynulého času",
//               priority: "{priority} priorita:",
//               days: "dny",
//             },
//             view: {
//               title: "Zobrazení",
//               groupBy: "Vyberte seskupení podle",
//               group: {
//                 no: "Č.",
//                 username: "Uživatelské jméno",
//                 role: "Role",
//                 taken: "Provedeno",
//                 priority: "Priorita",
//               },
//             },
//             filters: {
//               title: "Filtry",
//               myActions: "Zobrazit pouze mé akce",
//               departments: "Omezit na oddělení",
//             },
//           },
//           review: {
//             tooltip: "Open Review",
//             close: "Close",
//             title: "Review",
//             timeline: "Timeline",
//             comment: "Comment",
//             files: "Files",
//             no_files: "No files found",
//             no_affected: "No description of changes",
//             changes: "Changes",
//             alert: {
//               reviewControlsAppearOnComplete:
//                 "Review controls will appear once the document change request is 'Completed'.",
//               reviewGranted: "The review of this document change request has been approved.",
//               reviewControlsAppearOnChecked: "Review controls will appear after checking.",
//             },
//             reviewControls: {
//               cancel: "Cancel",
//               confirm: "Confirm",
//               commentOptional: "Comment (optional)",
//               check: "Check",
//               approve: "Approve",
//               reject: "Reject",
//               register: "Register",
//               unregister: "Unregister",
//               variant: {
//                 check: "checked",
//                 approve: "approved",
//                 reject: "rejected",
//                 register: "registered",
//                 unregister: "unregistered",
//                 question: "Do you really want to mark this document change as '{variant}'?",
//               },
//             },
//           },
//           stepper: {
//             actions: {
//               prev: "Předchozí",
//               next: "Další",
//               submit: "Zkontrolujte své údaje před odesláním.",
//             },
//             info: {
//               reviewers_title: "Revizoři",
//               reviewers_text:
//                 "Aby bylo možné vybrat kontrolora a registrátora, musí mít oprávnění k přístupu k žádosti o změnu dokumentu. Schvalovatel musí mít status rozhodovatele.",
//               check_and_approve_title: "Oznámení",
//               check_and_approve_text:
//                 "Po dokončení nebo aktualizaci žádosti o změnu dokumentu je oznámení odesláno kontrolorovi. Po kontrole je informován schvalovatel a po schválení je upozorněn registrátor. V případě selhání revize je informován původce.",
//             },
//             error: {
//               revisionToLow:
//                 "Byl nalezen nahraný dokument s číslem revize {revision}. Zadejte vyšší revizi.",
//             },
//             message: {
//               revisionGreaterThanExpected:
//                 "Zadali jste číslo revize vyšší než očekávaná další revize.",
//             },
//             vStepperItem: {
//               "1": "Informace",
//               "2": "Změny",
//               "3": "Soubory",
//               "4": "Revizoři",
//               "5": "Školení",
//               "6": "Ověření",
//             },
//           },
//         },
//         dcn: {
//           name: "Oznámení o změně dokumentu",
//           table: {
//             toolbar: "Oznámení",
//             header: {
//               no: "Číslo",
//               tags: "Štítky",
//               status: "Stav",
//               docxNumber: "Název dokumentu",
//               docxRevision: "Revize dokumentu",
//               docxReference: "Odkaz na dokument",
//               registerer: "Registrátor",
//               info: "Informace",
//             },
//           },
//         },
//         pcr: {
//           name: "Žádost o změnu procesu",
//           table: {
//             toolbar: "Žádosti",
//             header: {
//               numberOfRequest: "Číslo žádosti",
//               requestDate: "Datum žádosti",
//               internalOrExternal: "Interní/Externí",
//               reconextOwner: "Vlastník",
//               dedicatedDepartment: "Oddělení",
//               program: "Program",
//               modelOrProcessImpacted: "Dopad",
//               dateNeeded: "Datum potřeby",
//               assessment: "Posouzení",
//               approvedOrRejectedBy: "Uzavřeno kým",
//               closureDate: "Datum uzavření",
//               viewPcr: "Zobrazit/Schválit PCR",
//               numberOfNotice: "Číslo oznámení",
//               actions: "Akce",
//             },
//           },
//         },
//         pcn: {
//           name: "Oznámení o změně procesu",
//           table: {
//             toolbar: "Oznámení",
//             header: {
//               numberOfNotice: "Číslo oznámení",
//               numberOfRequest: "Číslo žádosti",
//               reconextOwner: "Žadatel",
//               personDesignatedForImplementation: "Osoba odpovědná za realizaci",
//               noticeDate: "Datum oznámení",
//               modelOrProcessImpacted: "Dopad",
//               areDocumentationChangesRequired: "Vyžaduje změnu dokumentace",
//               isNewDocumentationRequired: "Je požadována nová dokumentace",
//               isCustomerApprovalRequired: "Vyžaduje schválení zákazníkem",
//               status: "Stav",
//               engineeringDepartmentApproval: "Schválení inženýrství",
//               qualityDepartmentApproval: "Schválení kvality",
//               dedicatedDepartmentApproval: "Schválení oddělení",
//               closureDate: "Datum uzavření",
//               viewPcn: "Zobrazit/Schválit PCN",
//               actions: "Akce",
//             },
//           },
//         },
//       },
//     },
//     safety: {
//       name: "Bezpečnost",
//       tabs: {
//         "Manage Acknowledgment": {
//           name: "ODDĚLENÍ",
//         },
//         "Document Acknowledged": {
//           name: "ODDĚLENÍ",
//         },
//       },
//     },
//     analytic: {
//       name: "Analytika",
//       tabs: {
//         sky: {
//           name: "SKY",
//         },
//       },
//     },
//   },
// };

// export { czT };
