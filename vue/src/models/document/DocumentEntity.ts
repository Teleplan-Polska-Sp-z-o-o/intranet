import { TDocumentType } from "../../interfaces/document/DocumentTypes";
import { IDocumentEntity } from "../../interfaces/document/IDocumentEntity";
import { TConfidentiality } from "../../interfaces/user/UserTypes";

export class DocumentEntity implements IDocumentEntity {
  id: number;
  ref: string;
  type: TDocumentType;
  name: string;
  description: string;
  revision: number;
  // subcategory: { name: string; id: number };
  folderStructure: Array<string | undefined>;
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
    this.type = "Instruction";
    this.name = "";
    this.description = "";
    this.revision = 0;
    this.folderStructure = [];
    this.competences = [];
    this.languages = [];
    this.confidentiality = "public";
    this.postBy = "";
    this.postByDate = "";
    this.putBy = null;
    this.putByDate = null;
    this.approved = false;
  }

  static translateLanguages(item: IDocumentEntity) {
    enum LangDictionary {
      en = "English",
      pl = "Polish",
      ua = "Ukrainian",
    }

    // Type alias mimicking the enum with string-based access
    type LangDictionaryStringMap = {
      [key: string]: LangDictionary[keyof LangDictionary];
    };

    return item.languages.map((lang: string) => ({
      title: lang
        .split("_")
        .map((code: string) => (LangDictionary as LangDictionaryStringMap)[code])
        .join(", "),
      value: [item.name, lang, item.ref],
    }));
  }
}
