import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  EntityManager,
} from "typeorm";
import { Competence } from "./CompetenceEntity";
import { Subcategory } from "./SubcategoryEntity";
import { Language } from "./LanguageEntity";
import { TConfidentiality } from "../../../interfaces/user/UserTypes";
import { v4 as uuidv4 } from "uuid";

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
    subcategory: Subcategory,
    confidentiality: TConfidentiality = "public"
  ): this {
    // this.ref = this.isUUIDv4(ref) ? ref : uuidv4();
    this.ref = uuidv4();
    this.type = type;
    this.name = name;
    this.description = description;
    this.revision = revision;
    this.subcategory = subcategory;
    this.confidentiality = confidentiality;

    this.postBy = "";
    this.postByDate = "";

    this.putBy = null;
    this.putByDate = null;

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
}
