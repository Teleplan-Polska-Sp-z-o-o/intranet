import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { Subcategory } from "./SubcategoryEntity";
import { Department } from "./DepartmentEntity";

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Department, (department) => department.categories)
  department: Department;

  @OneToMany(() => Subcategory, (subcategory) => subcategory.category, { nullable: true })
  subcategories: Array<Subcategory>;

  constructor(name: string, department: Department) {
    this.name = name;
    this.department = department;
  }
}
