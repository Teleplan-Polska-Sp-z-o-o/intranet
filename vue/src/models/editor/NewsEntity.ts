import { INewsEntity } from "../../interfaces/editor/INewsEntity";
import { TConfidentiality } from "../../interfaces/user/UserTypes";

class NewsEntity implements INewsEntity {
  id: number;
  ref: string;
  confidentiality: TConfidentiality;
  title: string;
  subtitle: string;
  content: string;
  bgImage: string;

  constructor() {
    this.id = 0;
    this.ref = "";
    this.confidentiality = "public";
    this.title = "";
    this.subtitle = "";
    this.content = `<div class="ck-override-vuetify-styles"></div><div class="ck ck-content"></div>`;
    this.bgImage = "";
  }
}

export { NewsEntity };
