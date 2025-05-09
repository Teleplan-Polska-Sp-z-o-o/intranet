import { DocumentCreatorStepper } from "../../../components/views/tools/matrix/document/creator/tabs/new/StepperTypes";
import { IUser } from "../../user/UserTypes";

interface IOrmUserAction {
  user: IUser;
  date: Date;
}

export interface IDraftEntity {
  id: number;
  uuid: string;
  name: string;
  stepper: DocumentCreatorStepper.IStepper;
  ormCreateDate: string;
  createdBy: IOrmUserAction;
  ormUpdateDate: string;
  updatedBy: IOrmUserAction[];
}
