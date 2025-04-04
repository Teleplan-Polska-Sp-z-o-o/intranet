import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { AnalyticRaw } from "../../components/views/tools/analytic/sky/transactions/Types";

export const useAnalyticRawTableStore = defineStore("analytic-raw-sky-table", () => {
  // const loadMap = ref<Map<string, boolean>>(new Map());
  // const isRawChanged = (id: string) => {
  //   return computed(() => loadMap.value.get(id));
  // };
  // const loadRawItems = (id: string) => {
  //   loadMap.value.set(id, true);
  //   setTimeout(() => {
  //     loadMap.value.set(id, false);
  //   }, 0);
  // };
  const itemsMap = ref<Map<string, AnalyticRaw.TTransactions>>(new Map());
  const getItemsData = (id: string) => {
    return computed(() => {
      const items = itemsMap.value.get(id);
      if (items === undefined) {
        console.warn(`itemsMap by key [${id}]: items evaluate to undefined. Returning [].`);
        return [];
      }
      return items;
    });
  };
  const setItemsData = (id: string, data: AnalyticRaw.TTransactions) => {
    itemsMap.value.set(id, data);
  };

  // watch(
  //   itemsMap,
  //   (v) => {
  //     console.log(v);
  //   },
  //   { deep: true }
  // );

  const preFormDataMap = ref<Map<string, AnalyticRaw.IPreFormData>>(new Map());
  const getPreFormData = (id: string) => {
    return computed(() => preFormDataMap.value.get(id));
  };
  const setPreFormData = (id: string, data: AnalyticRaw.IPreFormData) => {
    preFormDataMap.value.set(id, data);
  };

  return {
    getItemsData,
    setItemsData,
    getPreFormData,
    setPreFormData,
  };
});
