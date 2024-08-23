import { DocumentTypes } from "../../interfaces/document/DocumentTypes";

class Competence implements DocumentTypes.ICompetenceEntity {
  id: number;
  code: string;
  position: string;
  name: string;
  folderStructure: string[];
  subcategory: object | null;
  category: object | null;
  department: object | null;
  postBy: string;
  postByDate: string;
  putBy: string | null;
  putByDate: string | null;

  constructor(base?: DocumentTypes.ICompetenceBase) {
    this.id = 0;

    this.code = base?.code ?? "";
    this.position = base?.position ?? "";
    this.name = base?.name ?? "";

    this.folderStructure = [];

    this.subcategory = null;
    this.category = null;
    this.department = null;

    this.postBy = "string";
    this.postByDate = "string";
    this.putBy = null;
    this.putByDate = null;
  }
}

export { Competence };
