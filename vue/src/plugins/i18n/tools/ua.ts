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
      deleteItemConfirmation: "Ви впевнені, що хочете видалити цей елемент?",
      deleteDocumentConfirmation:
        "Видалення цього документа також призведе до видалення всіх його пов'язаних файлів.",
      filters: "Фільтрувати за допомогою розширених критеріїв",
    },
    chart: {
      post: {
        title: "Аналіз Даних",
        subtitle: "Огляд завантажень за користувачем і кількістю за останні шість місяців",
      },
    },
    chips: {
      departments: "Відділи",
      workstations: "Робочі місця",
      programs: "Програми",
      category: "Категорія",
      subcategory: "Підкатегорія",
      subSubcategory: "Під-підкатегорія",
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
        instructions: {
          name: "ІНСТРУКЦІЇ",
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
        visuals: {
          name: "ВІЗУАЛЬНІ ДОПОМОГИ",
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
        msd: {
          name: "Системи Управління",
          table: {
            toolbar: "Системи Управління",
            select_lang: "Виберіть Мову",
            header: {
              name: "Назва",
              description: "Опис",
              view_document: "Переглянути Документ",
            },
          },
        },
        assistant: {
          name: "ПОМІЧНИК",
          title: "AI Асистент Документів",
          send: "Надіслати",
          placeholder: "Задайте мені питання.",
          new: "Нова Pозмова",
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
              confidentiality: "Конфіденційність",
              description: "Опис",
              language: "Мови (файли)",
              revision: "Ревізія",
              subcategory: "Підкатегорія",
              actions: "Дії",
            },
          },
        },
        competences: {
          name: "КОМПЕТЕНЦІЇ",
          table: {
            toolbar: "Компетенції",
            header: {
              name: "Назва",
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
              confidentiality: "Конфіденційність",
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
              viewPcr: "Переглянути/Затвердити ЗРП",
              numberOfNotice: "№ повідомлення",
              actions: "Дії",

              requestedBy: "Запитується",
              customerContactPerson: "Контактна особа клієнта",
              customerContactEmail: "Електронна адреса контактної особи клієнта",
              reconextContactPerson: "Контактна особа Reconext",
              costOfImplementation: "Вартість впровадження",
              impacts: "Вплив",
              riskAnalysis: "Аналіз ризиків",
              status: "Статус",
            },
          },
          stepper: {
            actions: {
              prev: "Попередній",
              next: "Наступний",
            },
            changeReason: "Причина зміни",
            changeDescription: "Опис зміни",
            updateDescriptionRule: "Опис оновлення обов'язковий.",
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
              numberOfRequest: "№ Запиту",
              reconextOwner: "Заявник",
              personDesignatedForImplementation: "Відповідальна Особа",
              noticeDate: "Дата Повідомлення",
              modelOrProcessImpacted: "Вплив На",
              areDocumentationChangesRequired: "Необхідні Зміни в Документації",
              isNewDocumentationRequired: "Необхідна Нова Документація",
              isCustomerApprovalRequired: "Необхідне Затвердження Клієнта",
              status: "Статус",
              engineeringDepartmentApproval: "Затвердження Інж.",
              qualityDepartmentApproval: "Затвердження Як.",
              dedicatedDepartmentApproval: "Затвердження Вид.",
              closureDate: "Дата Закриття",
              viewPcn: "Перегляд/Затвердження PCN",
              actions: "Дії",
            },
          },
          stepper: {
            actions: {
              prev: "Попередній",
              next: "Наступний",
            },
            updateDescriptionRule: "Оновлення опису є обов'язковим.",
            qualityDepartmentRule: "Відділи якості та інженерії мають бути різними.",
            changeDescription: "Опис Зміни",
            vStepperItem: {
              "1": "Опис Зміни",
              "2": "Документація",
              "3": "Затвердження",
              "4": "Перевірка",
            },
            vStepperWindowItem: {
              "2": {
                areDocumentationChangesRequired: "Чи необхідні зміни в документації",
                listOfDocumentationToChange: "Список документації для зміни",
                isNewDocumentationRequired: "Чи необхідна нова документація",
                listOfDocumentationToCreate: "Список документації для створення",
              },
              "3": {
                personDesignatedForImplementation: "Відповідальна Особа за Впровадження",
                isCustomerApprovalRequired: "Чи необхідне затвердження клієнта",
                engineeringDepartmentName: "Виберіть інженерний відділ",
                qualityDepartmentName: "Виберіть відділ якості",
                updateDescription: "Оновити Опис",
              },
            },
            alerts: {
              departmentsRequiredForApproval: {
                title: "Процес Затвердження PCN",
                initial: {
                  title: "Ініціалізація",
                  text: "Форма PCN вимагає зазначення відповідних відділів Інженерії та Якості, щоб Інтранет міг ідентифікувати їх керівників. Після заповнення всіх полів у PCN система автоматично повідомляє отримувачів про майбутню дію, яку вони можуть вжити для початку процесу затвердження.",
                },
                "required-review": {
                  title: "Рецензія Інженерії та Якості",
                  text: "PCN спочатку буде направлено до відділу Інженерії для рецензії. Після отримання затвердження від будь-якого з керівників відділу Інженерії, PCN автоматично закриється і перейде до подальшої рецензії у відділі Якості.",
                },
                "optional-review": {
                  title: "Рецензія Спеціалізованого Відділу (Опціонально)",
                  text: "Якщо спеціалізований відділ PCR стосується конкретної області поза Інженерією та Якістю, система також направить запит на затвердження до відповідних керівників у цьому відділі.",
                },
              },
              remainder: {
                title: "Нагадування",
                text: "Будь ласка, майте на увазі, що будь-які оновлення закритого повідомлення автоматично призведуть до його повторного відкриття для подальшого перегляду та дії.",
                fields: "Попередній перегляд оновлених ключових полів.",
              },
              emptyUpdate: {
                title: "Попередження",
                text: "Будь ласка, майте на увазі, що продовження без внесення будь-яких фактичних змін до закритого повідомлення не матиме жодного ефекту.",
              },
            },
          },
        },
      },
    },
  },
};

export { uaT };
