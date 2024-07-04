import { INewsCard } from "../../interfaces/editor/INewsCard";
import { INewsEntity } from "../../interfaces/editor/INewsEntity";
import { IPermission } from "../../interfaces/user/UserTypes";

class NewsCard implements INewsCard {
  id: number;
  ref: string;
  permission: IPermission;
  title: string;
  subtitle: string;
  content: string;
  bgImage: string;

  show: boolean;

  constructor(news: INewsEntity) {
    this.id = news.id;
    this.ref = news.ref;
    this.permission = news.permission;
    this.title = news.title;
    this.subtitle = news.subtitle;
    this.content = news.content;
    this.bgImage = news.bgImage;
    this.show = false;
  }
}

export { NewsCard };
