import { IDocumentEntity } from "../../interfaces/document/IDocumentEntity";
import { TConfidentiality } from "../../interfaces/user/TConfidentiality";

export class DocumentEntity implements IDocumentEntity {
  id: number;
  ref: string;
  type: string;
  name: string;
  description: string;
  revision: number;
  subcategory: { name: string; id: number };
  competence: string | null;
  languages: string[];
  confidentiality: TConfidentiality;

  constructor() {
    this.id = 0;
    this.ref = "";
    this.type = "";
    this.name = "";
    this.description = "";
    this.revision = 0;
    this.subcategory = { name: "", id: 0 };
    this.competence = null;
    this.languages = [];
    this.confidentiality = "public";
  }
}
