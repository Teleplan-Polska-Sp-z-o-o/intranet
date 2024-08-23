import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, EntityManager } from "typeorm";
import { Helper } from "../../../models/common/Helper";
import { Utils } from "../../../controllers/common/Utils";
import { Subcategory } from "./SubcategoryEntity";
import { Category } from "./CategoryEntity";
import { Department } from "./DepartmentEntity";
import { DocumentTypes } from "../../../interfaces/document/DocumentTypes";

@Entity()
export class Competence implements DocumentTypes.ICompetence {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  position: string;

  @Column()
  name: string;

  @Column("text", { array: true })
  folderStructure: string[];

  @ManyToOne(() => Subcategory, (subcategory) => subcategory.competences)
  subcategory: Subcategory;

  @ManyToOne(() => Category, (category) => category.competences)
  category: Category;

  @ManyToOne(() => Department, (department) => department.competences)
  department: Department;

  @Column()
  postBy: string;
  @Column()
  postByDate: string;
  @Column()
  putBy: string | null;
  @Column()
  putByDate: string | null;

  constructor() {}

  public build(code: string, position: string, name: string, username: string): Competence {
    this.code = code;
    this.position = position;
    this.name = name;

    this.postBy = username;
    this.postByDate = Helper.formatDate(new Date(), "competence build");
    this.putBy = null;
    this.putByDate = null;

    return this;
  }

  async setFolderRelations(em: EntityManager, folderStructure?: string[]): Promise<this> {
    if (folderStructure) this.folderStructure = folderStructure;
    const [departmentName, categoryName, subcategoryName] = this.folderStructure;

    if (departmentName) {
      const department = await em.findOne(Department, { where: { name: departmentName } });
      this.department = department || null;
    }

    if (categoryName) {
      const category = await em.findOne(Category, { where: { name: categoryName } });
      this.category = category || null;
    }

    if (subcategoryName) {
      const subcategory = await em.findOne(Subcategory, { where: { name: subcategoryName } });
      this.subcategory = subcategory || null;
    }

    return this;
  }

  public put(code: string, position: string, name: string, username: string): Competence {
    this.code = code;
    this.position = position;
    this.name = name;
    const competence = new Utils().addRecordPutInfo<Competence>(username, this);

    return competence;
  }
}
