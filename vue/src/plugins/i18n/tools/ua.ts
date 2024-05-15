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
      filters: "Фільтрувати за допомогою розширених критеріїв",
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
              subcategory: "Підкатегорія",
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
              position: "Посада",
              department: "Відділ",
              decisionMaker: "Приймач рішень",
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
      tabs: {
        pcr: {
          name: "Запит на зміну процесу",
          table: {
            toolbar: "Запити",
            header: {
              numberOfRequest: "№",
              requestDate: "Дата запиту",
              internalOrExternal: "Внутрішній/Зовнішній",
              reconextOwner: "Власник",
              dedicatedDepartment: "Відділ",
              program: "Програма",
              modelOrProcessImpacted: "Вплив на",
              dateNeeded: "Дата необхідності",
              assessment: "Оцінка",
              approvedOrRejectedBy: "Закрито",
              closureDate: "Дата закриття",
              viewPcr: "Переглянути ЗРП",
              numberOfNotice: "№ повідомлення",
              actions: "Дії",
            },
          },
          stepper: {
            actions: {
              prev: "Попередній",
              next: "Наступний",
            },
            changeReason: "Причина зміни",
            changeDescription: "Опис зміни",
            customerContactPersonRule: "Будь ласка, введіть ім'я та прізвище, розділені пробілом.",
            customerContactEmailRule: "Електронна адреса повинна бути дійсною.",
            vStepperItem: {
              "1": "Основна інформація",
              "2": "Контактна інформація",
              "3": "Дата необхідності",
              "4": "Описова інформація",
              "5": "Перевірити",
            },
            vStepperWindowItem: {
              "1": {
                internalOrExternal: "Внутрішній або Зовнішній",
                dedicatedDepartment: "Відділ",
                program: "Програма",
                reconextOwner: "Власник Reconext",
              },
              "2": {
                customerContactPerson: "Контактна особа клієнта",
                customerContactEmail: "Електронна адреса клієнта",
                reconextContactPerson: "Контактна особа Reconext",
              },
              "3": {
                dateNeeded: "Очистити дату необхідної реалізації",
              },
              "4": {
                modelOrProcessImpacted: "Вплив на модель або процес",
                costOfImplementation: "Вартість впровадження",
                impacts: "Впливи",
                riskAnalysis: "Аналіз ризиків",
                updateDescription: "Опис оновлення",
              },
            },
            alerts: {
              remainder: {
                title: "Нагадування",
                text: "Звертаємо увагу, що будь-яке оновлення закритого запиту автоматично спричинить його зновувідкриття для подальшого перегляду та дій.",
                fields: "Попередній перегляд оновлених полів ключів.",
              },
              emptyUpdate: {
                title: "Попередження",
                text: "Зверніть увагу, що навіть у випадку, якщо фактичні редагування відсутні, продовження без внесення змін до закритого запиту все одно призведе до його повторного відкриття.",
              },
              removalOfNotice: {
                title: "Попередження",
                text: "Будь ласка, зверніть увагу, що продовження призведе до видалення пов'язаного повідомлення.",
              },
            },
          },
        },
        pcn: {
          name: "Повідомлення про Зміну Процесу",
          table: {
            toolbar: "Повідомлення",
            header: {
              numberOfNotice: "№",
              numberOfRequest: "№ Заявки",
              reconextOwner: "Заявник",
              noticeDate: "Дата Повідомлення",
              modelOrProcessImpacted: "Вплив На",
              areDocumentationChangesRequired: "Зміни В Документації",
              isNewDocumentationRequired: "Нова Документація",
              isCustomerApprovalRequired: "Вимагається Затвердження Клієнта",
              status: "Статус",
              closureDate: "Дата закриття",
              viewPcn: "Переглянути ППЗ",
              actions: "Дії",
            },
          },
        },
      },
    },
  },
};

export { uaT };
