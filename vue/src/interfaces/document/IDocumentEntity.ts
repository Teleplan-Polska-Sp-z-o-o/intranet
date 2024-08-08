import { TConfidentiality } from "../user/UserTypes";

interface IDocumentEntity {
  id: number;
  ref: string;
  type: string;
  name: string;
  description: string;
  revision: number;
  folderStructure: string[];
  competences: Array<string>;
  languages: Array<string>;
  confidentiality: TConfidentiality;
  postBy: string;
  postByDate: string;
  putBy: string | null;
  putByDate: string | null;
}

export type { IDocumentEntity };
