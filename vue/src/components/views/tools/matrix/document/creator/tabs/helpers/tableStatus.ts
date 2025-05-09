import { IDraftEntity } from "../../../../../../../../interfaces/document/creator/IDraftEntity";
import { DocumentCreatorStepper } from "../new/StepperTypes";
const tBase = "tools.tcd.drafts";

function tableStatus(
  item: IDraftEntity | DocumentCreatorStepper.EStepperStatus,
  t: any
): {
  enum: undefined | DocumentCreatorStepper.EStepperStatus;
  color: undefined | string;
  text: string;
} {
  const status = typeof item === "number" ? item : item.stepper._status;
  switch (status) {
    case DocumentCreatorStepper.EStepperStatus.DRAFT:
      return {
        enum: DocumentCreatorStepper.EStepperStatus.DRAFT,
        color: "gray",
        text: t(`${tBase}.draftStatus.chip.draftOption`),
      };
    case DocumentCreatorStepper.EStepperStatus.FOR_RELEASE:
      return {
        enum: DocumentCreatorStepper.EStepperStatus.FOR_RELEASE,
        color: "secondary", // "green",
        text: t(`${tBase}.draftStatus.chip.forReleaseOption`),
      };

    case DocumentCreatorStepper.EStepperStatus.RELEASED:
      return {
        enum: DocumentCreatorStepper.EStepperStatus.RELEASED,
        color: "primary", //"blue",
        text: t(`${tBase}.draftStatus.chip.releasedOption`),
      };

    case DocumentCreatorStepper.EStepperStatus.ARCHIVED:
      return {
        enum: DocumentCreatorStepper.EStepperStatus.ARCHIVED,
        color: "tertiary", // "indigo",
        text: t(`${tBase}.draftStatus.chip.archived`),
      };

    default:
      return {
        enum: undefined,
        color: undefined,
        text: t(`${tBase}.draftStatus.chip.unknown`),
      };
  }
}

export { tableStatus };
