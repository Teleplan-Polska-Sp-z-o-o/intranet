import { defineStore } from "pinia";
import { ref, unref, watch } from "vue";
import { DocumentCreatorStepper } from "../../../components/views/tools/matrix/document/creator/tabs/new/StepperTypes";
import { Router } from "vue-router";
// import { deepSafeParse } from "../../../components/views/tools/matrix/document/creator/tabs/helpers/deepSaveParse";
// import stringify from "safe-stable-stringify";
import { CreatorCacheManager } from "../../../models/document/creator/CreatorCacheManager";

export type FSetStepper = (options: {
  type: DocumentCreatorStepper.EStepperType;
  stepper?: DocumentCreatorStepper.IStepper;
  basedOn?: boolean;
  navigation?: {
    router: Router;
    path: string;
  };
}) => void;

export enum EStatus {
  NULL,
  EDIT,
  NEW,
  NEW_BASED,
}

export interface Status {
  enum: EStatus;
  previous_enum: EStatus | null;
  tick: number;
}

export const useStepperStore = defineStore("document-creator-stepper", () => {
  const DOCUMENT_CONTROLLERS = ["anna.gandziarowska", "roma.kuberska", "sigrid.castillo"];
  const cacheManager = new CreatorCacheManager();
  // const STORAGE_KEY = "document-creator-stepper";

  const stepper = ref<DocumentCreatorStepper.IStepper | null>(null);

  const status = ref<Status>({
    enum: EStatus.NULL,
    previous_enum: null,
    tick: 0,
  });

  const flags = ref({
    isStorageLoaded: false,
    isAutoSaveStarted: false,
    autoSaveIntervalId: null as ReturnType<typeof setInterval> | null,
  });

  const setStatus = (newStatus: EStatus) => {
    status.value = {
      enum: newStatus,
      previous_enum: status.value.enum,
      tick: unref(status).tick++,
    };
  };

  const setStepper: FSetStepper = (options) => {
    const flags = { instantiated: false };
    if (options.stepper) {
      const instantiated: DocumentCreatorStepper.IStepper =
        DocumentCreatorStepper.StepperFactory.createStepper(options.type, options.stepper);

      if (instantiated) {
        flags.instantiated = !!instantiated;
        stepper.value = instantiated;
        if (options.basedOn) setStatus(EStatus.NEW_BASED);
        else setStatus(EStatus.EDIT);
      }
    }

    if (!options.stepper) {
      stepper.value = DocumentCreatorStepper.StepperFactory.createStepper(options.type, undefined);
      setStatus(EStatus.NEW);
    }

    if (options.navigation) {
      if (options.stepper && !flags.instantiated) return;

      options.navigation.router.push({
        path: options.navigation.path,
      });
    }
  };

  const clearStepper = () => {
    stopAutoSave();
    // clearStorage();
    stepper.value = null;
    setStatus(EStatus.NULL);
  };

  // const saveToStorage = () => {
  //   if (stepper.value) {
  //     const steps: DocumentCreatorStepper.Header.TStepKey[] = [1, 2, 3];
  //     for (const step of steps) {
  //       const window = stepper.value.body.windows[step];
  //       if (window && window.form) {
  //         window.form = null;
  //       }
  //     }
  //   }

  //   const stringified = stringify({
  //     stepper: stepper.value,
  //     status: status.value,
  //   });
  //   if (stringified) {
  //     localStorage.setItem(STORAGE_KEY, stringified);
  //   }
  // };

  const saveToServer = async () => {
    if (stepper.value) {
      const steps: DocumentCreatorStepper.Header.TStepKey[] = [1, 2, 3];
      for (const step of steps) {
        const window = stepper.value.body.windows[step];
        if (window && window.form) {
          window.form = null;
        }
      }

      try {
        await cacheManager.post(stepper.value);
      } catch (error) {
        console.error("Failed to save stepper state to server", error);
      }
    }
  };

  // const loadFromStorage = (stored: string | null) => {
  //   if (stored && !flags.value.isStorageLoaded) {
  //     try {
  //       const parsed = deepSafeParse<{
  //         stepper: DocumentCreatorStepper.IStepper;
  //         status: Status;
  //       }>(stored);

  //       setStepper({
  //         type: parsed.stepper.type,
  //         stepper: parsed.stepper,
  //       });

  //       flags.value.isStorageLoaded = true;
  //     } catch (error) {
  //       console.error("Failed to parse stepper state from storage", error);
  //     }
  //   }
  // };

  const loadFromServer = async () => {
    try {
      const response = await cacheManager.get();

      const cachedStepper = response?.cache?.[0]?.stepper;

      if (cachedStepper && !flags.value.isStorageLoaded) {
        setStepper({
          type: cachedStepper.type,
          stepper: cachedStepper,
        });

        flags.value.isStorageLoaded = true;
      }
    } catch (error) {
      console.error("Failed to load stepper state from server", error);
    }
  };

  // const clearStorage = () => {
  //   localStorage.removeItem(STORAGE_KEY);
  // };

  const startAutoSave = () => {
    if (flags.value.isAutoSaveStarted || flags.value.autoSaveIntervalId !== null) return;

    flags.value.autoSaveIntervalId = setInterval(() => {
      // saveToStorage();
      saveToServer();
    }, 30 * 1000); // every 30 seconds

    // window.addEventListener("beforeunload", saveToStorage);
    window.addEventListener("beforeunload", saveToServer);

    flags.value.isAutoSaveStarted = true;
  };

  const stopAutoSave = () => {
    if (flags.value.autoSaveIntervalId !== null) {
      clearInterval(flags.value.autoSaveIntervalId);
      flags.value.autoSaveIntervalId = null;
      flags.value.isAutoSaveStarted = false;
    }

    // window.removeEventListener("beforeunload", saveToStorage);
    window.removeEventListener("beforeunload", saveToServer);
  };

  watch(
    stepper,
    (currentStepper) => {
      if (!flags.value.isStorageLoaded && currentStepper === null) {
        // loadFromStorage(localStorage.getItem(STORAGE_KEY));
        loadFromServer();
      }

      if (currentStepper !== null) {
        startAutoSave();
      }
    },
    { immediate: true }
  );

  return {
    DOCUMENT_CONTROLLERS,
    stepper,
    status,
    setStepper,
    clearStepper,
    flags,
    stopAutoSave,
  };
});
