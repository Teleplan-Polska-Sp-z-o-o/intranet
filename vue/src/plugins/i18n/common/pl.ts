const plC = {
  common: {
    default_layout: {
      auth: {
        rules: {
          login_req: "Login jest wymagany",
          login_format: "Proszę wpisać login w formacie: 'imię.nazwisko'",
          domain_req: "Domena jest wymagana",
          password_req: "Hasło jest wymagane",
        },
        template: {
          domain_label: "Domena logowania do komputera",
          login_label: "Login do komputera",
          password_label: "Hasło do komputera",
          password_massage: "Zapomniałeś hasła?",
          proceed: "Kontynuuj",
        },
      },
      bar: "Intranet",
      drawer: {
        hello: "Cześć",
        home: "Strona główna",
        tools: "Narzędzia",
        settings: "Ustawienia",
        logout: "Wyloguj",
      },
      breadcrumbs: {
        pages: {
          home: "Strona główna",
          settings: "Ustawienia",
          tools: "Narzędzia",
        },
        tool: {
          documents: {
            browse: "Dokumenty",
            view: "Widok",
          },
          matrix: "Macierz",
          admin: "Administrator",
          change: {
            browse: "Zmiana",
          },
          safety: "Bezpieczeństwo",
        },
      },
      pages: {
        home: {
          card: {
            explore: "Eksploruj",
          },
        },
        viewDocument: {
          small: "Mały",
          large: "Duży",
          pageMessage: "Strona {currentPage} z {totalPages}",
        },
        tools: {
          documents: {
            title: "Dokumenty",
            text: "System zarządzania dokumentami.",
          },
          training: {
            title: "Szkolenie",
            text: "Rozwijanie umiejętności i certyfikacji wśród operatorów.",
          },
          change: {
            title: "Zmiana",
            text: "Tworzenie i zatwierdzanie zmian.",
          },
          matrix: {
            title: "Macierz",
            text: "Zarządzanie danymi, które są wykorzystywane przez inne narzędzia.",
          },
          "8d": {
            title: "8D",
            text: "Szybkie reagowanie na skargi i wewnętrzne problemy.",
          },
          boss: {
            title: "Administrator",
            text: "Zarządzanie platformą.",
          },
          safety: {
            title: "BHP",
            text: "Zarządzanie bezpieczeństwem i higieną pracy.",
          },
        },
        settings: {
          application: {
            name: "APLIKACJA",
            list: {
              "list-subheader": "Ogólne",
              "list-item": {
                "1": {
                  title: "Motywy",
                  subtitle: "Wybierz między trybem jasnym i ciemnym",
                },
                "2": {
                  title: "Języki",
                  subtitle:
                    "Wybierz język interfejsu. Uwaga: Angielski jest w pełni obsługiwany, inne języki mogą mieć ograniczoną obsługę.",
                },
              },
            },
            theme: {
              name: "Motyw",
              dark: "Ciemny",
              light: "Jasny",
            },
            language: {
              name: "Język",
              english: "Angielski",
              polish: "Polski",
              ukrainian: "Ukraiński",
            },
          },
          notification: {
            name: "CENTRUM POWIADOMIEŃ",
          },
          user: {
            name: "UŻYTKOWNIK",
            "1": {
              subheader: "Informacje",
              position: "Stanowisko",
              department: "Dział",
              decision_maker: "Decydent",
            },
            "2": {
              subheader: "Uprawnienia",
              confidentiality: "Poufność",
              groups: "Grupy",
            },
          },
        },
      },
    },
    months: {
      jan: "Styczeń",
      feb: "Luty",
      mar: "Marzec",
      apr: "Kwiecień",
      may: "Maj",
      jun: "Czerwiec",
      jul: "Lipiec",
      aug: "Sierpień",
      sep: "Wrzesień",
      oct: "Październik",
      nov: "Listopad",
      dec: "Grudzień",
    },
    status_message: {
      post_error: "Wystąpił błąd podczas przetwarzania akcji.",
      post_success: "Twoja akcja została pomyślnie zakończona.",
      put_error: "Wystąpił błąd podczas wykonywania operacji.",
      put_success: "Operacja została pomyślnie zakończona.",
      get_error: "Wystąpił błąd podczas pobierania danych.",
      get_success: "Dane zostały pomyślnie pobrane.",
      delete_error: "Wystąpił błąd podczas usuwania zasobu.",
      delete_success: "Zasób został pomyślnie usunięty.",
      unknown: "Nieznany błąd. Spróbuj ponownie później.",
      unauthorized: "Brak autoryzacji do wykonania tej akcji.",
      unknownMessage: "Nieznana wiadomość.",
      decision_maker_error:
        "Żądanie dotyczy użytkownika, który nie ma uprawnień do podejmowania decyzji.",
      tool_access_error:
        "Żądanie dotyczy użytkownika, który nie ma dostępu do odpowiedniego narzędzia.",
      reference_format_error: "Wartość referencji ma nieprawidłowy format.",
      reference_already_contains_error: "Jakiś dokument już zawiera tę referencje.",
    },
    component: {
      file_form: {
        info_title: "Akceptowane formaty",
        info_text: "Formularz akceptuje pliki z rozszerzeniami: '{accepts}'",
        add_file: "Plik",
        document: "Dokument",
        langs: "Języki",
      },
    },
  },
};

export { plC };
