import { reconextLogoBase64 } from "./ImageTemplates";

export interface ITemplate {
  id: number;
  name: string;
  images: string[]; // Array of Base64 image strings
}

export class Template implements ITemplate {
  id: number;
  name: string;
  images: string[];

  constructor(object: ITemplate) {
    this.id = object.id;
    this.name = object.name;
    this.images = object.images;
  }
}

export class CustomTemplate implements ITemplate {
  id: number = 6;
  name: string = "Custom";
  images: string[] = [reconextLogoBase64];

  constructor(images?: string[]) {
    if (Array.isArray(images) && images.length > 0) this.images = images;
  }
}
