import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { AnalyticRaw } from "../../components/views/tools/analytic/dell/common/transactions/Types";

export const useAnalyticRawTableStore = defineStore("analytic-raw-dell-table", () => {
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
