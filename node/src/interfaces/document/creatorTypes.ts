import { SimpleUser } from "../../models/user/SimpleUser";

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
  id: string;
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

export interface IStepperReadOnly {
  readonly uuid: string;
  readonly tz: string;
  readonly _name: string;
  body: {
    windows: {
      1: { model: IInfo };
      2: { model: IBefore };
      3: { model: IDraft };
    };
    footerText: string;
  };
}

export type TStepper = IStepperReadOnly;
