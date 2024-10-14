export class TimerManager {
  private static instance: TimerManager;
  private timers: Record<string, boolean> = {}; // Initialize directly

  private constructor() {
    // Private constructor to prevent direct instantiation
  }

  /**
   * Retrieves the singleton instance of TimerManager.
   */
  public static getInstance(): TimerManager {
    if (!TimerManager.instance) {
      TimerManager.instance = new TimerManager();
    }
    return TimerManager.instance;
  }

  /**
   * Starts a timer with the given label if it hasn't started already.
   * @param label The label for the timer.
   */
  public startTimer(label: string): void {
    if (!this.timers[label]) {
      console.time(label);
      this.timers[label] = true; // Mark the timer as started
    } else {
      console.warn(`Timer with label "${label}" is already running.`);
    }
  }

  /**
   * Stops a timer with the given label if it has started.
   * @param label The label for the timer.
   */
  public stopTimer(label: string): void {
    if (this.timers[label]) {
      console.timeEnd(label);
      this.timers[label] = false; // Mark the timer as stopped
    } else {
      console.warn(`No timer with label "${label}" found or it's already stopped.`);
    }
  }

  /**
   * Resets all timers in case you want to clear everything.
   */
  public resetAllTimers(): void {
    this.timers = {}; // Clears all timer records
  }

  /**
   * Checks if a timer with a specific label is running.
   * @param label The label for the timer.
   * @returns {boolean} Whether the timer is running.
   */
  public isTimerRunning(label: string): boolean {
    return !!this.timers[label];
  }
}
