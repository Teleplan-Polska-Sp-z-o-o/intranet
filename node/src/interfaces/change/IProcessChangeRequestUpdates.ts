import { ProcessChangeRequest } from "../../orm/entity/change/ProcessChangeRequestEntity";

interface IProcessChangeRequestUpdates {
  id: number;
  processChangeRequest: ProcessChangeRequest;
  updateBy: string;
  updateDate: string;
  updateFields: string;
  updateDescription: string;
}

export type { IProcessChangeRequestUpdates };
