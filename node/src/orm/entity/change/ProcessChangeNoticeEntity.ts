import { Entity, PrimaryGeneratedColumn } from "typeorm";
import { IProcessChangeNotice } from "../../../interfaces/change/IProcessChangeNotice";

@Entity()
class ProcessChangeNotice implements IProcessChangeNotice {
  @PrimaryGeneratedColumn()
  id: number;
}

export { ProcessChangeNotice };
