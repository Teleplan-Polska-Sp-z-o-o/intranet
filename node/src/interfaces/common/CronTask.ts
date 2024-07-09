import { ScheduledTask } from "node-cron";

type CronTask = {
  name: string;
  task: ScheduledTask;
};

export { type CronTask };
