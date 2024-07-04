import { ISettings } from "../../interfaces/user/UserTypes";

class Settings implements ISettings {
  id: number | null;
  theme: string;
  language: string;

  constructor(settings: ISettings | null = null) {
    this.id = settings?.id ?? null;
    this.theme = settings?.theme ?? "light";
    this.language = settings?.language ?? "en";
  }
}

export { Settings };
