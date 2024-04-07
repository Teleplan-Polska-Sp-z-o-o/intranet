import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Document } from "./DocumentEntity";

@Entity()
export class Language {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Document)
  document: Document;

  constructor(name: string, document: Document) {
    this.name = name;
    this.document = document;
  }
}
