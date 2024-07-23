import { DocumentChangeTypes } from "../../../interfaces/change/dcr/DocumentChangeTypes";

class Assessment implements DocumentChangeTypes.Processing.IAssessment {
  id: number;
  issuer: string;
  decision: boolean;
  comment?: string | undefined;

  constructor(id: number, issuer: string, decision: boolean, comment?: string) {
    this.id = id;
    this.issuer = issuer;
    this.decision = decision;
    this.comment = comment;
  }
}

export { Assessment };
