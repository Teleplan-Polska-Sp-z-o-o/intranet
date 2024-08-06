import { Ref, WritableComputedRef } from "vue";
import { useI18n } from "vue-i18n";
import { Endpoints } from "../../../config/axios/Endpoints";
import { ISettings } from "../../../interfaces/user/UserTypes";
import { Settings } from "../../../models/user/Settings";
import { useSettingsStore } from "../../../stores/settingsStore";
import { useAlertStore } from "../../../stores/alertStore";
import { ResponseStatus } from "../../../models/common/ResponseStatus";
import jwtAxios from "../../../config/axios/jwtAxios";
import { CommonTypes } from "../../../interfaces/common/CommonTypes";

class LanguageManager {
  private settings: ISettings = useSettingsStore().info();
  private static locale: Ref<CommonTypes.LanguageTypes.Language>;

  /**
   *
   * @param outsideLocale useI18n().locale
   */
  constructor(outsideLocale?: WritableComputedRef<string>) {
    LanguageManager.locale =
      (outsideLocale as Ref<CommonTypes.LanguageTypes.Language>) ??
      (useI18n().locale as unknown as Ref<CommonTypes.LanguageTypes.Language>);
  }

  get language() {
    return LanguageManager.locale.value;
  }

  set language(lang: CommonTypes.LanguageTypes.Language) {
    LanguageManager.locale.value = lang;
  }

  public async updateLanguageSettings(log: boolean = false) {
    try {
      this.settings.language = LanguageManager.locale.value;
      useSettingsStore().set(this.settings);

      const reqData: Partial<ISettings> = new Settings(this.settings);

      const response = await jwtAxios.put(Endpoints.UserSettingsLanguage, reqData);
      if (log)
        useAlertStore().process(
          new ResponseStatus({
            code: response.status,
            message: response.data.statusMessage,
          })
        );
    } catch (error) {
      console.log(`updateLanguageSettings at Language Manager, ${error}`);
    }
  }
}

export default LanguageManager;
