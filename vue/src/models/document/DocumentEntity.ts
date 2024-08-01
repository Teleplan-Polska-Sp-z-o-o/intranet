import { IDocumentEntity } from "../../interfaces/document/IDocumentEntity";
import { TConfidentiality } from "../../interfaces/user/UserTypes";

export class DocumentEntity implements IDocumentEntity {
  id: number;
  ref: string;
  type: string;
  name: string;
  description: string;
  revision: number;
  subcategory: { name: string; id: number };
  competences: string[];
  languages: string[];
  confidentiality: TConfidentiality;
  postBy: string;
  postByDate: string;
  putBy: string | null;
  putByDate: string | null;
  approved: boolean;

  constructor() {
    this.id = 0;
    this.ref = "";
    this.type = "";
    this.name = "";
    this.description = "";
    this.revision = 0;
    this.subcategory = { name: "", id: 0 };
    this.competences = [];
    this.languages = [];
    this.confidentiality = "public";
    this.postBy = "";
    this.postByDate = "";
    this.putBy = null;
    this.putByDate = null;
    this.approved = false;
  }
}
