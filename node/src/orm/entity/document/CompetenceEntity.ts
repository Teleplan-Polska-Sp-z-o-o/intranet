import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { Document } from "./DocumentEntity";

@Entity()
export class Competence {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Document, (document) => document.competence, { nullable: true })
  documents: Array<Document>;
}
