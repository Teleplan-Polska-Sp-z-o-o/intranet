import { SimpleUser } from "../../models/user/SimpleUser";
import { IUser } from "../user/UserTypes";
import moment from "moment";
import "moment-timezone";

interface IInfo {
  product: string;
  owner: { id: number; name: string } | string | null;
  _lastUpdate: Date | null;
  author: { id: number; name: string } | string | null;
  _created: Date;
  competences: { id: number; name: string }[] | string[]; // {id: number - id of db obj, name: string - code of db obj}
  esd: 0 | 1; // 0 - false, 1 - true
}

interface IBefore {
  title: string;
  documentTemplate: string;
  logosTemplate: string[];
  _id: string;
  _revision: string;
}

interface IDraftMeta {
  createdBy: SimpleUser;
  createdAt: string;
  update: {
    by: SimpleUser;
    at: string;
    of: string;
    old: string;
  }[];
}

interface ISegmentContent {
  _isSaved: boolean;
  _tmpTitle: string;
  _tmpBody: string;

  segmentUuid: string;
  title: string;
  body: string;
  bodyWithInlineStyles: string;
}

interface IBaseSegment {
  uuid: string;
  meta: IDraftMeta;
  content: ISegmentContent;
}

interface ISegmentRelationship {
  position: number;
  segmentIndex: string;
  draft: IDraft | null;
  parent: TSegment | null;
  subSegments: TSegment[];
}

export type TSegment = IBaseSegment & ISegmentRelationship;

export interface IDraft {
  uuid: string;
  segments: TSegment[];
  meta: IDraftMeta;
}

export interface IStep {
  name: string;
  editable: boolean;
  complete: boolean;
  color: string;
}
export type TStepKey = 1 | 2 | 3;
export interface IStepperHeader {
  steps: Record<TStepKey, IStep>;
  currentStep: TStepKey;
}

export enum EStepperStatus {
  DRAFT = 0,
  FOR_RELEASE = 1,
  RELEASED = 2,
  ARCHIVED = 3,
}

export interface IStatusHistory {
  id: number;
  status: EStepperStatus;
  changedAt: string;
  changedBy: IUser;
  comment: string;
}

export class StatusHistory implements IStatusHistory {
  id: number;
  status: EStepperStatus;
  changedAt: string;
  changedBy: IUser;
  comment: string;

  constructor(id: number, status: EStepperStatus, changedBy: IUser, comment: string) {
    this.id = id;
    this.status = status;
    this.changedAt = moment().utc().toISOString();
    this.changedBy = changedBy;
    this.comment = comment;
  }
}

export interface IInstructionStepper {
  readonly uuid: string;
  readonly tz: string;
  readonly _name: string;
  readonly type: string;
  _documentTitle: string;
  _documentIdRevision: string;
  _status: EStepperStatus;
  _statusHistory: IStatusHistory[];
  fileNames: string[];

  header: IStepperHeader;
  body: {
    windows: {
      1: { model: IInfo };
      2: { model: IBefore };
      3: { model: IDraft };
    };
  };
}

export type TStepper = IInstructionStepper;
