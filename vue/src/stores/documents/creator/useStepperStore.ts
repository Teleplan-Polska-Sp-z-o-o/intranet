import { defineStore } from "pinia";
import { ref, unref } from "vue";
import { DocumentCreatorStepper } from "../../../components/views/tools/matrix/document/creator/tabs/new/StepperTypes";
import { Router } from "vue-router";

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
  const DOCUMENT_CONTROLLERS = ["anna.gandziarowska", "roma.kuberska"];

  const stepper = ref<DocumentCreatorStepper.IStepper | null>(null);

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
    stepper.value = null;
    setStatus(EStatus.NULL);
  };

  return {
    DOCUMENT_CONTROLLERS,
    stepper,
    status,
    setStepper,
    clearStepper,
  };
});
