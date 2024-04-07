import { IChip } from "../../interfaces/document/IChip";

class Chip implements IChip {
  id: number;
  name: string;

  constructor(id: number = 0, name: string = "") {
    this.id = id;
    this.name = name;
  }
}

export { Chip };
