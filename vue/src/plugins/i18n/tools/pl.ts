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
    },
  },
};

export { plT };
