import { IProcessChangeRequest } from "./IProcessChangeRequest";

interface IProcessChangeRequestUpdates {
  id: number;
  processChangeRequest: IProcessChangeRequest;
  updateBy: string;
  updateDate: string;
  updateFields: string;
  updateDescription: string;
}

export type { IProcessChangeRequestUpdates };
