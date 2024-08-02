import { Not } from "typeorm";
import { Scheduler } from "../models/common/Scheduler";
import { DocumentChange } from "../orm/entity/change/documents/DocumentChangeEntity";
import { dataSource } from "./dataSource";
import { User } from "../orm/entity/user/UserEntity";
import { EDCNotificationVariant } from "../interfaces/user/notification/ENotificationVariant";

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

  scheduler.startAllTasks();
};

export { mountScheduledTasks };
