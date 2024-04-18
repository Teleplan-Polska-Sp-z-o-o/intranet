import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useNotificationStore = defineStore("notification", () => {
  const signal = ref<boolean>(false);
  const getSignal = computed(() => signal.value);
  const sendSignal = () => {
    signal.value = true;
    setTimeout(() => {
      signal.value = false;
    }, 0);
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

  return { getSignal, sendSignal, getNotificationMenu, setNotificationMenu };
});
