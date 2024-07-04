import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { ISettings } from "../../../interfaces/user/UserTypes";

@Entity()
export class UserSettings {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  theme: string;
  @Column()
  language: string;

  constructor(settings: ISettings | null = null) {
    this.theme = settings?.theme ?? "light";
    this.language = settings?.language ?? "en";
  }
}
