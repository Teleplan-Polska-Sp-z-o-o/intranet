import { CommonTypes } from "../../../../../interfaces/common/CommonTypes";

export namespace XLSXTypes {
  export type Sheet = (string | number | null)[][];
  export type Sheets = Record<string, Sheet>;
}

export namespace AnalyticFileTypes {
  // export type AnalyticProg = "sky" | "lenovo";
  // export type AnalyticCat = "packing" | "cosmetic" | "ooba" | "repair";
  // export type AnalyticSub = "drive";

  export interface IAnalyticFileFrontendFields {
    id: number;
    progName: string;
    catName: string;
    subName: string;
    fileType: string; // unique within subTabName
    normalizedFileName: string;
  }

  export interface IAnalyticFileBackendGenerated {
    ref: string;
    fileDir: string;
    fileName: string;
    excelObjectJson: string;
    jsObjectJson: string;
    archive: {
      fileName: string;
      normalizedFileName: string;
      fileDir: string;
      fileVersion: number;
      excelObjectJson: string;
      jsObjectJson: string;
    } | null;
    fileVersion: number;

    // extended orm
    createdBy: CommonTypes.Api.OrmTypes.IOrmUserAction;
    updatedBy: CommonTypes.Api.OrmTypes.IOrmUserAction[];
    // base orm
    ormCreateDate: Date;
    ormUpdateDate: Date | null;
    ormVersion: number;
  }

  export interface IAnalyticFileConsidered {
    considered: boolean;
  }

  export type PreFormData = { fields: IAnalyticFileFrontendFields; file: Blob };

  export type IAnalyticFileEntity = IAnalyticFileFrontendFields &
    IAnalyticFileBackendGenerated &
    IAnalyticFileConsidered;
}
