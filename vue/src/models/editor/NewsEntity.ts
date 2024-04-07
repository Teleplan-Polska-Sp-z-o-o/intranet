import { INewsEntity } from "../../interfaces/editor/INewsEntity";
import { IPermission } from "../../interfaces/user/IPermission";
import { Permission } from "../user/Permission";

class NewsEntity implements INewsEntity {
  id: number;
  ref: string;
  permission: IPermission;
  title: string;
  subtitle: string;
  content: string;
  bgImage: string;

  constructor() {
    this.id = 0;
    this.ref = "";
    this.permission = new Permission();
    this.title = "";
    this.subtitle = "";
    this.content = `<div class="ck-override-vuetify-styles"></div><div class="ck ck-content"></div>`;
    this.bgImage = "";
  }
}

export { NewsEntity };
