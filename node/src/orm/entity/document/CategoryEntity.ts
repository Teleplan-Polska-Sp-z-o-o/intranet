import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { Subcategory } from "./SubcategoryEntity";
import { Department } from "./DepartmentEntity";
import { Document } from "./DocumentEntity";
import { Competence } from "./CompetenceEntity";

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Department, (department) => department.categories)
  department: Department;

  @OneToMany(() => Subcategory, (subcategory) => subcategory.category, { nullable: true })
  subcategories: Subcategory[];

  @OneToMany(() => Document, (document) => document.category)
  documents: Document[];

  @OneToMany(() => Competence, (competence) => competence.category)
  competences: Competence[];

  constructor(name: string, department: Department) {
    this.name = name;
    this.department = department;
  }
}
