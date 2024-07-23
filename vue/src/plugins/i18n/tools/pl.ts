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
      departments: "Działy",
      workstations: "Stanowiska pracy",
      programs: "Programy",
      category: "Kategoria",
      subcategory: "Podkategoria",
      subSubcategory: "Pod-podkategoria",
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
        msd: {
          name: "Systemy Zarządzania",
          table: {
            toolbar: "Systemy Zarządzania",
            select_lang: "Wybierz Język",
            header: {
              name: "Nazwa",
              description: "Opis",
              view_document: "Zobacz Dokument",
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
        competences: {
          name: "KOMPETENCJE",
          table: {
            toolbar: "Kompetencje",
            header: {
              name: "Nazwa",
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
              status: "Status",
              priority: "Priorytet",
              docxNumber: "Numer Dokumentu",
              docxRevision: "Rewizja Dokumentu",
              originator: "Wnioskodawca",
              checker: "Sprawdzający",
              approver: "Zatwierdzający",
              review: "Przegląd",
              // dialog: "Dialog",
              actions: "Akcje",
            },
          },
          review: {
            tooltip: "Otwórz przegląd",
            close: "Zamknij",
            cancel: "Anuluj",
            confirm: "Potwierdź",
            title: "Przegląd",
            timeline: "Oś czasu",
            variant: {
              approve: "zatwierdź",
              check: "sprawdź",
              reject: "odrzuć",
              question: "Czy na pewno chcesz ${variant} ten wniosek o zmianę dokumentu?",
            },
            alert: {
              reviewControlsAppearOnComplete:
                "Elementy sterujące przeglądem pojawią się, gdy wniosek o zmianę dokumentu zostanie 'Zakończony'.",
              reviewGranted: "Przegląd tego wniosku o zmianę dokumentu został przyznany.",
              reviewControlsAppearOnChecked:
                "Elementy sterujące przeglądem pojawią się po sprawdzeniu.",
            },
            commentOptional: "Komentarz (opcjonalnie)",
            comment: "Komentarz",
            files: "Pliki",
            no_files: "Nie znaleziono plików",
            changes: "Zmiany",
          },
          register: {
            cancel: "Anuluj",
            confirm: "Potwierdź",
            register: "Zarejestruj",
            unregister: "Wyrejestruj",
            question: "Czy na pewno chcesz zmienić status rejestracji?",
          },
          stepper: {
            actions: {
              prev: "Poprzedni",
              next: "Następny",
              submit: "Przejrzyj swoje dane przed wysłaniem.",
            },
            info: {
              reference_info_title: "Czym jest Referencja?",
              reference_info_text:
                "Referencja to unikalny identyfikator używany do rozróżniania zapisów dokumentów. Łączy ona żądanie zmiany dokumentu z już zarejestrowanym dokumentem, pomagając w rejestrowaniu nowej wersji. Wartość referencji można znaleźć w narzędziu macierzowym w zakładce dokumentu w rekordzie dokumentu, który ma zostać zaktualizowany. Dla nowych dokumentów, które nigdy wcześniej nie były zarejestrowane, można wybrać 'Utwórz nową referencję'. Po utworzeniu nowa referencja może zostać wklejona z żądania do formularza rejestracyjnego lub użyta do zaktualizowania istniejącej referencji dokumentu w macierzy, łącząc ją z żądaniem.",
              check_and_approve_title: "Powiadomienia",
              check_and_approve_text:
                "Po zakończeniu lub aktualizacji wniosku o zmianę dokumentu powiadomienie zostaje wysłane do Sprawdzającego. Po przeprowadzeniu przeglądu powiadamiany jest Zatwierdzający. Po zatwierdzeniu wniosku powiadomienie otrzymuje Rejestrator. W przypadku niepowodzenia przeglądu informowany jest Wnioskodawca. Powiadomienia są dostarczane za pośrednictwem intranetu i poczty elektronicznej, a kopie (cc) są również wysyłane do innych decydentów w dziale, którzy mają dostęp do wniosku o zmianę dokumentu.",
            },
            fileInputs: {
              file: "Plik (.docx)",
              document: "Dokument",
              languages: "Języki",
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
                new: {
                  name: "Aktualizacja dokumentu",
                  hint: "",
                },
                docxNumber: {
                  name: "Numer dokumentu",
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
                requireAcknowledgmentOrTraining: "Wymaga Potwierdzenia lub Szkolenia",
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
              status: "Status",
              docxNumber: "Numer Dokumentu",
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
  },
};

export { plT };
