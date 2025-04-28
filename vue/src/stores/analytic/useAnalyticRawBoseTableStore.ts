import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { CommonAnalyticTypes } from "../../components/views/tools/analytic/common/types";

export const useAnalyticRawTableStore = defineStore("analytic-raw-bose-table", () => {
  const itemsMap = ref<
    Map<string, CommonAnalyticTypes.IAnalyticModelResponse<CommonAnalyticTypes.IRawBoseTransaction>>
  >(new Map());
  const getItemsData = (id: string) => {
    return computed(() => {
      const items = itemsMap.value.get(id);
      if (items === undefined) {
        console.warn(`itemsMap by key [${id}]: items evaluate to undefined. Returning.`);
        return { raw: [], processed: [], missingCache: [] };
      }
      return items;
    });
  };
  const setItemsData = (
    id: string,
    data: CommonAnalyticTypes.IAnalyticModelResponse<CommonAnalyticTypes.IRawBoseTransaction>
  ) => {
    itemsMap.value.set(id, data);
  };

  const preFormDataMap = ref<Map<string, CommonAnalyticTypes.IPreFormData>>(new Map());
  const getPreFormData = (id: string) => {
    return computed(() => preFormDataMap.value.get(id));
  };
  const setPreFormData = (id: string, data: CommonAnalyticTypes.IPreFormData) => {
    preFormDataMap.value.set(id, data);
  };

  return {
    getItemsData,
    setItemsData,
    getPreFormData,
    setPreFormData,
  };
});
