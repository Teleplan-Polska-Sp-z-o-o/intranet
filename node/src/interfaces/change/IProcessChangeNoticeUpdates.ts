import { ProcessChangeNotice } from "../../orm/entity/change/ProcessChangeNoticeEntity";

interface IProcessChangeNoticeUpdates {
  id: number;
  processChangeNotice: ProcessChangeNotice;
  updateBy: string;
  updateDate: string;
  updateFields: string;
  updateDescription: string;
}

export type { IProcessChangeNoticeUpdates };
