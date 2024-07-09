import { CronTask } from "../../interfaces/common/CronTask";
import cron from "node-cron";

class Scheduler {
  private tasks: CronTask[] = [];

  constructor() {}

  public scheduleTask(cronExpression: string, taskFunction: () => void, taskName: string): void {
    const task = cron.schedule(cronExpression, taskFunction);
    this.tasks.push({ name: taskName, task });
    console.log(`Scheduled task "${taskName}" with cron expression "${cronExpression}"`);
  }

  public startAllTasks(): void {
    this.tasks.forEach(({ name, task }) => {
      task.start();
      console.log(`Started task "${name}"`);
    });
  }

  public stopAllTasks(): void {
    this.tasks.forEach(({ name, task }) => {
      task.stop();
      console.log(`Stopped task "${name}"`);
    });
  }

  public startTask(taskName: string): void {
    const task = this.tasks.find(({ name }) => name === taskName);
    if (task) {
      task.task.start();
      console.log(`Started task "${taskName}"`);
    } else {
      console.log(`Task "${taskName}" not found`);
    }
  }

  public stopTask(taskName: string): void {
    const task = this.tasks.find(({ name }) => name === taskName);
    if (task) {
      task.task.stop();
      console.log(`Stopped task "${taskName}"`);
    } else {
      console.log(`Task "${taskName}" not found`);
    }
  }
}

export { Scheduler };
