export namespace AnalyticTypes {
  export interface IAnalyticFile {
    id: number;
    ref: string;
    progName: string;
    catName: string;
    subName: string;
    fileType: string; // unique within subTabName
    fileName: string;
    normalizedFileName: string;
    fileDir: string;
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
    //   createdBy: IOrmUserAction;
    //   updatedBy: IOrmUserAction[] | null;
    // base orm
    //   ormCreateDate: Date;
    //   ormUpdateDate: Date | null;
    //   ormVersion: number;
  }
}
