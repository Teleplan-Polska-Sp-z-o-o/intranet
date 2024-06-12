const uaC = {
  common: {
    default_layout: {
      bar: "Інтранет",
      drawer: {
        hello: "Pryvit",
        home: "Головна",
        tools: "Інструменти",
        settings: "Налаштування",
        logout: "Вийти",
      },
      breadcrumbs: {
        pages: {
          home: "Головна",
          settings: "Налаштування",
          tools: "Інструменти",
        },
        tool: {
          documents: {
            browse: "Документи",
            view: "Перегляд",
          },
          matrix: "Матриця",
          admin: "Адміністратор",
          change: {
            browse: "Зміна",
          },
        },
      },
      pages: {
        home: {
          card: {
            explore: "Дослідити",
          },
        },
        tools: {
          documents: {
            title: "Документи",
            text: "Система управління документами.",
          },
          training: {
            title: "Тренування",
            text: "Підвищення навичок та сертифікація серед операторів.",
          },
          change: {
            title: "Зміна",
            text: "Створення та затвердження змін.",
          },
          matrix: {
            title: "Матриця",
            text: "Управління даними, які використовуються іншими інструментами.",
          },
          "8d": {
            title: "8D",
            text: "Ефективне вирішення скарг та внутрішніх проблем.",
          },
          boss: {
            title: "Адміністратор",
            text: "Управління платформою.",
          },
        },
        settings: {
          application: {
            name: "ДОДАТОК",
            list: {
              "list-subheader": "Загальне",
              "list-item": {
                "1": {
                  title: "Теми",
                  subtitle: "Виберіть між світлим та темним режимом",
                },
                "2": {
                  title: "Мови",
                  subtitle:
                    "Виберіть мову інтерфейсу. Примітка: Англійська мова повністю підтримується, інші мови можуть мати обмежену підтримку.",
                },
              },
            },
            theme: {
              name: "Тема",
              dark: "Темна",
              light: "Світла",
            },
            language: {
              name: "Мова",
              english: "Англійська",
              polish: "Польська",
              ukrainian: "Українська",
            },
          },
          notification: {
            name: "ЦЕНТР ПОВІДОМЛЕНЬ",
          },
          user: {
            name: "КОРИСТУВАЧ",
          },
        },
      },
      tool: {
        documents: {
          name: "Документи",
          tabs: {
            my_documents: "МОЇ ДОКУМЕНТИ",
            my_favorites: "МОЇ УЛЮБЛЕНІ",
            all_documents: "УСІ ДОКУМЕНТИ",
            recently_browsed: "ОСТАННЄ ПЕРЕГЛЯНУТЕ",
          },
        },
        matrix: {
          name: "Документи",
          tabs: {
            departments: "ВІДДІЛИ",
          },
        },
      },
    },
    status_message: {
      post_error: "Помилка під час обробки вашої дії.",
      post_success: "Ваша дія успішно завершена.",
      put_error: "Помилка під час виконання операції.",
      put_success: "Операція успішно завершена.",
      get_error: "Помилка під час отримання даних.",
      get_success: "Дані успішно отримані.",
      delete_error: "Помилка під час видалення pecypcy.",
      delete_success: "Pecypc успішно видалено.",
      unknown: "Невідома помилка. Будь ласка, спробуйте знову пізніше.",
      unauthorized: "Відсутні права доступу для виконання цієї дії.",
    },
  },
};

export { uaC };
