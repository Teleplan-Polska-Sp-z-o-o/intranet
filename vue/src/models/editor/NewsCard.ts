import { INewsCard } from "../../interfaces/editor/INewsCard";
import { INewsEntity } from "../../interfaces/editor/INewsEntity";
import { TConfidentiality } from "../../interfaces/user/UserTypes";

class NewsCard implements INewsCard, INewsEntity {
  id: number;
  ref: string;
  confidentiality: TConfidentiality;
  title: string;
  subtitle: string;
  content: string;
  bgImage: string;

  show: boolean;

  constructor(news: INewsEntity) {
    this.id = news.id;
    this.ref = news.ref;
    this.confidentiality = news.confidentiality;
    this.title = news.title;
    this.subtitle = news.subtitle;
    this.content = news.content;
    this.bgImage = news.bgImage;
    this.show = false;
  }
}

export { NewsCard };
