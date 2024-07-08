import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Competence } from "./CompetenceEntity";
import { Subcategory } from "./SubcategoryEntity";
import { Language } from "./LanguageEntity";
import { TConfidentiality } from "../../../interfaces/user/UserTypes";

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

  // @ManyToOne(() => Competence, (competence) => competence.documents, { nullable: true })
  // competence: Competence;
  // @ManyToMany(() => Competence)
  // @JoinTable({
  //   name: "document_competence",
  // })
  // competences: Array<Competence>;
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

  constructor(
    ref: string,
    type: string,
    name: string,
    description: string,
    revision: number,
    subcategory: Subcategory,
    confidentiality: TConfidentiality = "public"
  ) {
    this.ref = ref;
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
  }

  // public editDocument = (
  //   name: string,
  //   description: string,
  //   revision: number,
  //   confidentiality: TConfidentiality = "public",
  //   username: string
  // ): Document => {
  //   this.name = name;
  //   this.description = description;
  //   this.revision = revision;
  //   this.confidentiality = confidentiality;

  //   this.putBy = username;
  //   this.putByDate = Helper.formatDate(new Date(), "document put");

  //   return this;
  // };
}
