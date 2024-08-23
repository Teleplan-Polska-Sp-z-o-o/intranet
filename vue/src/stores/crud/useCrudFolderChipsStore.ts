import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { Chips } from "../../models/document/Chips";

export const useCrudFolderChipsStore = defineStore("crud-chips", () => {
  const chipsMap = ref<Map<string, Chips>>(new Map());

  const getChips = (id: string | undefined) => {
    return computed(() => (id ? chipsMap.value.get(id) || new Chips() : new Chips()));
  };

  const emitChange = (id: string, value: Chips) => {
    chipsMap.value.set(id, value);
  };

  return { getChips, emitChange };
});
