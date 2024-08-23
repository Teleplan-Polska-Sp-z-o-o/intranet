import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Category } from "./CategoryEntity";
import { Document } from "./DocumentEntity";
import { Competence } from "./CompetenceEntity";

@Entity()
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Category, (category) => category.department, { nullable: true })
  categories: Category[];

  @OneToMany(() => Document, (document) => document.department)
  documents: Document[];

  @OneToMany(() => Competence, (competence) => competence.department)
  competences: Competence[];

  constructor(name: string) {
    this.name = name;
  }
}
