const uaT = {
  tools: {
    common: {
      new: "Створити",
      edit: "Редагувати",
      delete: "Видалити",
      cancel: "Скасувати",
      save: "Зберегти",
      ok: "OK",
      deleteItemConfirmation: "Видалення цього елемента також вплине на всі його дочірні елементи.",
      deleteDocumentConfirmation:
        "Видалення цього документа також призведе до видалення всіх його пов'язаних файлів.",
    },
    chips: {
      departments: "Відділи",
      workstations: "Робочі місця",
      programs: "Програми",
    },
    documents: {
      name: "Документи",
      tabs: {
        my_documents: {
          name: "МОЇ ДОКУМЕНТИ",
          table: {
            toolbar: "",
            search: "",
            select_lang: "",
          },
        },
        my_favorites: {
          name: "МОЇ УЛЮБЛЕНІ",
          table: {
            toolbar: "",
            search: "",
            select_lang: "",
          },
        },
        all_instructions: {
          name: "ВСІ ІНСТРУКЦІЇ",
          table: {
            toolbar: "Інструкції",
            search: "Пошук",
            select_lang: "Вибрати мову",
            header: {
              name: "Назва",
              description: "Опис",
              view_document: "Переглянути документ",
            },
          },
        },
        all_visuals: {
          name: "УСІ ВІЗУАЛЬНІ МАТЕРІАЛИ",
          table: {
            toolbar: "Візуальні матеріали",
            search: "Пошук",
            select_lang: "Вибрати мову",
            header: {
              name: "Назва",
              description: "Опис",
              view_document: "Переглянути документ",
            },
          },
        },
        recently_browsed: {
          name: "ОСТАННІ ПЕРЕГЛЯДИ",
          table: {
            toolbar: "",
            search: "",
            select_lang: "",
          },
        },
      },
    },
    matrix: {
      name: "Документи",
      tabs: {
        departments: {
          name: "ВІДДІЛИ",
          table: {
            toolbar: {
              departments: "Відділи",
              workstations: "Робочі місця",
              programs: "Програми",
            },
            search: "Пошук",
            header: {
              name: "Назва",
              actions: "Дії",
            },
          },
        },
        documents: {
          name: "ДОКУМЕНТИ",
          table: {
            toolbar: "Документи",
            search: "Пошук",
            header: {
              name: "Назва",
              type: "Тип",
              description: "Опис",
              language: "Мови (файли)",
              revision: "Ревізія",
              actions: "Дії",
            },
          },
        },
      },
    },
    admin: {
      name: "Адміністратор",
      tabs: {
        permissions: {
          name: "Дозволи",
          table: {
            toolbar: "Дозволи",
            search: "Пошук",
            header: {
              username: "Ім'я користувача",
              domain: "Домен",
              permission: "Дозвіл",
              actions: "Дії",
            },
          },
        },
        news: {
          name: "Новини",
          table: {
            toolbar: "Новини",
            search: "Пошук",
            header: {
              title: "Заголовок",
              subtitle: "Підзаголовок",
              actions: "Дії",
            },
          },
        },
      },
    },
  },
};

export { uaT };
