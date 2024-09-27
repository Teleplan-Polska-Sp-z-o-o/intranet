import { AnalyticFileTypes } from "../../components/views/tools/analytic/files/Types";

export class AnalyticFileFrontendFields implements AnalyticFileTypes.IAnalyticFileFrontendFields {
  id: number;
  progName: AnalyticFileTypes.AnalyticProg;
  catName: AnalyticFileTypes.AnalyticCat;
  subName: AnalyticFileTypes.AnalyticSub;
  fileType: string;
  normalizedFileName: string;

  constructor() {
    this.id = 0;
    this.progName = "sky";
    this.catName = "packing";
    this.subName = "drive";
    this.fileType = "models";
    this.normalizedFileName = "";
  }

  build(form: AnalyticFileTypes.IAnalyticFileFrontendFields): this {
    this.id = form.id;
    this.progName = form.progName;
    this.catName = form.catName;
    this.subName = form.subName;
    this.fileType = form.fileType;
    this.normalizedFileName = form.normalizedFileName;

    return this;
  }
}
