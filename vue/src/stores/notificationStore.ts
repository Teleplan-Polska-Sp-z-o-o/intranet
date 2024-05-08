import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";

export const useNotificationStore = defineStore("notification", () => {
  const signal = ref<boolean>(false);
  // const getSignal = computed(() => signal.value);

  const centerSignal = ref<boolean>(false);
  const getCenterSignal = computed(() => centerSignal.value);

  const barSignal = ref<boolean>(false);
  const getBarSignal = computed(() => barSignal.value);

  watch(signal, (newSignal) => {
    centerSignal.value = newSignal;
    barSignal.value = newSignal;
  });

  const sendSignal = () => {
    signal.value = true;
    setTimeout(() => {
      signal.value = false;
    }, 0);
  };

  const resetSignal = (signalLocation: "bar" | "center") => {
    if (signalLocation === "bar") barSignal.value = false;
    else if (signalLocation === "center") centerSignal.value = false;
  };

  const notificationCenterMenu = ref<{
    [key: string]: boolean;
  }>({
    Unread: true,
    Read: true,
  });

  const getNotificationMenu = () => notificationCenterMenu.value;
  const setNotificationMenu = (menu: { [key: string]: boolean }) =>
    (notificationCenterMenu.value = menu);

  return {
    resetSignal,
    sendSignal,
    getCenterSignal,
    getBarSignal,
    getNotificationMenu,
    setNotificationMenu,
  };
});
