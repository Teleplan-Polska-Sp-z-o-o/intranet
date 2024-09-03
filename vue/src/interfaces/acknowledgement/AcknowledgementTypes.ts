import { DocumentEntity } from "../../models/document/DocumentEntity";
import { QuizModels } from "../../models/QuizModels";

export namespace AcknowledgementTypes {
  export interface IToAcknowledge {
    id: number;
    documents: DocumentEntity[];
    quiz: QuizModels.Quiz | null;
    acknowledgementStartDate: Date | null;
    description: string;
    closed: boolean;
    acknowledgementClosedDate: Date | null;

    createEndpointData(
      documentRef: string,
      description: string,
      quiz: number | null,
      acknowledgementStartDate: Date | null
    ): FormData;
  }

  export interface IIs {
    isSafetyDocument: boolean;
  }

  export type IToAcknowledgeEntity = IToAcknowledge & IIs;
}
