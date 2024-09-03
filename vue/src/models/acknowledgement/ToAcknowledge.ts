import { AcknowledgementTypes } from "../../interfaces/acknowledgement/AcknowledgementTypes";
import { DocumentEntity } from "../document/DocumentEntity";
import { QuizModels } from "../QuizModels";

export class ToAcknowledge implements AcknowledgementTypes.IToAcknowledgeEntity {
  id: number;
  documents: DocumentEntity[];
  quiz: QuizModels.Quiz | null;
  acknowledgementStartDate: Date | null;
  description: string;
  isSafetyDocument: boolean;
  closed: boolean;
  acknowledgementClosedDate: Date | null;

  constructor(
    id: number = 0,
    documents: DocumentEntity[] = [],
    description: string = "",
    quiz: QuizModels.Quiz | null = null,
    acknowledgementStartDate: Date | null = null
  ) {
    this.id = id;
    this.documents = documents;
    this.quiz = quiz;
    this.description = description;
    this.acknowledgementStartDate = acknowledgementStartDate;
    this.closed = false;
    this.acknowledgementClosedDate = null;
    // sources
    this.isSafetyDocument = false;
  }

  createEndpointData(
    documentRef: string,
    description: string,
    quiz: number | null = null,
    acknowledgementStartDate: Date | null = null,
    ofSource: (keyof AcknowledgementTypes.IIs)[] | null = null
  ): FormData {
    const formData = new FormData();
    formData.append("id", JSON.stringify(this.id));
    formData.append("documentRef", JSON.stringify(documentRef));
    formData.append("description", JSON.stringify(description));
    formData.append("quiz", JSON.stringify(quiz));
    formData.append("acknowledgementStartDate", JSON.stringify(acknowledgementStartDate));
    formData.append("ofSource", JSON.stringify(ofSource));

    return formData;
  }
}
