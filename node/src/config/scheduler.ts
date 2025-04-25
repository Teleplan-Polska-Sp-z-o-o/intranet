import { CronScheduler, OneTimeScheduler } from "../models/common/Scheduler";
import { EfficiencyService } from "../services/analytic/efficiency/EfficiencyService";
import { getMonthlyRange, getWeeklyRange } from "../services/analytic/efficiency/TimeRangeHelper";
import { handlers } from "../services/transactions/sideControllers/RawTransactionService";
import { GenericTypes } from "../services/transactions/sideControllers/Types";

const mountScheduledTasks = () => {
  const scheduler = new CronScheduler();

  // Schedule the cleanup task to run every day at 8 AM local time
  // scheduler.scheduleTask(
  //   "0 6 * * *",
  //   async () => {
  //     await dataSource.transaction(async (transactionalEntityManager) => {
  //       const dcrs: DocumentChange[] = await transactionalEntityManager
  //         .getRepository(DocumentChange)
  //         .find({
  //           where: {
  //             status: Not("Registered"),
  //           },
  //         });

  //       const minHoursPassed = 24;
  //       for (const dcr of dcrs) {
  //         const reminder = dcr.remindReview(minHoursPassed);
  //         if (reminder) {
  //           const recipients: {
  //             to: User;
  //             cc: Array<User>;
  //           } = await dcr.notification(
  //             transactionalEntityManager,
  //             reminder.usernameVariant,
  //             reminder.notificationVariant
  //           );
  //           if (recipients) dcr.sendEmails(recipients, EDCNotificationVariant.Completed);
  //         }
  //       }
  //     });
  //   },
  //   "SendReviewReminderTask"
  // );

  // Schedule the cleanup task to run every hour at the start of the hour (e.g., 05:00, 06:00, etc.)
  // scheduler.scheduleTask(
  //   "0 * * * *", // Cron expression for running at the start of every hour
  //   async () => {
  //     try {
  //       const packedClass = new PackedService.Handler("sky", "packing");
  //       const _1 = await packedClass.getRawTransactions_1();
  //       const _2 = await _1.getAnalyticFiles_2();
  //       const _3_4 = _2.getJsObjects_3().getTablePackedRows_4();
  //       const _5 = await _3_4.createExcelReport_5();
  //       _5.sendMails_6();
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   },
  //   "PackedReportEveryHour"
  // );

  // scheduler.scheduleTask(
  //   "0 4 1 * *", // Cron expression for 6:00 AM on the 1st of each month
  //   async () => {
  //     // try {
  //     // Iterate over the transactionFunctionMapping object
  //     for (const [program, categories] of Object.entries(transactionFunctionMapping)) {
  //       for (const [category, _transactionFunction] of Object.entries(categories)) {
  //         // Initialize and process using the EfficiencyMonthlyService
  //         try {
  //           const handler = new EfficiencyService.PostgresHandler(program, category);
  //           // Process the transactions
  //           await handler.getRawTransactions_1();
  //           await handler.getAnalyticFiles_2_1();
  //           handler.getJsObjects_2_2();
  //           handler.getProcessedData_3();
  //           await handler.createExcelBaseEfficiencyReport_4_1();
  //           await handler.createExcelBaseEfficiencyReport_4_2();
  //           handler.sendMails_5();
  //         } catch (error) {
  //           console.error(
  //             `Error processing monthly reports at MonthlyEfficiencyReport scheduled task:`,
  //             error
  //           );
  //         }
  //       }
  //     }
  //   },
  //   "MonthlyEfficiencyReport" // Task name
  // );

  scheduler.scheduleTask(
    "0 4 * * 1", // 06:00 local time every Monday (04:00 UTC)
    async () => {
      try {
        const weeklyRange = getWeeklyRange();
        for (const [programKey, categories] of Object.entries(handlers)) {
          const program = programKey as GenericTypes.Program;
          for (const [categoryKey] of Object.entries(categories) as [
            keyof GenericTypes.ProgramCategoryTransaction[typeof program],
            any
          ][]) {
            const category = categoryKey;
            const opts: GenericTypes.RawOptions<typeof program, typeof category> = {
              startOfDay: weeklyRange.start,
              endOfDay: weeklyRange.end,
              contracts: GenericTypes.programContracts[program],
              fromCategory: category,
            };
            const handler = new EfficiencyService.PostgresHandler(program, category);
            await handler.getRawTransactions_1(opts);
            await handler.getAnalyticFiles_2_1();
            handler.getJsObjects_2_2();
            handler.getProcessedData_3();
            await handler.createExcelBaseEfficiencyReport_4_1();
            handler.sendMails_5("EFF-WEEKLY");
          }
        }
      } catch (error) {
        console.error(`Error in WeeklyEfficiencyReport:`, error);
      }
    },
    "WeeklyEfficiencyReport"
  );
  scheduler.scheduleTask(
    "0 4 1 * *", // 06:00 local time on the 1st of each month (04:00 UTC)
    async () => {
      try {
        const monthlyRange = getMonthlyRange();
        for (const [programKey, categories] of Object.entries(handlers)) {
          const program = programKey as GenericTypes.Program;
          for (const [categoryKey] of Object.entries(categories) as [
            keyof GenericTypes.ProgramCategoryTransaction[typeof program],
            any
          ][]) {
            const category = categoryKey;
            const opts: GenericTypes.RawOptions<typeof program, typeof category> = {
              startOfDay: monthlyRange.start,
              endOfDay: monthlyRange.end,
              contracts: GenericTypes.programContracts[program],
              fromCategory: category,
            };
            const handler = new EfficiencyService.PostgresHandler(program, category);
            await handler.getRawTransactions_1(opts);
            await handler.getAnalyticFiles_2_1();
            handler.getJsObjects_2_2();
            handler.getProcessedData_3();
            await handler.createExcelBaseEfficiencyReport_4_1();
            handler.sendMails_5("EFF-MONTHLY");
          }
        }
      } catch (error) {
        console.error(`Error in MonthlyEfficiencyReport:`, error);
      }
    },
    "MonthlyEfficiencyReport"
  );
  // !!!
  // scheduler.scheduleTask(
  //   "18 12 * * *", // At 14:14 every day
  //   async () => {
  //     console.log("🕒");
  //     // i log at 2025-04-24 14:18:00 🕒
  //   },
  //   "LogAt14_14"
  // );

  scheduler.startAllTasks();
};

const mountOneTimeTasks = () => {
  // const oneTimeScheduler = new OneTimeScheduler();
  // Schedule a one-time task to run after 5 seconds
  // oneTimeScheduler.scheduleTask(
  //   0,
  //   async () => {
  //     try {
  // const weeklyRange = getWeeklyRange();
  // weeklyRange { start:      2025-04-17T06:00:00.000Z, end: 2025-04-24T06:00:00.000Z }
  // meWeeklyPackingDateRange: 2025-04-17T06:00:00.000Z       2025-04-25T06:00:00.000Z
  // const monthlyRange = getMonthlyRange();
  // monthlyRange { start:      2025-03-24T06:00:00.000Z, end: 2025-04-24T06:00:00.000Z }
  // myMonthlyPackingDateRange: 2025-03-24T06:00:00.000Z       2025-04-25T06:00:00.000Z
  // for (const [programKey, categories] of Object.entries(handlers)) {
  //   const program = programKey as GenericTypes.Program;
  //   for (const [categoryKey] of Object.entries(categories) as [
  //     keyof GenericTypes.ProgramCategoryTransaction[typeof program],
  //     any
  //   ][]) {
  //     const category = categoryKey;
  //     const opts: GenericTypes.RawOptions<typeof program, typeof category> = {
  //       startOfDay: weeklyRange.start,
  //       endOfDay: weeklyRange.end,
  //       contracts: GenericTypes.programContracts[program],
  //       fromCategory: category,
  //     };
  //     const handler = new EfficiencyService.PostgresHandler(program, category);
  //     await handler.getRawTransactions_1(opts);
  //     await handler.getAnalyticFiles_2_1();
  //     handler.getJsObjects_2_2();
  //     handler.getProcessedData_3();
  //     await handler.createExcelBaseEfficiencyReport_4_1();
  //     handler.sendMails_5(undefined, ["maciej.zablocki@reconext.com"]);
  //   }
  // }
  //     } catch (error) {
  //       console.error(`Error in WeeklyEfficiencyReport:`, error);
  //     }
  //   },
  //   "WeeklyEfficiencyReportOneTime"
  // );
};

// const mountOneTimeTasks = () => {
//   const oneTimeScheduler = new OneTimeScheduler();
//   oneTimeScheduler.scheduleTask(
//     0,
//     async () => {
//       // const monthlyRange = getMonthlyRange();
//       try {
//         const weeklyRange = getWeeklyRange();
//         console.log("weeklyRange", weeklyRange);
//         // for (const [programKey, categories] of Object.entries(handlers)) {
//         //   const program = programKey as GenericTypes.Program;
//         //   for (const [categoryKey] of Object.entries(categories) as [
//         //     keyof GenericTypes.ProgramCategoryTransaction[typeof program],
//         //     any
//         //   ][]) {
//         //     const category = categoryKey;

//         //     const opts: GenericTypes.RawOptions<typeof program, typeof category> = {
//         //       startOfDay: weeklyRange.start,
//         //       endOfDay: weeklyRange.end,
//         //       contracts: GenericTypes.programContracts[program],
//         //       fromCategory: category,
//         //     };

//         //     const handler = new EfficiencyService.PostgresHandler(program, category);

//         //     await handler.getRawTransactions_1(opts);
//         //     await handler.getAnalyticFiles_2_1();
//         //     handler.getJsObjects_2_2();
//         //     handler.getProcessedData_3();
//         //     await handler.createExcelBaseEfficiencyReport_4_1();
//         //     handler.sendMails_5(undefined, ["maciej.zablocki@reconext.com"]);
//         //   }
//         // }
//       } catch (error) {
//         console.error(`Error in WeeklyEfficiencyReport:`, error);
//       }
//     },
//     "WeeklyEfficiencyReportOneTime"
//   );
// };

export { mountScheduledTasks, mountOneTimeTasks };
