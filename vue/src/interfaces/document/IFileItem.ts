interface IFileItem {
  id: number;
  file: Array<File> | undefined;
  langs: Array<string> | undefined;
}

export type { IFileItem };
