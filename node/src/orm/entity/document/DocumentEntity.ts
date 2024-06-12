import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Competence } from "./CompetenceEntity";
import { Subcategory } from "./SubcategoryEntity";
import { Language } from "./LanguageEntity";
import { TConfidentiality } from "../../../interfaces/user/TConfidentiality";

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

  @ManyToOne(() => Competence, (competence) => competence.documents, { nullable: true })
  competence: Competence;

  @OneToMany(() => Language, (language) => language.document, { onDelete: "CASCADE" })
  languages: Array<Language>;

  @Column()
  confidentiality: TConfidentiality;

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
  }
}
