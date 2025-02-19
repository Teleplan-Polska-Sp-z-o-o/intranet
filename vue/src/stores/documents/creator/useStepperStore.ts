import { defineStore } from "pinia";
import { ref, unref } from "vue";
import { DocumentCreatorStepper } from "../../../components/views/tools/matrix/document/creator/tabs/new/StepperTypes";
import { Router } from "vue-router";

export type FSetStepper = (options: {
  type: DocumentCreatorStepper.EStepperType;
  stepper?: DocumentCreatorStepper.IStepper;
  navigation?: {
    router: Router;
    path?: string;
  };
}) => void;

export enum EStatus {
  NULL,
  EDIT,
  NEW,
}

export interface Status {
  enum: EStatus;
  tick: number;
}

export const useStepperStore = defineStore("document-creator-stepper", () => {
  const stepper = ref<DocumentCreatorStepper.IStepper | null>(null);

  const status = ref<Status>({
    enum: EStatus.NULL,
    tick: 0,
  });

  const setStatus = (newStatus: EStatus) => {
    status.value = {
      enum: newStatus,
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
        setStatus(EStatus.EDIT);
        stepper.value = instantiated;
      }
    }

    if (!options.stepper) {
      setStatus(EStatus.NEW);
      stepper.value = DocumentCreatorStepper.StepperFactory.createStepper(options.type);
    }

    if (options.navigation) {
      if (options.stepper && !flags.instantiated) return;

      options.navigation.router?.push({
        path: options.navigation.path || `/tool/matrix/browse/documents/creator/new`,
      });
    }
  };

  const clearStepper = () => {
    stepper.value = null;
    setStatus(EStatus.NULL);
  };

  return {
    stepper,
    status,
    setStepper,
    clearStepper,
  };
});
