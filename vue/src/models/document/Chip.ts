import { IChip } from "../../interfaces/document/DocumentTypes";

class Chip implements IChip {
  id: number;
  name: string;

  constructor(id: number = 0, name: string = "") {
    this.id = id;
    this.name = name;
  }

  getName(): string {
    return this.name;
  }
}

export { Chip };
