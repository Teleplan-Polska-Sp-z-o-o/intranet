import { Subcategory } from "../../orm/entity/document/SubcategoryEntity";

interface IDocument {
  name: string;
  description: string;
  revision: number;
  subcategory: Subcategory;
}

export type { IDocument };
