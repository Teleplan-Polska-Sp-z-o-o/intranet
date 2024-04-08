const uaT = {
  tools: {
    common: {
      new: "Створити",
      edit: "Редагувати",
      delete: "Видалити",
      cancel: "Скасувати",
      save: "Зберегти",
      ok: "OK",
      search: "Пошук",
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
            select_lang: "",
          },
        },
        my_favorites: {
          name: "МОЇ УЛЮБЛЕНІ",
          table: {
            toolbar: "",
            select_lang: "",
          },
        },
        all_instructions: {
          name: "ВСІ ІНСТРУКЦІЇ",
          table: {
            toolbar: "Інструкції",
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
            header: {
              title: "Заголовок",
              subtitle: "Підзаголовок",
              actions: "Дії",
            },
          },
        },
      },
    },
    change: {
      name: "Зміна",
    },
  },
};

export { uaT };
