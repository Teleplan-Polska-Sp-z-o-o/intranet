import { Endpoints } from "../../config/axios/Endpoints";
import jwtAxios from "../../config/axios/jwtAxios";
import { nodeConfig } from "../../config/env";
import { useAlertStore } from "../../stores/alertStore";
import { ResponseStatus } from "../common/ResponseStatus";

class AnalyticInventoryCharacteristicManager {
  program: string;

  constructor(program: string) {
    this.program = program;
  }

  /**
   *
   * Returns models from ifs for program part_no's
   * @returns
   */
  public get = async (status: boolean = false): Promise<object[]> => {
    const response = await jwtAxios.post(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Analytic}/${this.program}/models`
    );
    if (status) {
      useAlertStore().process(
        new ResponseStatus({
          code: response.status,
          message: response.data.statusMessage,
        })
      );
    }
    return response.data.models ?? [];
  };
}

export { AnalyticInventoryCharacteristicManager };
