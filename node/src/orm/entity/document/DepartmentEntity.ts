import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Category } from "./CategoryEntity";

@Entity()
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Category, (category) => category.department, { nullable: true })
  categories: Array<Category>;

  constructor(name: string) {
    this.name = name;
  }
}
