import cron, { ScheduledTask } from "node-cron";

type CronTask = {
  name: string;
  task: ScheduledTask;
};

class CronScheduler {
  private tasks: CronTask[] = [];

  constructor() {}

  // Schedule a repeating task using cron expression
  public scheduleTask(cronExpression: string, taskFunction: () => void, taskName: string): void {
    const task = cron.schedule(cronExpression, taskFunction);
    this.tasks.push({ name: taskName, task });
    console.log(`Scheduled task "${taskName}" with cron expression "${cronExpression}"`);
  }

  // Start all tasks
  public startAllTasks(): void {
    this.tasks.forEach(({ name, task }) => {
      task.start();
      console.log(`Started task "${name}"`);
    });
  }

  // Stop all tasks
  public stopAllTasks(): void {
    this.tasks.forEach(({ name, task }) => {
      task.stop();
      console.log(`Stopped task "${name}"`);
    });
  }

  // Start a specific task
  public startTask(taskName: string): void {
    const task = this.tasks.find(({ name }) => name === taskName);
    if (task) {
      task.task.start();
      console.log(`Started task "${taskName}"`);
    } else {
      console.log(`Task "${taskName}" not found`);
    }
  }

  // Stop a specific task
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

type OneTimeTask = {
  name: string;
  task: NodeJS.Timeout;
};

class OneTimeScheduler {
  private tasks: OneTimeTask[] = [];

  constructor() {}

  // Schedule a one-time task with setTimeout
  public scheduleTask(delayInMs: number, taskFunction: () => void, taskName: string): void {
    const timeoutId = setTimeout(() => {
      taskFunction();
      console.log(`Executed one-time task "${taskName}"`);
      // Remove the task from the list after execution
      this.tasks = this.tasks.filter((t) => t.name !== taskName);
    }, delayInMs);

    this.tasks.push({ name: taskName, task: timeoutId });
    console.log(`Scheduled one-time task "${taskName}" to run after ${delayInMs} ms`);
  }

  // Stop all one-time tasks
  public stopAllTasks(): void {
    this.tasks.forEach(({ name, task }) => {
      clearTimeout(task);
      console.log(`Cleared one-time task "${name}"`);
    });
    this.tasks = [];
  }

  // Stop a specific one-time task
  public stopTask(taskName: string): void {
    const task = this.tasks.find(({ name }) => name === taskName);
    if (task) {
      clearTimeout(task.task);
      console.log(`Cleared one-time task "${taskName}"`);
      this.tasks = this.tasks.filter((t) => t.name !== taskName);
    } else {
      console.log(`Task "${taskName}" not found`);
    }
  }
}
export { CronScheduler, OneTimeScheduler };
