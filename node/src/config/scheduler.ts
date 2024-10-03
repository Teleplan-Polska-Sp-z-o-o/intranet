import { Not } from "typeorm";
import { Scheduler } from "../models/common/Scheduler";
import { DocumentChange } from "../orm/entity/change/documents/DocumentChangeEntity";
import { dataSource } from "./dataSource";
import { User } from "../orm/entity/user/UserEntity";
import { EDCNotificationVariant } from "../interfaces/user/notification/ENotificationVariant";
import { PackedService } from "../services/analytic/PackedService";

const mountScheduledTasks = () => {
  const scheduler = new Scheduler();

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

  scheduler.startAllTasks();
};

export { mountScheduledTasks };
