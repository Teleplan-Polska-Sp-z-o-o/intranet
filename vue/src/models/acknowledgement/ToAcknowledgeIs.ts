import { AcknowledgementTypes } from "../../interfaces/acknowledgement/AcknowledgementTypes";

export class ToAcknowledgeIs implements AcknowledgementTypes.IIs {
  isSafetyDocument: boolean = false;

  constructor(properties: (keyof AcknowledgementTypes.IIs)[]) {
    for (const property of properties) {
      this[property] = true;
    }
  }
}
