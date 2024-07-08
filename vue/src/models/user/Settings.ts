import { ISettings } from "../../interfaces/user/UserTypes";

class Settings implements ISettings {
  id: number | null;
  theme: string;
  language: "pl" | "en" | "ua";

  constructor(settings: ISettings) {
    this.id = settings.id;
    this.theme = settings.theme;
    this.language = settings.language;
  }
}

export { Settings };
