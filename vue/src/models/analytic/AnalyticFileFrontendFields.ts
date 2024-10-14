import { AnalyticFileTypes } from "../../components/views/tools/analytic/files/Types";

export class AnalyticFileFrontendFields implements AnalyticFileTypes.IAnalyticFileFrontendFields {
  id: number;
  progName: string;
  catName: string;
  subName: string;
  fileType: string;
  normalizedFileName: string;

  constructor() {
    this.id = 0;
    this.progName = "";
    this.catName = "";
    this.subName = "";
    this.fileType = "";
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
