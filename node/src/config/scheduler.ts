import { Not } from "typeorm";
import { OneTimeScheduler, CronScheduler } from "../models/common/Scheduler";
import { DocumentChange } from "../orm/entity/change/documents/DocumentChangeEntity";
import { dataSource } from "./dataSource";
import { User } from "../orm/entity/user/UserEntity";
import { EDCNotificationVariant } from "../interfaces/user/notification/ENotificationVariant";
import { PackedService } from "../services/analytic/PackedService";
import { FileService } from "../services/analytic/files/FileService";
import { TPPL03S005_PATH } from "./routeConstants";
import path from "path";
import { transactionFunctionMapping } from "../services/analytic/efficiencyMothly/RawTransactionHandler";
import { EfficiencyMonthlyService } from "../services/analytic/efficiencyMothly/EfficiencyMonthlyService";

const mountScheduledTasks = () => {
  const scheduler = new CronScheduler();

  // Schedule the cleanup task to run every day at 8 AM local time
  scheduler.scheduleTask(
    "0 6 * * *",
    async () => {
      await dataSource.transaction(async (transactionalEntityManager) => {
        const dcrs: DocumentChange[] = await transactionalEntityManager
          .getRepository(DocumentChange)
          .find({
            where: {
              status: Not("Registered"),
            },
          });

        const minHoursPassed = 24;
        for (const dcr of dcrs) {
          const reminder = dcr.remindReview(minHoursPassed);
          if (reminder) {
            const recipients: {
              to: User;
              cc: Array<User>;
            } = await dcr.notification(
              transactionalEntityManager,
              reminder.usernameVariant,
              reminder.notificationVariant
            );
            if (recipients) dcr.sendEmails(recipients, EDCNotificationVariant.Completed);
          }
        }
      });
    },
    "SendReviewReminderTask"
  );

  // Schedule the cleanup task to run every hour at the start of the hour (e.g., 05:00, 06:00, etc.)
  scheduler.scheduleTask(
    "0 * * * *", // Cron expression for running at the start of every hour
    async () => {
      try {
        const packedClass = new PackedService.Handler("sky", "packing");
        const _1 = await packedClass.getRawTransactions_1();
        const _2 = await _1.getAnalyticFiles_2();
        const _3_4 = _2.getJsObjects_3().getTablePackedRows_4();
        const _5 = await _3_4.createExcelReport_5();
        _5.sendMails_6();
      } catch (error) {
        console.error(error);
      }
    },
    "PackedReportEveryHour"
  );

  scheduler.scheduleTask(
    "0 6 1 * *", // Cron expression for 6:00 AM on the 1st of each month
    async () => {
      try {
        // Iterate over the transactionFunctionMapping object
        for (const [program, categories] of Object.entries(transactionFunctionMapping)) {
          for (const [category, _transactionFunction] of Object.entries(categories)) {
            // Initialize and process using the EfficiencyMonthlyService
            const handler = new EfficiencyMonthlyService.PostgresHandler(program, category);

            // Process the transactions
            await handler.getRawTransactions_1();
            await handler.getAnalyticFiles_2_1();
            handler.getJsObjects_2_2();
            handler.getProcessedData_3();
            await handler.createExcelBaseEfficiencyReport_4_1();
            await handler.createExcelBaseEfficiencyReport_4_2();
            handler.sendMails_5();
          }
        }
      } catch (error) {
        console.error(
          `Error processing monthly reports at MonthlyEfficiencyReport scheduled task:`,
          error
        );
      }
    },
    "MonthlyEfficiencyReport" // Task name
  );

  scheduler.startAllTasks();
};

const mountOneTimeTasks = () => {
  const oneTimeScheduler = new OneTimeScheduler();

  // Schedule a one-time task to run after 5 seconds
  oneTimeScheduler.scheduleTask(
    0,
    () => {
      new FileService.FileWatcherService(
        "sky",
        "packing",
        "drive",
        "planning",
        "auto-plan-update",
        path.join(TPPL03S005_PATH, "resources/operations/sky/shift/plan/daily")
      );
    },
    "WatchModelAnalyticFiles"
  );
  // Schedule a one-time task to run after 5 seconds
  // oneTimeScheduler.scheduleTask(
  //   0,
  //   async () => {
  //     try {
  //       // Iterate over the transactionFunctionMapping object
  //       for (const [program, categories] of Object.entries(transactionFunctionMapping)) {
  //         for (const [category, _transactionFunction] of Object.entries(categories)) {
  //           // Initialize and process using the EfficiencyMonthlyService
  //           const handler = new EfficiencyMonthlyService.PostgresHandler(program, category);

  //           // Process the transactions
  //           await handler.getRawTransactions_1();
  //           await handler.getAnalyticFiles_2_1();
  //           handler.getJsObjects_2_2();
  //           handler.getProcessedData_3();
  //           await handler.createExcelBaseEfficiencyReport_4_1();
  //           await handler.createExcelBaseEfficiencyReport_4_2();
  //           handler.sendMails_5();
  //         }
  //       }
  //     } catch (error) {
  //       console.error(
  //         `Error processing monthly reports at MonthlyEfficiencyReport scheduled task:`,
  //         error
  //       );
  //     }
  //   },
  //   "MonthlyEfficiencyReportOneTime"
  // );
};

export { mountScheduledTasks, mountOneTimeTasks };
