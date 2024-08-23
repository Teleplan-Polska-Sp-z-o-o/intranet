import { defineStore } from "pinia";
import { computed, ComputedRef, ref } from "vue";
import { EDocumentType, TDocumentType } from "../../interfaces/document/DocumentTypes";

export const useCrudTypeChipsStore = defineStore("crud-type", () => {
  const typesMap = ref<Map<string, TDocumentType[]>>(new Map());
  const TYPES: TDocumentType[] = Object.values(EDocumentType);

  const getTypes = (id: string | undefined): ComputedRef<TDocumentType[]> => {
    return computed(() => (id ? typesMap.value.get(id) || TYPES : TYPES));
  };

  const emitChange = (id: string, value: TDocumentType[]) => {
    typesMap.value.set(id, value);
  };

  return { emitChange, getTypes, TYPES };
});
