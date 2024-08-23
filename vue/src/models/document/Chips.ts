import { IChips } from "../../interfaces/document/DocumentTypes";

class Chips implements IChips {
  departmentName: string | undefined;
  categoryName: string | undefined;
  subcategoryName: string | undefined;

  constructor(
    department: string | undefined = undefined,
    category: string | undefined = undefined,
    subcategory: string | undefined = undefined
  ) {
    this.departmentName = department;
    this.categoryName = category;
    this.subcategoryName = subcategory;
  }
}

export { Chips };
