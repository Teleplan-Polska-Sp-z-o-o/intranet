const plT = {
  tools: {
    common: {
      new: "Nowy",
      edit: "Edytuj",
      delete: "Usuń",
      cancel: "Anuluj",
      save: "Zapisz",
      ok: "OK",
      search: "Szukaj",
      deleteItemConfirmation:
        "Usunięcie tego elementu wpłynie również na wszystkie jego elementy podrzędne.",
      deleteDocumentConfirmation:
        "Usunięcie tego dokumentu spowoduje również usunięcie wszystkich powiązanych z nim plików.",
      filters: "Filtruj według zaawansowanych kryteriów",
    },
    chips: {
      departments: "Działy",
      workstations: "Stanowiska pracy",
      programs: "Programy",
    },
    documents: {
      name: "Dokumenty",
      tabs: {
        my_documents: {
          name: "MOJE DOKUMENTY",
          table: {
            toolbar: "",
            select_lang: "",
          },
        },
        my_favorites: {
          name: "MOJE ULUBIONE",
          table: {
            toolbar: "",
            select_lang: "",
          },
        },
        all_instructions: {
          name: "WSZYSTKIE INSTRUKCJE",
          table: {
            toolbar: "Instrukcje",
            select_lang: "Wybierz język",
            header: {
              name: "Nazwa",
              description: "Opis",
              view_document: "Zobacz dokument",
            },
          },
        },
        all_visuals: {
          name: "WSZYSTKIE POMOCE WIZUALNE",
          table: {
            toolbar: "Pomoce wizualne",
            select_lang: "Wybierz język",
            header: {
              name: "Nazwa",
              description: "Opis",
              view_document: "Zobacz dokument",
            },
          },
        },
        recently_browsed: {
          name: "OSTATNIO PRZEGLĄDANE",
          table: {
            toolbar: "",
            select_lang: "",
          },
        },
      },
    },
    matrix: {
      name: "Macierz",
      tabs: {
        departments: {
          name: "DZIAŁY",
          table: {
            toolbar: {
              departments: "Działy",
              workstations: "Stanowiska pracy",
              programs: "Programy",
            },
            header: {
              name: "Nazwa",
              actions: "Akcje",
            },
          },
        },
        documents: {
          name: "DOKUMENTY",
          table: {
            toolbar: "Dokumenty",
            header: {
              name: "Nazwa",
              type: "Typ",
              description: "Opis",
              language: "Języki (pliki)",
              revision: "Wersja",
              subcategory: "Podkategoria",
              actions: "Akcje",
            },
          },
        },
      },
      departments: {
        department: "Dział",
        program: "Program",
        workstation: "Stanowisko pracy",
      },
    },
    admin: {
      name: "Admin",
      tabs: {
        permissions: {
          name: "Uprawnienia",
          table: {
            toolbar: "Uprawnienia",
            header: {
              username: "Nazwa użytkownika",
              domain: "Domena",
              permission: "Uprawnienie",
              position: "Pozycja",
              department: "Dział",
              decisionMaker: "Osoba Decyzyjna",
              actions: "Akcje",
            },
          },
        },
        news: {
          name: "Wiadomości",
          table: {
            toolbar: "Wiadomości",
            header: {
              title: "Tytuł",
              subtitle: "Podtytuł",
              actions: "Akcje",
            },
          },
        },
      },
    },
    change: {
      name: "Zmiana",
      tabs: {
        pcr: {
          name: "Prośba o zmianę procesu",
          table: {
            toolbar: "Prośby",
            header: {
              numberOfRequest: "Nr",
              requestDate: "Data prośby",
              internalOrExternal: "Wewnętrzny/Zewnętrzny",
              reconextOwner: "Właściciel",
              dedicatedDepartment: "Dedykowany dział",
              program: "Program",
              modelOrProcessImpacted: "Wpływ na",
              dateNeeded: "Data potrzeby",
              assessment: "Ocena",
              approvedOrRejectedBy: "Zamknięte przez",
              closureDate: "Data zamknięcia",
              viewPcr: "Wyświetl PCR",
              numberOfNotice: "Nr powiadomienia",
              actions: "Akcje",
            },
          },
          stepper: {
            actions: {
              prev: "Poprzedni",
              next: "Następny",
            },
            changeReason: "Powód zmiany",
            changeDescription: "Opis zmiany",
            updateDescriptionRule: "Opis aktualizacji jest wymagany.",
            customerContactPersonRule:
              "Proszę podać zarówno imię, jak i nazwisko, oddzielone spacją.",
            customerContactEmailRule: "Adres e-mail musi być poprawny.",
            vStepperItem: {
              "1": "Podstawowe informacje",
              "2": "Informacje kontaktowe",
              "3": "Data potrzebna",
              "4": "Informacje opisowe",
              "5": "Sprawdź",
            },
            vStepperWindowItem: {
              "1": {
                internalOrExternal: "Wewnętrzny lub Zewnętrzny",
                dedicatedDepartment: "Dedykowany dział",
                program: "Program",
                reconextOwner: "Właściciel Reconext",
              },
              "2": {
                customerContactPerson: "Osoba kontaktowa klienta",
                customerContactEmail: "E-mail kontaktowy klienta",
                reconextContactPerson: "Osoba kontaktowa Reconext",
              },
              "3": {
                dateNeeded: "Wyczyść datę potrzebnej implementacji",
              },
              "4": {
                modelOrProcessImpacted: "Wpływ na model lub proces",
                costOfImplementation: "Koszt wdrożenia",
                impacts: "Wpływy",
                riskAnalysis: "Analiza ryzyka",
                updateDescription: "Opis aktualizacji",
              },
            },
            alerts: {
              remainder: {
                title: "Przypomnienie",
                text: "Informujemy, że każda aktualizacja zamkniętego zapytania spowoduje automatyczne jego ponowne otwarcie w celu dalszej analizy i działań.",
                fields: "Podgląd kluczy zaktualizowanych pól.",
              },
              emptyUpdate: {
                title: "Ostrzeżenie",
                text: "Prosimy zauważyć, że kontynuowanie bez faktycznej edycji jakichkolwiek pól w zamkniętym zgłoszeniu nadal spowoduje jego ponowne otwarcie.",
              },
              removalOfNotice: {
                title: "Ostrzeżenie",
                text: "Proszę pamiętać, że kontynuacja spowoduje usunięcie powiązanego powiadomienia o zmianie.",
              },
            },
          },
        },
        pcn: {
          name: "Powiadomienie o Zmianie Procesu",
          table: {
            toolbar: "Powiadomienia",
            header: {
              numberOfNotice: "Nr",
              numberOfRequest: "Nr Wniosku",
              reconextOwner: "Wnioskujący",
              noticeDate: "Data Powiadomienia",
              modelOrProcessImpacted: "Wpływ Na",
              areDocumentationChangesRequired: "Zmiany w Dokumentacji",
              isNewDocumentationRequired: "Nowa Dokumentacja",
              isCustomerApprovalRequired: "Wymagana Akceptacja Klienta",
              status: "Status",
              closureDate: "Data zamknięcia",
              viewPcn: "Wyświetl PCN",
              actions: "Działania",
            },
          },
        },
      },
    },
  },
};

export { plT };
