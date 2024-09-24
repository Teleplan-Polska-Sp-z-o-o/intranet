import { defineStore } from "pinia";
import { computed, Ref, ref, unref } from "vue";

export const useAnalyticStore = defineStore("analytic", () => {
  const loadMap = ref<Map<string, boolean>>(new Map());
  const loadItems = (uuid: string) => {
    loadMap.value.set(uuid, true);
    setTimeout(() => {
      loadMap.value.set(uuid, false);
    }, 0);
  };
  const getLoad = (uuid: string) => {
    return computed(() => (uuid ? loadMap.value.get(uuid!) || false : false));
  };

  // Object to store the dialog state for each fileId
  const dialog = ref<Record<string, boolean>>({});
  // Open the dialog for a specific fileId and actionId
  const openDialog = (uuid: string | Ref<string>) => {
    dialog.value[unref(uuid)] = true;
  };
  // Close the dialog for a specific fileId by setting actionId to null
  const closeDialog = (uuid: string | Ref<string>) => {
    dialog.value[unref(uuid)] = false;
  };
  // Check if the dialog is open for a specific fileId and actionId
  const isDialogOpen = (uuid: string | Ref<string>) => {
    return dialog.value[unref(uuid)] === true;
  };

  const loadingActions = ref<Record<string, number[]>>({});
  const startLoadingAction = (uuid: string | Ref<string>, actionId: number) => {
    const resolvedUuid = unref(uuid);

    // Initialize the array for the uuid if it doesn't exist
    if (!loadingActions.value[resolvedUuid]) {
      loadingActions.value[resolvedUuid] = [];
    }

    // Add the actionId to the array if it doesn't already exist
    if (!loadingActions.value[resolvedUuid].includes(actionId)) {
      loadingActions.value[resolvedUuid].push(actionId);
    }
  };
  const stopLoadingAction = (uuid: string | Ref<string>, actionId: number) => {
    const resolvedUuid = unref(uuid);

    // Ensure the uuid array exists before filtering
    if (loadingActions.value[resolvedUuid]) {
      loadingActions.value[resolvedUuid] = loadingActions.value[resolvedUuid].filter(
        (id) => id !== actionId
      );
    }
  };
  const isActionLoading = (uuid: string | Ref<string>, actionId: number) => {
    const resolvedUuid = unref(uuid);

    // Return false if the uuid is not present
    return loadingActions.value[resolvedUuid]?.includes(actionId) ?? false;
  };

  return {
    loadItems,
    getLoad,
    openDialog,
    closeDialog,
    isDialogOpen,
    loadingActions,
    startLoadingAction,
    stopLoadingAction,
    isActionLoading,
  };
});
