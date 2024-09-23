import { AnalyticRaw } from "../../components/views/tools/analytic/sky/transactions/Types";
import { Endpoints } from "../../config/axios/Endpoints";
import jwtAxios from "../../config/axios/jwtAxios";
import { nodeConfig } from "../../config/env";
import { useAlertStore } from "../../stores/alertStore";
import { ResponseStatus } from "../common/ResponseStatus";

class AnalyticRawManager {
  program: AnalyticRaw.TPrograms;
  constructor(program: AnalyticRaw.TPrograms) {
    this.program = program;
  }

  public createFormData = (preFormData: AnalyticRaw.IPreFormData) => {
    const formData = new FormData();
    formData.append("contracts", JSON.stringify(preFormData.contracts));
    formData.append("startOfDay", JSON.stringify(preFormData.startOfDay));
    formData.append("endOfDay", JSON.stringify(preFormData.endOfDay));
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
    status: boolean = false
  ): Promise<AnalyticRaw.TTransactions> => {
    const response = await jwtAxios.post(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Analytic}/raw`,
      formData
    );
    if (status) {
      useAlertStore().process(
        new ResponseStatus({
          code: response.status,
          message: response.data.statusMessage,
        })
      );
    }
    return response.data.raw;
  };
}

export { AnalyticRawManager };
