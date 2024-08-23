import { defineStore } from "pinia";
import { computed, Ref, ref, unref } from "vue";
import { CommonTypes } from "../../interfaces/common/CommonTypes";

export const useCrudStore = defineStore("crud", () => {
  const loadMap = ref<Map<string, boolean>>(new Map());

  /**
   * Computed property `load` that tracks the `change` state for a specific ID.
   */
  const getLoad = (id: string | undefined) => {
    return computed(() => (id ? loadMap.value.get(id) || false : false));
  };

  /**
   * Load new items in mounted CRUD tables for a specific ID.
   */
  const loadItems = (id: string) => {
    loadMap.value.set(id, true);
    setTimeout(() => {
      loadMap.value.set(id, false);
    }, 0);
  };

  const managerMap = ref<Map<string, any>>(new Map());

  /**
   * Sets a manager instance in the manager map.
   *
   */
  const setManager = (
    id: string,
    manager: CommonTypes.Api.GetManager | Ref<CommonTypes.Api.GetManager>
  ) => {
    managerMap.value.set(id, unref(manager));
  };

  /**
   * Retrieves a computed reference to a manager instance from the manager map.
   *
   */
  const getManager = (id: string | undefined) => {
    if (!id) return undefined;
    return computed(() => managerMap.value.get(id));
  };

  return { getLoad, loadItems, setManager, getManager };
});
