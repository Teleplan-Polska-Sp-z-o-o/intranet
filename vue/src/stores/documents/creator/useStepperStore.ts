import { defineStore } from "pinia";
import { ref, unref } from "vue";
import { DocumentCreatorStepper } from "../../../components/views/tools/matrix/document/creator/tabs/new/StepperTypes";
import { Router } from "vue-router";
import { CreatorCacheManager, ICache } from "../../../models/document/creator/CreatorCacheManager";
import moment from "moment";

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

  const stepper = ref<DocumentCreatorStepper.StepperClasses | null>(null);

  const status = ref<Status>({
    enum: EStatus.NULL,
    previous_enum: null,
    tick: 0,
  });

  const setStatus = (newStatus: EStatus) => {
    status.value = {
      enum: newStatus,
      previous_enum: status.value.enum,
      tick: unref(status).tick++,
    };
  };

  const flags = ref({
    isStorageLoaded: false,
    isAutoSaveStarted: false,
    autoSaveIntervalId: null as ReturnType<typeof setInterval> | null,
    lastSavedAt: null as moment.Moment | null,
  });

  const setStepper: FSetStepper = (options) => {
    const flags = { instantiated: false };
    if (options.stepper) {
      const instantiated: DocumentCreatorStepper.StepperClasses =
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
    stepper.value = null;
    setStatus(EStatus.NULL);
  };

  const saveToServer = async () => {
    if (stepper.value) {
      stepper.value.beforeSave();

      // const steps: DocumentCreatorStepper.Header.TStepKey[] = [1, 2, 3];
      // for (const step of steps) {
      //   const window = stepper.value.body.windows[step];
      //   if (window && window.form) {
      //     window.form = null;
      //   }
      // }

      try {
        await cacheManager.post(stepper.value);
        flags.value.lastSavedAt = moment().utc();
      } catch (error) {
        console.error("Failed to save stepper state to server", error);
      }
    }
  };

  type LoadParams =
    | { id: number; cache?: never; navigation?: { router: Router; path: string } }
    | { cache: ICache; id?: never; navigation?: { router: Router; path: string } };
  const loadFromServer = async (params: LoadParams) => {
    try {
      let cachedEntry: ICache | undefined = undefined;

      if ("id" in params) {
        const response = await cacheManager.get(params.id);
        cachedEntry = response?.cache?.[0];
      } else {
        cachedEntry = params.cache;
      }

      const cachedStepper = cachedEntry?.stepper;

      if (cachedStepper) {
        setStepper({
          type: cachedStepper.type,
          stepper: cachedStepper,
          ...(params.navigation ? { navigation: params.navigation } : {}),
        });

        if (!flags.value.lastSavedAt) {
          const timestamp = cachedEntry?.ormUpdateDate || cachedEntry?.ormCreateDate || null;
          if (timestamp) {
            flags.value.lastSavedAt = moment.utc(timestamp);
          }
        }

        // flags.value.isStorageLoaded = true;
      }
    } catch (error) {
      console.error("Failed to load stepper state from server", error);
    }
  };

  const startAutoSave = () => {
    if (flags.value.isAutoSaveStarted || flags.value.autoSaveIntervalId !== null) return;
    flags.value.autoSaveIntervalId = setInterval(saveToServer, 30 * 1000);
    window.addEventListener("beforeunload", saveToServer);
    flags.value.isAutoSaveStarted = true;
  };

  const stopAutoSave = () => {
    if (flags.value.autoSaveIntervalId !== null) {
      clearInterval(flags.value.autoSaveIntervalId);
      flags.value.autoSaveIntervalId = null;
      flags.value.isAutoSaveStarted = false;
      flags.value.isStorageLoaded = false;
      flags.value.lastSavedAt = null;
    }
    window.removeEventListener("beforeunload", saveToServer);
  };

  return {
    DOCUMENT_CONTROLLERS,
    stepper,
    status,
    setStepper,
    clearStepper,
    flags,
    loadFromServer,
    startAutoSave,
    stopAutoSave,
  };
});
