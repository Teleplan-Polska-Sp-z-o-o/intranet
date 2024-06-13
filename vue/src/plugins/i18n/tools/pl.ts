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
        instructions: {
          name: "INSTRUKCJE",
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
        visuals: {
          name: "POMOCE WIZUALNE",
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
        assistant: {
          name: "ASYSTENT",
          title: "AI Asystent Dokumentów ",
          send: "Wyślij",
          placeholder: "Zadaj mi pytanie.",
          new: "Nowa Rozmowa",
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
              confidentiality: "Poufność",
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
              confidentiality: "Poufność",
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
              viewPcr: "Wyświetl/Zatwierdź PCR",
              numberOfNotice: "Nr powiadomienia",
              actions: "Akcje",

              requestedBy: "Zgłaszający",
              customerContactPerson: "Osoba kontaktowa klienta",
              customerContactEmail: "E-mail kontaktowy klienta",
              reconextContactPerson: "Osoba kontaktowa Reconext",
              costOfImplementation: "Koszt wdrożenia",
              impacts: "Skutki",
              riskAnalysis: "Analiza ryzyka",
              status: "Status",
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
              reconextOwner: "Wnioskodawca",
              personDesignatedForImplementation: "Osoba Wyznaczona",
              noticeDate: "Data Powiadomienia",
              modelOrProcessImpacted: "Wpływ Na",
              areDocumentationChangesRequired: "Zmiany w Dokumentacji Wymagane",
              isNewDocumentationRequired: "Nowa Dokumentacja Wymagana",
              isCustomerApprovalRequired: "Wymagana Zgoda Klienta",
              status: "Status",
              engineeringDepartmentApproval: "Zatwierdzenie Inż.",
              qualityDepartmentApproval: "Zatwierdzenie Jak.",
              dedicatedDepartmentApproval: "Zatwierdzenie Ded.",
              closureDate: "Data Zamknięcia",
              viewPcn: "Wyświetl/Zatwierdź PCN",
              actions: "Akcje",
            },
          },
          stepper: {
            actions: {
              prev: "Poprzedni",
              next: "Następny",
            },
            updateDescriptionRule: "Wymagana aktualizacja opisu.",
            qualityDepartmentRule: "Działy jakości i inżynierii muszą się różnić.",
            changeDescription: "Opis Zmiany",
            vStepperItem: {
              "1": "Opis Zmiany",
              "2": "Dokumentacja",
              "3": "Zatwierdzenia",
              "4": "Weryfikacja",
            },
            vStepperWindowItem: {
              "2": {
                areDocumentationChangesRequired: "Czy wymagane są zmiany w dokumentacji",
                listOfDocumentationToChange: "Lista dokumentów do zmiany",
                isNewDocumentationRequired: "Czy nowa dokumentacja jest wymagana",
                listOfDocumentationToCreate: "Lista dokumentów do stworzenia",
              },
              "3": {
                personDesignatedForImplementation: "Osoba Wyznaczona do Wdrożenia",
                isCustomerApprovalRequired: "Czy wymagana jest zgoda klienta",
                engineeringDepartmentName: "Wybierz Dział Inżynierii",
                qualityDepartmentName: "Wybierz Dział Jakości",
                updateDescription: "Aktualizuj Opis",
              },
            },
            alerts: {
              departmentsRequiredForApproval: {
                title: "Proces Zatwierdzania PCN",
                initial: {
                  title: "Inicjalizacja",
                  text: "Formularz PCN wymaga określenia odpowiednich działów Inżynierii i Jakości, aby Intranet mógł zidentyfikować decydentów. Po wypełnieniu wszystkich pól w PCN system automatycznie informuje odbiorców o nadchodzącej akcji, jaką mogą podjąć, aby rozpocząć proces zatwierdzania.",
                },
                "required-review": {
                  title: "Przegląd Inżynierii i Jakości",
                  text: "PCN zostanie najpierw przekazany do przeglądu przez dział Inżynierii. Po uzyskaniu zgody od dowolnego z decydentów działu Inżynierii, PCN automatycznie zamknie się i przejdzie do dalszego przeglądu przez dział Jakości.",
                },
                "optional-review": {
                  title: "Przegląd Dedykowanego Działu (Opcjonalny)",
                  text: "Jeśli dedykowany dział PCR dotyczy konkretnego obszaru poza Inżynierią i Jakością, system również kieruje wniosek o zatwierdzenie do wyznaczonych decydentów w tym dziale.",
                },
              },
              remainder: {
                title: "Przypomnienie",
                text: "Proszę pamiętać, że każda aktualizacja zamkniętego powiadomienia automatycznie spowoduje jego ponowne otwarcie w celu dalszej weryfikacji i działania.",
                fields: "Podgląd kluczowych zaktualizowanych pól.",
              },
              emptyUpdate: {
                title: "Ostrzeżenie",
                text: "Proszę pamiętać, że kontynuowanie bez wprowadzenia jakichkolwiek faktycznych zmian do zamkniętego powiadomienia nie przyniesie żadnych skutków.",
              },
            },
          },
        },
      },
    },
  },
};

export { plT };
