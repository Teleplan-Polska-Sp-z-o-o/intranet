// router.get("/creator/cache", getDraftCache);
// router.post("/creator/cache", creatorUpload.any(), upsertDraftCache);

import { Endpoints } from "../../../config/axios/Endpoints";
import jwtAxios from "../../../config/axios/jwtAxios";
import { nodeConfig } from "../../../config/env";
import stringify from "safe-stable-stringify";

interface ICache {
  id: number;
  userId: number;
  stepper: any;
}

interface ICacheResponse {
  cache: [ICache];
  message: string;
  statusMessage: string;
}
export class CreatorCacheManager {
  constructor() {}

  private prepareFormData(stepper: object) {
    const formData: FormData = new FormData();
    formData.append("stepper", stringify(stepper));
    return formData;
  }

  /**
   *
   * @param data FormData with 'stepper' key
   */
  public post = async (stepper: object): Promise<ICacheResponse> => {
    try {
      const response = await jwtAxios.post(
        `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.DraftCache}`,
        this.prepareFormData(stepper)
      );

      return response.data;
    } catch (error: any) {
      const response = error.response || null;
      return response;
    }
  };

  public get = async (): Promise<ICacheResponse> => {
    try {
      const response = await jwtAxios.get(
        `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.DraftCache}`
      );
      return response.data;
    } catch (error: any) {
      const response = error.response || null;
      return response;
    }
  };
}
