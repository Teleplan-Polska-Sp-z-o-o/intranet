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
        viewDocument: {
          small: "Маленький",
          large: "Великий",
          pageMessage: "Сторінка {currentPage} з {totalPages}",
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
            "1": {
              subheader: "Інформація",
              position: "Посада",
              department: "Відділ",
              decision_maker: "Відповідальний за рішення",
            },
            "2": {
              subheader: "Дозволи",
              confidentiality: "Конфіденційність",
              groups: "Групи",
            },
          },
        },
      },
    },
    months: {
      jan: "Січень",
      feb: "Лютий",
      mar: "Березень",
      apr: "Квітень",
      may: "Травень",
      jun: "Червень",
      jul: "Липень",
      aug: "Серпень",
      sep: "Вересень",
      oct: "Жовтень",
      nov: "Листопад",
      dec: "Грудень",
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
      unknownMessage: "Невідоме повідомлення.",
      decision_maker_error:
        "Запит стосується користувача, який не має дозволу на прийняття рішень.",
      tool_access_error:
        "Запит стосується користувача, який не має доступу до відповідного інструменту.",
      reference_format_error: "Значення посилання має неправильний формат.",
      reference_already_contains_error: "Деякий документ вже містить цю референцію.",
    },
    component: {
      file_form: {
        info_title: "Прийняті формати",
        info_text: "Форма приймає файли з розширеннями: '{accepts}'",
        add_file: "Файл",
        document: "Документ",
        langs: "Мови",
      },
    },
  },
};

export { uaC };
