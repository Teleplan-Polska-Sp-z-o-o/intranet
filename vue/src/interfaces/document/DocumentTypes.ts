enum EDocumentType {
  Instruction = "Instruction",
  Visual = "Visual",
  MSD = "MSD",
}
type TDocumentType = "Instruction" | "Visual" | "MSD";

interface IChip {
  id: number;
  name: string;
}

interface IChips {
  departmentName: string | undefined;
  categoryName: string | undefined;
  subcategoryName: string | undefined;
}

interface IFileItem {
  id: number;
  file: Array<File> | undefined;
  langs: Array<string> | undefined;
}

enum ILevel {
  Dep,
  Cat,
  Sub,
}

interface ICompetence {
  id: number;
  name: string;
}

namespace DocumentTypes {
  export interface ICompetenceBase {
    code: string;
    position: string;
    name: string;
  }
  interface ICompetence {
    id: number;
    folderStructure: string[];
    subcategory: object | null;
    category: object | null; // Nullable if not always assigned
    department: object | null; // Nullable if not always assigned
    postBy: string;
    postByDate: string;
    putBy: string | null;
    putByDate: string | null;
  }

  export type ICompetenceEntity = ICompetence & ICompetenceBase;
}

export {
  type DocumentTypes,
  EDocumentType,
  type TDocumentType,
  type IChip,
  type IChips,
  type IFileItem,
  ILevel,
  type ICompetence,
};
