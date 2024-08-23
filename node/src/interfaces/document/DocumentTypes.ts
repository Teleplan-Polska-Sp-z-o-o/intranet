import { Category } from "../../orm/entity/document/CategoryEntity";
import { Department } from "../../orm/entity/document/DepartmentEntity";
import { Subcategory } from "../../orm/entity/document/SubcategoryEntity";

namespace DocumentTypes {
  export type IFolderStructure = string[];

  export interface ICompetence {
    id: number;
    code: string;
    position: string;
    name: string;
    folderStructure: string[];
    subcategory: Subcategory | null; // Nullable if not always assigned
    category: Category | null; // Nullable if not always assigned
    department: Department | null; // Nullable if not always assigned
    postBy: string;
    postByDate: string;
    putBy: string | null;
    putByDate: string | null;
  }
}

export { DocumentTypes };
