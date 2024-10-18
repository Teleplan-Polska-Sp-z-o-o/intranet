import {
  TDocumentChange,
  IDocumentChangeFields,
  TSourceTitle,
} from "../../../interfaces/change/document/request/DocumentChangeTypes";
import { DocumentChange } from "../../../orm/entity/change/documents/DocumentChangeEntity";

class DocumentChangeFields implements IDocumentChangeFields {
  priority: "low" | "medium" | "high";
  affected: string;
  docxNumber: string | null;
  docxRevision: number;
  docxReference?: string;
  checker: string | null;
  approver: string | null;
  registerer: string | null;
  affectedCompetences: string | null;
  requireAcknowledgmentOrTraining: "acknowledgment" | "training";
  trainingDetails: string | null;
  fileNames: string;
  docxSource: TSourceTitle;
  tags: string | null;

  constructor(from: IDocumentChangeFields | TDocumentChange | DocumentChange) {
    this.priority = from.priority;
    this.affected = from.affected;
    this.docxNumber = from.docxNumber;
    this.docxRevision = from.docxRevision;
    // this.docxReference = from.docxReference;
    this.checker = from.checker;
    this.approver = from.approver;
    this.registerer = from.registerer;
    this.affectedCompetences = from.affectedCompetences;
    this.requireAcknowledgmentOrTraining = from.requireAcknowledgmentOrTraining;
    this.trainingDetails = from.trainingDetails;
    this.fileNames = from.fileNames;
    this.docxSource = from.docxSource;
    this.tags = from.tags;
    return this;
  }

  areFieldsFilled(): boolean {
    for (const [key, value] of Object.entries(this)) {
      if (key === "trainingDetails" && this.requireAcknowledgmentOrTraining === "acknowledgment")
        continue;
      else if (key === "docxNumber" && this.docxSource === "not_previously_uploaded_new") continue;
      else if (key === "tags") continue;
      // else if (
      //   key === "affected" &&
      //   value ===
      //     `<div class="ck-override-vuetify-styles"></div><div class="ck ck-content"><p><span style="color:hsl(0,0%,60%);">Change Description</span></p></div>`
      // )
      // return false;
      else if (key === "fileNames" && value === "[]") return false;
      else if (key === "affectedCompetences") continue;

      if (!!!value) {
        return false;
      }
    }

    return true;
  }
}

export { DocumentChangeFields };
