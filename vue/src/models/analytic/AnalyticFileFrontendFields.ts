import { AnalyticTypes } from "../../components/views/tools/analytic/files/Types";

export class AnalyticFileFrontendFields implements AnalyticTypes.IAnalyticFileFrontendFields {
  id: number;
  progName: AnalyticTypes.AnalyticProg;
  catName: AnalyticTypes.AnalyticCat;
  subName: AnalyticTypes.AnalyticSub;
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

  build(form: AnalyticTypes.IAnalyticFileFrontendFields): this {
    this.id = form.id;
    this.progName = form.progName;
    this.catName = form.catName;
    this.subName = form.subName;
    this.fileType = form.fileType;
    this.normalizedFileName = form.normalizedFileName;

    return this;
  }
}
