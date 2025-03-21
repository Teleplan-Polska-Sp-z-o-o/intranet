import { Endpoints } from "../../../config/axios/Endpoints";
import jwtAxios from "../../../config/axios/jwtAxios";
import { nodeConfig } from "../../../config/env";
import { IMSTranslatorUsage } from "../../../interfaces/document/creator/IMSTranslatorUsage";

class DocumentCreatorUsageManager {
  constructor() {}

  public GetTotalUsage = async (): Promise<number> => {
    const response = await jwtAxios.get(
      `${nodeConfig.production_origin}:${nodeConfig.port}${Endpoints.GetTotalUsage}`
    );
    return response.data.totalCharactersUsed;
  };
  public GetUsageLogs = async (): Promise<IMSTranslatorUsage[]> => {
    const response = await jwtAxios.get(
      `${nodeConfig.production_origin}:${nodeConfig.port}${Endpoints.GetUsageLogs}`
    );
    return response.data.retrieved;
  };
}

export { DocumentCreatorUsageManager };
