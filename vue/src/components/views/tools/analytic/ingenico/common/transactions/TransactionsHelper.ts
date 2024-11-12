import { onUnmounted } from "vue";

export class TransactionsHelper {
  // A method that triggers a callback function at the start of each minute and allows stopping the interval externally
  static triggerAdaptiveLoad(callback: () => void, every: number): () => void {
    const now = new Date();
    const millisecondsUntilNextMinute = (60 - now.getSeconds()) * 1000;

    let interval: NodeJS.Timeout | null = null; // To store interval id

    // Set a timeout to call the callback function at the start of the next minute
    const timeout = setTimeout(() => {
      callback(); // Call the callback function immediately at the start of the next minute

      // Then, set an interval to call the callback function every minute
      interval = setInterval(callback, every * 60 * 1000);
    }, millisecondsUntilNextMinute);

    // Function to stop the interval and timeout
    const stopInterval = () => {
      if (interval) {
        clearInterval(interval);
        interval = null; // Clean up the interval reference
      }
      clearTimeout(timeout);
    };

    // Clear the timeout and interval when the component is destroyed
    onUnmounted(() => {
      stopInterval();
    });

    // Return the stopInterval function to be called externally
    return stopInterval;
  }
}
