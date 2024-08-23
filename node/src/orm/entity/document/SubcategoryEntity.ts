import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { Category } from "./CategoryEntity";
import { Document } from "./DocumentEntity";
import { Competence } from "./CompetenceEntity";

@Entity()
export class Subcategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Category, (category) => category.subcategories)
  category: Category;

  @OneToMany(() => Document, (document) => document.subcategory, { nullable: true })
  documents: Array<Document>;

  @OneToMany(() => Competence, (competence) => competence.subcategory)
  competences: Competence[];

  constructor(name: string, category: Category) {
    this.name = name;
    this.category = category;
  }
}
