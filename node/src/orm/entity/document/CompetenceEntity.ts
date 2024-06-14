import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { Document } from "./DocumentEntity";
import { Helper } from "../../../models/common/Helper";

@Entity()
export class Competence {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  postBy: string;
  @Column()
  postByDate: string;
  @Column()
  putBy: string | null;
  @Column()
  putByDate: string | null;

  @OneToMany(() => Document, (document) => document.competence, { nullable: true })
  documents: Array<Document>;

  constructor() {}

  public build = (name: string, username: string): Competence => {
    this.name = name;
    this.postBy = username;
    this.postByDate = Helper.formatDate(new Date(), "competence build");

    this.putBy = null;
    this.putByDate = null;

    return this;
  };

  public put = (name: string, username: string): Competence => {
    this.name = name;
    this.putBy = username;
    this.putByDate = Helper.formatDate(new Date(), "competence put");

    return this;
  };
}
