import { defineStore } from "pinia";
import { ResponseStatus } from "../models/common/ResponseStatus";
import { computed, ComputedRef, Ref, ref } from "vue";
import { Alert, Color } from "../interfaces/common/AlertTypes";

export const useAlertStore = defineStore("alert", () => {
  const timeout: Ref<number> = ref<number>(6000);
  const display: Ref<boolean> = ref<boolean>(false);
  const message: Ref<string> = ref<string>("");

  const color: Ref<Color> = ref<Color>("info");

  /**
   * Computed property to get current alert state.
   * @returns {Alert} The current alert state.
   */
  const alert: ComputedRef<Alert> = computed(() => {
    return {
      timeout: timeout.value,
      display: display.value,
      message: message.value,
      color: color.value,
    };
  });

  /**
   * Processes the response status and updates the alert state.
   * @param {ResponseStatus | string} status - The response status or message.
   * @param {boolean} [persist=false] - Whether the alert should persist.
   */
  const process = (status: ResponseStatus | string, persist: boolean = false): void => {
    try {
      display.value = false;

      let statusMessage: string = "";
      let statusCode = 0;

      if (status instanceof ResponseStatus) {
        statusMessage = status.message;
        statusCode = status.code;
      } else {
        statusMessage = status;
      }

      message.value = statusMessage;

      if (statusCode >= 200 && statusCode < 300) {
        color.value = "success";
      } else if (statusCode >= 300 && statusCode < 500) {
        color.value = "error";
      } else {
        color.value = "info";
      }

      if (persist) timeout.value = -1;
      else timeout.value = 6000;

      display.value = true;
    } catch (error) {
      console.error(
        `alertStore at process: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  };

  return { process, alert };
});
