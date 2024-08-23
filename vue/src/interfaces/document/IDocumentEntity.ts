import { IUserEntity } from "../user/IUserEntity";
import { TConfidentiality } from "../user/UserTypes";
import { TDocumentType } from "./DocumentTypes";

interface IDocumentEntity {
  id: number;
  ref: string;
  type: TDocumentType;
  name: string;
  description: string;
  revision: number;
  folderStructure: Array<string | undefined>;
  competences: Array<string>;
  languages: Array<string>;
  confidentiality: TConfidentiality;
  postBy: string;
  postByDate: string;
  putBy: string | null;
  putByDate: string | null;
  quickAccess?: IUserEntity[];
  isQuickAccess?: boolean;
}

export type { IDocumentEntity };
