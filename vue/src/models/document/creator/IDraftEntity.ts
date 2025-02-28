import { DocumentCreatorStepper } from "../../../components/views/tools/matrix/document/creator/tabs/new/StepperTypes";
import { IUser } from "../../../interfaces/user/UserTypes";

interface IOrmUserAction {
  user: IUser;
  date: Date;
}

export interface IDraftEntity {
  id: number;
  uuid: string;
  name: string;
  stepper: DocumentCreatorStepper.IStepper;
  createdBy: IOrmUserAction;
  updatedBy: IOrmUserAction[];
}
