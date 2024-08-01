import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useDCRStore = defineStore("dcr", () => {
  const tableChange = ref<boolean>(false);
  const getSignal = computed(() => tableChange.value);

  const sendSignal = () => {
    tableChange.value = true;
    setTimeout(() => {
      tableChange.value = false;
    }, 0);
  };

  return { sendSignal, getSignal };
});
