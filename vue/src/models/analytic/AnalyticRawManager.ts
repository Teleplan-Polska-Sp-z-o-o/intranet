// import { AnalyticRaw } from "../../components/views/tools/analytic/sky/transactions/Types";
import { Endpoints } from "../../config/axios/Endpoints";
import jwtAxios from "../../config/axios/jwtAxios";
import { nodeConfig } from "../../config/env";
import { useAlertStore } from "../../stores/alertStore";
import { ResponseStatus } from "../common/ResponseStatus";

class AnalyticRawManager<T> {
  program: string;
  group: string;

  constructor(program: string, group: string) {
    this.program = program;
    this.group = group;
  }

  // public createFormData = (preFormData: AnalyticRaw.IPreFormData) => {
  //   const formData = new FormData();
  //   formData.append("contracts", JSON.stringify(preFormData.contracts));
  //   formData.append("startOfDay", JSON.stringify(preFormData.startOfDay));
  //   formData.append("endOfDay", JSON.stringify(preFormData.endOfDay));
  //   return formData;
  // };

  public createFormData = (preFormData: Record<string, any>) => {
    const formData = new FormData();

    Object.keys(preFormData).forEach((key) => {
      formData.append(key, JSON.stringify(preFormData[key]));
    });

    return formData;
  };

  /**
   *
   * Returns transactions for "today" (between 6 AM of the current day and 6 AM of the next day)
   *
   * @param formData
   * @param status
   * @returns
   */
  public get = async (
    formData: FormData,
    signal?: AbortSignal,
    status: boolean = false
  ): Promise<T> => {
    const response = await jwtAxios.post(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Analytic}/raw/${this.program}/${this.group}`,
      formData,
      {
        signal,
      }
    );
    if (status) {
      useAlertStore().process(
        new ResponseStatus({
          code: response.status,
          message: response.data.statusMessage,
        })
      );
    }
    return response.data.raw ?? [];
  };
}

export { AnalyticRawManager };
