import { Scheduler } from "../models/common/Scheduler";
import { UserHeartbeat } from "../models/websocket/UserHeartbeat";

const mountScheduledTasks = () => {
  const scheduler = new Scheduler();

  // Schedule the cleanup task to run every day at midnight
  scheduler.scheduleTask(
    "0 0 * * *",
    () => {
      UserHeartbeat.cleanOldRecords()
        .then(() => console.log("Old records cleaned up successfully"))
        .catch((err) => console.error("Failed to clean old records:", err));
    },
    "CleanOldRecordsTask"
  );

  scheduler.startAllTasks();
};

export { mountScheduledTasks };
