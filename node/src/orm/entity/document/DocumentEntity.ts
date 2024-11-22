import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  EntityManager,
  ManyToOne,
} from "typeorm";
import { Competence } from "./CompetenceEntity";
import { Language } from "./LanguageEntity";
import { TConfidentiality } from "../../../interfaces/user/UserTypes";
import { v4 as uuidv4 } from "uuid";
import * as fs from "fs";
import * as path from "path";
import { DOCUMENTS_FOLDER, UPLOADS_PATH } from "../../../config/routeConstants";
import { File } from "multer";
import { Subcategory } from "./SubcategoryEntity";
import { User } from "../user/UserEntity";
import { Category } from "./CategoryEntity";
import { Department } from "./DepartmentEntity";
// import { ToAcknowledge } from "./acknowledgement/ToAcknowledgeEntity";

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ref: string;

  @Column()
  type: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  revision: number;

  @ManyToOne(() => Subcategory, (subcategory) => subcategory.documents)
  subcategory: Subcategory;

  @ManyToOne(() => Category, (category) => category.documents)
  category: Category;

  @ManyToOne(() => Department, (department) => department.documents)
  department: Department;

  @Column("text", { array: true })
  folderStructure: string[];

  @ManyToMany(() => Competence, { nullable: true })
  @JoinTable({
    name: "document_competence",
    joinColumn: {
      name: "documentId",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "competenceId",
      referencedColumnName: "id",
    },
  })
  competences: Array<Competence>;

  @OneToMany(() => Language, (language) => language.document, { onDelete: "CASCADE" })
  languages: Array<Language>;

  @Column()
  confidentiality: TConfidentiality;

  @Column()
  postBy: string;
  @Column()
  postByDate: string;
  @Column()
  putBy: string | null;
  @Column()
  putByDate: string | null;

  @ManyToMany(() => User, (user) => user.quickAccessDocuments, { nullable: true })
  @JoinTable({
    name: "document_user",
    joinColumn: {
      name: "documentId",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "userId",
      referencedColumnName: "id",
    },
  })
  quickAccess: User[];

  // @ManyToMany(() => ToAcknowledge, (toAcknowledge) => toAcknowledge.documents)
  // toAcknowledges: ToAcknowledge[];

  isUUIDv4(value: string): boolean {
    const uuidv4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const testResult = uuidv4Regex.test(value);
    if (!testResult) {
      throw new Error(`Reference value is of invalid format.`);
    }
    return testResult;
  }

  constructor() {}

  build(
    // ref: string,
    type: string,
    name: string,
    description: string,
    revision: number,
    // folderStructure: string[],
    confidentiality: TConfidentiality = "public"
    // subcategory: Subcategory,
    // category: Category,
    // department: Department
  ): this {
    // this.ref = this.isUUIDv4(ref) ? ref : uuidv4();
    this.ref = uuidv4();
    this.type = type;
    this.name = name;
    this.description = description;
    this.revision = revision;
    // this.folderStructure = folderStructure;
    this.confidentiality = confidentiality;

    // this.subcategory = subcategory;
    // this.category = category;
    // this.department = department;

    this.postBy = "";
    this.postByDate = "";

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

  async isThereReferenceOfValue(reference: string, em: EntityManager): Promise<true> {
    this.isUUIDv4(reference);

    const document = await em.getRepository(Document).findOne({
      where: {
        ref: reference,
      },
    });

    if (document) throw new Error(`Some document already contains this reference.`);
    else return true;
  }

  async editDocument(
    // ref: string,
    type: string,
    name: string,
    description: string,
    revision: number,
    confidentiality: TConfidentiality = "public"
    // em: EntityManager
  ): Promise<Document> {
    // await this.isThereReferenceOfValue(ref, em);
    // this.ref = ref;
    this.type = type;
    this.name = name;
    this.description = description;
    this.revision = revision;
    this.confidentiality = confidentiality;
    return this;
  }

  async saveFiles(files: File[], files_langs: any, em: EntityManager) {
    for (const [index, file] of files.entries()) {
      const languageName = files_langs[index].langs.join("_");

      const savedLanguage = await em.getRepository(Language).save(new Language(languageName, this));

      const params = {
        langs: savedLanguage.name,
        uuid: this.ref,
      };

      const queryString = new URLSearchParams(params).toString();

      // Extract the original file extension
      let originalExtension = path.extname(file.originalname).toLowerCase();

      // Construct new file name
      const newFileName = `${this.name}_qs_${queryString}${originalExtension}`;

      // Rename and move file to destination folder
      fs.renameSync(file.path, path.join(UPLOADS_PATH, DOCUMENTS_FOLDER, newFileName));
    }
  }

  removeFiles(): this {
    const directory = path.join(UPLOADS_PATH, DOCUMENTS_FOLDER);
    const files = fs.readdirSync(directory);
    const filesToDelete = files.filter((file) => file.includes(this.ref));

    filesToDelete.forEach((file) => {
      const filePath = path.join(directory, file);
      fs.unlinkSync(filePath);
    });

    return this;
  }

  static confidentialRestriction(confidentiality: TConfidentiality): string[] {
    switch (confidentiality) {
      case "restricted":
        return ["secret"];
      case "secret":
        return [];

      default:
        return ["restricted", "secret"];
    }
  }
}
