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
      filterByType: "Фільтрувати за типом документа",
      filterByFolder: "Фільтрувати за папками",
      empty: "Папки не знайдено",
      departments: "Відділи",
      workstations: "Робочі місця",
      programs: "Програми",
      category: "Категорія",
      subcategory: "Підкатегорія",
      subSubcategory: "Під-підкатегорія",
    },
    documents: {
      name: "Документи",
      table: {
        header: {
          name: "Назва",
          description: "Опис",
          view_document: {
            name: "Переглянути Документ",
            select: "Вибрати Мову",
            tooltip: "Відкрити в новій вкладці",
          },
          quick: {
            name: "Швидкий Доступ",
            tooltip_add: "Додати до Швидкого Доступу",
            tooltip_remove: "Видалити з Швидкого Доступу",
          },
        },
      },
      tabs: {
        all: {
          name: "ДОКУМЕНТИ",
          table: {
            toolbar: "Документи",
          },
        },
        instructions: {
          name: "ІНСТРУКЦІЇ",
          table: {
            toolbar: "Інструкції",
          },
        },
        visuals: {
          name: "ВІЗУАЛЬНІ ДОПОМОГИ",
          table: {
            toolbar: "Візуальні матеріали",
          },
        },
        msd: {
          name: "Системи Управління",
          table: {
            toolbar: "Системи Управління",
          },
        },
        //
        quick: {
          name: "Швидкий доступ",
          table: {
            toolbar: "Документи",
          },
        },
        recently: {
          name: "Нещодавно переглянуті",
          table: {
            toolbar: "Документи",
          },
        },
        //
        assistant: {
          name: "ПОМІЧНИК",
          title: "AI Асистент Документів",
          send: "Надіслати",
          placeholder: "Задайте мені питання.",
          new: "Нова Pозмова",
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
              // workstations: "Робочі місця",
              // programs: "Програми",
              categories: "Категорії",
              subcategories: "Підкатегорії",
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
              folderStructure: "Структура Папок",
              actions: "Дії",
            },
          },
          stepper: {
            vStepperItem: {
              "1": "Основна інформація",
              "2": "Вхідні файли",
              "3": "Перевірка",
            },
            vStepperWindowItem: {
              "1": {
                type: {
                  label: "Тип",
                },
                confidentiality: {
                  label: "Конфіденційність",
                },
                name: {
                  label: "Назва",
                },
                description: {
                  label: "Опис",
                },
                revision: {
                  label: "Ревізія",
                },
                competences: {
                  label: "Компетенції",
                },
              },
            },
            actions: {
              prev: "Попередній",
              next: "Наступний",
            },
          },
        },
        competences: {
          name: "КОМПЕТЕНЦІЇ",
          table: {
            toolbar: "Компетенції",
            header: {
              code: "Код",
              position: "Посада",
              name: "Назва",
              folderStructure: "Структура папок",
              actions: "Дії",
            },
          },
          form: {
            code: "Код",
            position: "Посада",
            name: {
              label: "Назва",
              hint: "Це значення представляє поєднання Коду та Посади.",
            },
          },
        },
      },
    },
    admin: {
      name: "Адміністратор",
      tabs: {
        "user-info": {
          name: "Інформація Про Користувача",
          table: {
            toolbar: "Інформація Про Користувача",
            header: {
              username: "Ім'я користувача",
              domain: "Домен",
              position: "Посада",
              department: "Відділ",
              decisionMaker: "Рішення приймає",
              actions: "Дії",
            },
          },
        },
        "user-permissions": {
          name: "Дозволи Користувача",
          table: {
            toolbar: "Дозволи Користувача",
            header: {
              username: "Ім'я користувача",
              permission: "Дозвіл",
              confidentiality: "Конфіденційність",
              groups: "Групи",
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
        dcr: {
          name: "Запит на зміну документа",
          table: {
            toolbar: "Запити",
            header: {
              no: "№",
              tags: "Теги",
              status: "Статус",
              priority: "Пріоритет",
              docxNumber: "Назва Документа",
              docxRevision: "Перегляд документа",
              originator: "Ініціатор",
              checker: "Перевіряючий",
              approver: "Затверджуючий",
              review: "Перегляд",
              // dialog: "Діалог",
              actions: "Дії",
            },
          },
          kpi: {
            table: {
              header: {
                no: "№",
                username: "Ім'я користувача",
                role: "Роль",
                since: "Дата доступності дії",
                taken: "Дата виконання дії",
                elapsed: "Час, що минув",
              },
              toolbar: "Відгуки",
            },
            legend: {
              title: "Легенда: Колір минулого часу",
              priority: "{priority} пріоритет:",
              days: "дні",
            },
            view: {
              title: "Перегляд",
              groupBy: "Виберіть групування за",
              group: {
                no: "№",
                username: "Ім'я користувача",
                role: "Роль",
                taken: "Виконано",
                priority: "Пріоритет",
              },
            },
            filters: {
              title: "Фільтри",
              myActions: "Показати лише мої дії",
              departments: "Обмежити до відділів",
            },
          },
          review: {
            tooltip: "Відкрити Огляд",
            close: "Закрити",
            title: "Огляд",
            timeline: "Хронологія",

            comment: "Коментар",
            files: "Файли",
            no_files: "Файли не знайдені",
            no_affected: "Опис змін відсутній",
            changes: "Зміни",

            alert: {
              reviewControlsAppearOnComplete:
                "Елементи керування з’являться, коли запит на зміну документа буде 'Завершено'.",
              reviewGranted: "Огляд для цього запиту на зміну документа надано.",
              reviewControlsAppearOnChecked: "Елементи керування з’являться після перевірки.",
            },

            reviewControls: {
              cancel: "Скасувати",
              confirm: "Підтвердити",
              commentOptional: "Коментар (необов’язково)",

              check: "Перевірити",
              approve: "Затвердити",
              reject: "Відхилити",
              register: "Зареєструвати",
              unregister: "Видалити з реєстрації",

              variant: {
                checked: "перевірено",
                approved: "затверджено",
                registered: "зареєстровано",
                rejected: "відхилено",
                unregistered: "видалено з реєстрації",

                question:
                  "Ви впевнені, що хочете позначити цей запит на зміну документа як '{variant}'?",
              },
            },
          },
          stepper: {
            actions: {
              prev: "Попередній",
              next: "Наступний",
              submit: "Перевірте свої дані перед відправкою.",
            },
            info: {
              reviewers_title: "Рецензенти",
              reviewers_text:
                "Щоб особу можна було вибрати, Checker та Реєстратор повинні мати дозвіл на доступ до запиту на зміну документа. Approver також повинен мати статус приймача рішень.",
              check_and_approve_title: "Сповіщення",
              check_and_approve_text:
                "Після завершення або оновлення запиту на зміну документа сповіщення надсилається Перевіряючому. Після перевірки запиту сповіщення отримує Затверджувач. Після затвердження запиту сповіщення отримує Реєстратор. У разі невдачі перегляду інформується Ініціатор. Сповіщення доставляються через інтранет та електронну пошту, а копії (cc) також надсилаються іншим відповідальним за прийняття рішень у відділі, які мають доступ до запиту на зміну документа.",
            },
            error: {
              revisionToLow:
                "Знайдено документ з таким номером, який має ревізію {revision}. Будь ласка, введіть вищу ревізію.",
            },
            message: {
              revisionGreaterThanExpected:
                "Ви ввели номер ревізії, який перевищує очікувану наступну ревізію.",
            },
            vStepperItem: {
              "1": "Інформація",
              "2": "Зміни",
              "3": "Файли",
              "4": "Рецензенти",
              "5": "Навчання",
              "6": "Перевірити",
            },
            vStepperWindowItem: {
              "1": {
                tags: {
                  name: "Теги",
                  hint: "Введіть характерні ключові слова, що описують зміни в документі",
                },
                source: {
                  name: "Джерело Документа",
                  hint: "",
                  previously_uploaded: "Раніше завантажено",
                  not_previously_uploaded_new: "Не завантажено раніше, новий документ",
                  not_previously_uploaded_existing: "Не завантажено раніше, існуючий документ",
                },
                docxNumber: {
                  name: "Назва Документа",
                  hint: "наприклад, BYD-QA-SPE-MOD-0005",
                },
                docxRevision: "Ревізія Документа",
                docxReference: {
                  name: "Референція документа",
                  hint: "",
                },
                priority: {
                  name: "Пріоритет",
                  hint: "Визначає розташування запиту в таблиці. Низький пріоритет розміщується останнім.",
                  low: "Низький",
                  medium: "Середній",
                  high: "Високий",
                },
              },
              "2": {
                changes: "Зміни",
              },
              "4": {
                checker: {
                  name: "Перевіряючий",
                  hint: "Введіть для пошуку.",
                },
                approver: {
                  name: "Затверджувач",
                  hint: "Введіть для пошуку.",
                },
                registerer: "Реєстратор",
              },
              "5": {
                affectedCompetences: "Затронуті Компетенції",
                requireAcknowledgmentOrTraining: {
                  name: "Потребує Підтвердження або Навчання",
                  acknowledgment: "Підтвердження",
                  training: "Навчання",
                },
                trainingDetails: "Деталі Навчання",
              },
            },
          },
        },
        dcn: {
          name: "Повідомлення про зміну документа",
          table: {
            toolbar: "Повідомлення",
            header: {
              no: "№",
              tags: "Теги",
              status: "Статус",
              docxNumber: "Назва Документа",
              docxRevision: "Перегляд документа",
              docxReference: "Референція документа",
              registerer: "Реєстратор",
              info: "Інформація",
            },
          },
        },
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
    safety: {
      name: "Охорона Праці",
      tabs: {
        "manage-acknowledgment": {
          name: "Управління Ознайомленням",
        },
        "document-acknowledged": {
          name: "Ознайомлена Документація",
        },
      },
    },
  },
};

export { uaT };
