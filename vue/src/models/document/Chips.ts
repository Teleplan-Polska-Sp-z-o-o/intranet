import { IChips } from "../../interfaces/document/IChips";

class Chips implements IChips {
  departmentName: string;
  categoryName: string;
  subcategoryName: string;

  constructor(department: string = "", category: string = "", subcategory: string = "") {
    this.departmentName = department;
    this.categoryName = category;
    this.subcategoryName = subcategory;
  }
}

export { Chips };
