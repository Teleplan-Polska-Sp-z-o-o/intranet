type TDocumentType = "Instruction" | "Visual" | "MSD";

interface IChip {
  id: number;
  name: string;
}

interface IChips {
  departmentName: string;
  categoryName: string;
  subcategoryName: string;
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

export { type TDocumentType, type IChip, type IChips, type IFileItem, ILevel, type ICompetence };
