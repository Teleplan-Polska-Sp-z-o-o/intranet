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
      deleteItemConfirmation: "Czy na pewno chcesz usunąć ten element?",
      deleteDocumentConfirmation:
        "Usunięcie tego dokumentu spowoduje również usunięcie wszystkich powiązanych z nim plików.",
      filters: "Filtruj według zaawansowanych kryteriów",
    },
    chart: {
      post: {
        title: "Analiza Danych",
        subtitle: "Przegląd uploadów według użytkownika i ilości z ostatnich sześciu miesięcy",
      },
    },
    chips: {
      filterByType: "Filtruj według typu dokumentu",
      filterByFolder: "Filtruj według folderów",
      empty: "Nie znaleziono folderów",
      departments: "Działy",
      workstations: "Stanowiska pracy",
      programs: "Programy",
      category: "Kategoria",
      subcategory: "Podkategoria",
      subSubcategory: "Pod-podkategoria",
    },
    documents: {
      name: "Dokumenty",
      table: {
        header: {
          name: "Nazwa",
          description: "Opis",
          view_document: {
            name: "Zobacz Dokument",
            select: "Wybierz Język",
            tooltip: "Otwórz w nowej karcie",
          },
          quick: {
            name: "Szybki Dostęp",
            tooltip_add: "Dodaj do Szybkiego Dostępu",
            tooltip_remove: "Usuń z Szybkiego Dostępu",
          },
        },
      },
      tabs: {
        all: {
          name: "DOKUMENTY",
          table: {
            toolbar: "Dokumenty",
          },
        },
        instructions: {
          name: "INSTRUKCJE",
          table: {
            toolbar: "Instrukcje",
          },
        },
        visuals: {
          name: "POMOCE WIZUALNE",
          table: {
            toolbar: "Pomoce wizualne",
          },
        },
        msd: {
          name: "Systemy Zarządzania",
          table: {
            toolbar: "Systemy Zarządzania",
          },
        },
        //
        quick: {
          name: "Szybki dostęp",
          table: {
            toolbar: "Dokumenty",
          },
        },
        recently: {
          name: "Ostatnio przeglądane",
          table: {
            toolbar: "Dokumenty",
          },
        },
        //
        assistant: {
          name: "ASYSTENT",
          title: "AI Asystent Dokumentów ",
          send: "Wyślij",
          placeholder: "Zadaj mi pytanie.",
          new: "Nowa Rozmowa",
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
              // workstations: "Stanowiska pracy",
              // programs: "Programy",
              categories: "Kategorie",
              subcategories: "Podkategorie",
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
              folderStructure: "Struktura Folderów",
              actions: "Akcje",
            },
          },
          stepper: {
            vStepperItem: {
              "1": "Podstawowe Informacje",
              "2": "Pliki Wejściowe",
              "3": "Weryfikacja",
            },
            vStepperWindowItem: {
              "1": {
                type: {
                  label: "Typ",
                },
                confidentiality: {
                  label: "Poufność",
                },
                name: {
                  label: "Nazwa",
                },
                description: {
                  label: "Opis",
                },
                revision: {
                  label: "Wersja",
                },
                competences: {
                  label: "Kompetencje",
                },
              },
            },
            actions: {
              prev: "Poprzedni",
              next: "Następny",
            },
          },
        },
        competences: {
          name: "KOMPETENCJE",
          table: {
            toolbar: "Kompetencje",
            header: {
              code: "Kod",
              position: "Pozycja",
              name: "Nazwa",
              folderStructure: "Struktura Folderów",
              actions: "Akcje",
            },
          },
          form: {
            code: "Kod",
            position: "Pozycja",
            name: {
              label: "Nazwa",
              hint: "Ta wartość reprezentuje połączenie Kodu i Pozycji.",
            },
          },
        },
      },
    },
    admin: {
      name: "Admin",
      tabs: {
        "user-info": {
          name: "Informacje o Użytkowniku",
          table: {
            toolbar: "Informacje o Użytkowniku",
            header: {
              username: "Nazwa użytkownika",
              domain: "Domena",
              position: "Stanowisko",
              department: "Dział",
              decisionMaker: "Decydent",
              actions: "Akcje",
            },
          },
        },
        "user-permissions": {
          name: "Uprawnienia Użytkownika",
          table: {
            toolbar: "Uprawnienia Użytkownika",
            header: {
              username: "Nazwa użytkownika",
              permission: "Uprawnienie",
              confidentiality: "Poufność",
              groups: "Grupy",
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
        dcr: {
          name: "Prośba o zmianę dokumentu",
          table: {
            toolbar: "Prośby",
            header: {
              no: "Nr",
              tags: "Tagi",
              status: "Status",
              priority: "Priorytet",
              docxNumber: "Nazwa Dokumentu",
              docxRevision: "Rewizja Dokumentu",
              originator: "Wnioskodawca",
              checker: "Sprawdzający",
              approver: "Zatwierdzający",
              review: "Przegląd",
              // dialog: "Dialog",
              actions: "Akcje",
            },
          },
          kpi: {
            table: {
              header: {
                no: "Nr",
                username: "Nazwa użytkownika",
                role: "Rola",
                since: "Data dostępności akcji",
                taken: "Data wykonania akcji",
                elapsed: "Czas, który upłynął",
              },
              toolbar: "Rewizje",
            },
            legend: {
              title: "Legenda: Kolor upływającego czasu",
              priority: "{priority} priorytet:",
              days: "dni",
            },
            view: {
              title: "Widok",
              groupBy: "Wybierz grupowanie według",
              group: {
                no: "Nr",
                username: "Nazwa użytkownika",
                role: "Rola",
                taken: "Podjęte",
                priority: "Priorytet",
              },
            },
            filters: {
              title: "Filtry",
              myActions: "Pokaż tylko moje działania",
              departments: "Ogranicz do działów",
            },
          },
          review: {
            tooltip: "Otwórz Rewizje",
            close: "Zamknij",
            title: "Rewizja",
            timeline: "Oś czasu",

            comment: "Komentarz",
            files: "Pliki",
            no_files: "Nie znaleziono plików",
            no_affected: "Brak opisu zmian",
            changes: "Zmiany",

            alert: {
              reviewControlsAppearOnComplete:
                "Kontrole rewizji pojawią się, gdy wniosek o zmianę dokumentu będzie 'Zakończony'.",
              reviewGranted: "Rewizja dla tego wniosku o zmianę dokumentu została przyznana.",
              reviewControlsAppearOnChecked: "Kontrole rewizji pojawią się po sprawdzeniu.",
            },

            reviewControls: {
              cancel: "Anuluj",
              confirm: "Potwierdź",
              commentOptional: "Komentarz (opcjonalny)",

              check: "Sprawdź",
              approve: "Zatwierdź",
              reject: "Odrzuć",
              register: "Zarejestruj",
              unregister: "Wyrejestruj",

              variant: {
                checked: "sprawdzony",
                approved: "zatwierdzony",
                registered: "zarejestrowany",
                rejected: "odrzucony",
                unregistered: "wyrejestrowany",

                question:
                  "Czy na pewno chcesz oznaczyć ten wniosek o zmianę dokumentu jako '{variant}'?",
              },
            },
          },
          stepper: {
            actions: {
              prev: "Poprzedni",
              next: "Następny",
              submit: "Przejrzyj swoje dane przed wysłaniem.",
            },
            info: {
              reviewers_title: "Recenzenci",
              reviewers_text:
                "Aby osoba była możliwa do wyboru, Checker i Rejestrujący muszą mieć uprawnienia do dostępu do zmiany dokumentu. Approver musi również mieć status decydenta.",
              check_and_approve_title: "Powiadomienia",
              check_and_approve_text:
                "Po zakończeniu lub aktualizacji wniosku o zmianę dokumentu powiadomienie zostaje wysłane do Sprawdzającego. Po przeprowadzeniu przeglądu powiadamiany jest Zatwierdzający. Po zatwierdzeniu wniosku powiadomienie otrzymuje Rejestrator. W przypadku niepowodzenia przeglądu informowany jest Wnioskodawca. Powiadomienia są dostarczane za pośrednictwem intranetu i poczty elektronicznej, a kopie (cc) są również wysyłane do innych decydentów w dziale, którzy mają dostęp do wniosku o zmianę dokumentu.",
            },
            error: {
              revisionToLow:
                "Znaleziono dokument z takim numerem, który ma rewizję {revision}. Proszę wprowadzić wyższą rewizję.",
            },
            message: {
              revisionGreaterThanExpected:
                "Wprowadziłeś numer rewizji, który jest większy od oczekiwanej kolejnej rewizji.",
            },
            vStepperItem: {
              "1": "Informacje",
              "2": "Zmiany",
              "3": "Pliki",
              "4": "Recenzenci",
              "5": "Szkolenie",
              "6": "Weryfikuj",
            },
            vStepperWindowItem: {
              "1": {
                tags: {
                  name: "Tagi",
                  hint: "Wprowadź charakterystyczne słowa kluczowe, które opisują zmiany w dokumencie",
                },
                source: {
                  name: "Źródło Dokumentu",
                  hint: "",
                  previously_uploaded: "Wcześniej przesłane",
                  not_previously_uploaded_new: "Nie przesłane wcześniej, nowy dokument",
                  not_previously_uploaded_existing: "Nie przesłane wcześniej, istniejący dokument",
                },
                docxNumber: {
                  name: "Nazwa Dokumentu",
                  hint: "np. BYD-QA-SPE-MOD-0005",
                },
                docxRevision: "Rewizja Dokumentu",
                docxReference: {
                  name: "Referencja Dokumentu",
                  hint: "",
                },
                priority: {
                  name: "Priorytet",
                  hint: "Określa pozycję żądania w tabeli. Niski priorytet jest umieszczony na końcu.",
                  low: "Niski",
                  medium: "Średni",
                  high: "Wysoki",
                },
              },
              "2": {
                changes: "Zmiany",
              },
              "4": {
                checker: {
                  name: "Sprawdzający",
                  hint: "Wpisz, aby wyszukać.",
                },
                approver: {
                  name: "Zatwierdzający",
                  hint: "Wpisz, aby wyszukać.",
                },
                registerer: "Rejestrujący",
              },
              "5": {
                affectedCompetences: "Dotknięte Kompetencje",
                requireAcknowledgmentOrTraining: {
                  name: "Wymaga Potwierdzenia lub Szkolenia",
                  acknowledgment: "Potwierdzenie",
                  training: "Szkolenie",
                },
                trainingDetails: "Szczegóły Szkolenia",
              },
            },
          },
        },
        dcn: {
          name: "Powiadomienie o Zmianie Dokumentu",
          table: {
            toolbar: "Powiadomienie",
            header: {
              no: "Nr",
              tags: "Tagi",
              status: "Status",
              docxNumber: "Nazwa Dokumentu",
              docxRevision: "Rewizja Dokumentu",
              docxReference: "Referencja Dokumentu",
              registerer: "Rejestrujący",
              info: "Informacje",
            },
          },
        },
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
    safety: {
      name: "BHP",
      tabs: {
        "manage-acknowledgment": {
          name: "Zarządzaj Zaznajomieniem",
        },
        "document-acknowledged": {
          name: "Zaznajomione Dokumenty",
        },
      },
    },
    analytic: {
      name: "Analityka",
      tabs: {
        sky: {
          name: "SKY",
        },
      },
    },
  },
};

export { plT };
