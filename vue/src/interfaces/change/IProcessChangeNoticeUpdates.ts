import { IProcessChangeNotice } from "./IProcessChangeNotice";

interface IProcessChangeNoticeUpdates {
  id: number;
  processChangeNotice: IProcessChangeNotice;
  updateBy: string;
  updateDate: string;
  updateFields: string;
  updateDescription: string;
}

export type { IProcessChangeNoticeUpdates };
