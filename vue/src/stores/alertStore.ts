import { defineStore } from "pinia";
import { ResponseStatus } from "../models/common/ResponseStatus";
import { computed, ComputedRef, Ref, ref } from "vue";
import { Alert } from "../interfaces/common/AlertTypes";

export const useAlertStore = defineStore("alert", () => {
  const alertRef: Ref<Alert> = ref<Alert>({
    timeout: 6000,
    display: false,
    message: "",
    color: "info",
  });

  /**
   * Computed property to get current alert state.
   * @returns {Alert} The current alert state.
   */
  const alert: ComputedRef<Alert> = computed(() => {
    return alertRef.value;
  });

  /**
   * Processes the response status and updates the alert state.
   * @param {ResponseStatus | string} status - The response status or message.
   * @param {boolean} [persist=false] - Whether the alert should persist.
   */
  const process = (status: ResponseStatus | string, persist: boolean = false): void => {
    try {
      alertRef.value.display = false;

      let statusMessage: string = "";
      let statusCode = 0;

      if (status instanceof ResponseStatus) {
        statusMessage = status.message;
        statusCode = status.code;
      } else {
        statusMessage = status;
      }

      alertRef.value.message = statusMessage;

      if (statusCode >= 200 && statusCode < 300) {
        alertRef.value.color = "success";
      } else if (statusCode >= 300 && statusCode < 500) {
        alertRef.value.color = "error";
      } else {
        alertRef.value.color = "info";
      }

      alertRef.value.display = true;
      alertRef.value.timeout = persist ? -1 : 6000;
    } catch (error) {
      console.error(
        `alertStore at process: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  };

  return { process, alert };
});
