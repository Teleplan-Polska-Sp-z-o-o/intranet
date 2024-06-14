import { ICompetence } from "../../interfaces/document/ICompetence";

class Competence implements ICompetence {
  id: number;
  name: string;

  constructor(id: number = 0, name: string = "") {
    this.id = id;
    this.name = name;
  }
}

export { Competence };
