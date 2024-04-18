const plC = {
  common: {
    default_layout: {
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
        },
      },
      pages: {
        home: {
          card: {
            explore: "Eksploruj",
          },
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
            text: "Tworzenie i zatwierdzanie komunikatów o zmianie.",
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
        },
        settings: {
          application: {
            name: "APLIKACJA",
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
          },
        },
      },
      tool: {
        documents: {
          name: "Dokumenty",
          tabs: {
            my_documents: "MOJE DOKUMENTY",
            my_favorites: "MOJE ULUBIONE",
            all_documents: "WSZYSTKIE DOKUMENTY",
            recently_browsed: "OSTATNIO PRZEGLĄDANE",
          },
        },
        matrix: {
          name: "Macierz",
          tabs: {
            departments: "DZIAŁY",
          },
        },
      },
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
    },
  },
};

export { plC };
