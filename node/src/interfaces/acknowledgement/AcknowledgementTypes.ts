import { Quiz } from "../../orm/entity/document/acknowledgement/QuizEntity";
import { Document } from "../../orm/entity/document/DocumentEntity";

export namespace AcknowledgementTypes {
  export interface IToAcknowledge {
    id: number;
    documents: Document[];
    quiz: Quiz | null;
    acknowledgementStartDate: Date | null;
    description: string;
    closed: boolean;
    acknowledgementClosedDate: Date | null;
  }
  export interface IIs {
    isSafetyDocument: boolean;
  }

  export type IToAcknowledgeEntity = IToAcknowledge & IIs;
}
