import { IFileItem } from "../../interfaces/document/DocumentTypes";

class FileItem implements IFileItem {
  id: number;
  file: Array<File> | undefined;
  langs: Array<string> | undefined;

  constructor(
    id: number = 0,
    file: Array<File> | undefined = undefined,
    langs: Array<string> | undefined = undefined
  ) {
    this.id = id;
    this.file = file;
    this.langs = langs;
  }
}

export { FileItem };
