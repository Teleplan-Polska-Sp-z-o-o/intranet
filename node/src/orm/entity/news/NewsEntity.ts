import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { INews } from "../../../interfaces/news/INews";

@Entity()
export class News implements INews {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ref: string;

  @Column()
  confidentiality: string;

  @Column()
  title: string;

  @Column()
  subtitle: string;

  @Column()
  content: string;

  @Column()
  bgImage: string;

  constructor(
    ref: string = "",
    confidentiality: string = "",
    title: string = "",
    subtitle: string = "",
    content: string = "",
    bgImage: string = ""
  ) {
    this.ref = ref;
    this.confidentiality = confidentiality;
    this.title = title;
    this.subtitle = subtitle;
    this.content = content;
    this.bgImage = bgImage;
  }

  editColumns = (obj: INews) => {
    this.ref = obj.ref;
    this.confidentiality = obj.confidentiality;
    this.title = obj.title;
    this.subtitle = obj.subtitle;
    this.content = obj.content;
    this.bgImage = obj.bgImage;
  };
}
