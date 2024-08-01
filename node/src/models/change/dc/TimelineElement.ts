import {
  ITimelineElement,
  TStatus,
} from "../../../interfaces/change/document/request/DocumentChangeTypes";

class TimelineElement implements ITimelineElement {
  id: number;
  status: TStatus;
  issuer: string;
  date: Date;
  comment: string | null | undefined;

  constructor(id: number, status: TStatus, issuer: string, comment: string | null | undefined) {
    this.id = id;
    this.status = status;
    this.issuer = issuer;
    this.date = new Date();
    this.comment = comment;
  }
}

export { TimelineElement };
