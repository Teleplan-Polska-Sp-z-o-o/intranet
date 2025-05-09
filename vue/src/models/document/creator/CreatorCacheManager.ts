// router.get("/creator/cache", getDraftCache);
// router.post("/creator/cache", creatorUpload.any(), upsertDraftCache);

import { Endpoints } from "../../../config/axios/Endpoints";
import jwtAxios from "../../../config/axios/jwtAxios";
import { nodeConfig } from "../../../config/env";
import stringify from "safe-stable-stringify";
import { useAlertStore } from "../../../stores/alertStore";
import { ResponseStatus } from "../../common/ResponseStatus";
import { IUser } from "../../../interfaces/user/UserTypes";

interface IOrmUserAction {
  user: IUser;
  date: Date;
}

export interface ICache {
  id: number;
  userId: number;
  stepper: any;
  ormCreateDate: string;
  createdBy: IOrmUserAction;
  ormUpdateDate: string;
  updatedBy: IOrmUserAction[];
}

export interface ICacheResponse {
  cache: ICache[];
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

  public get = async (id?: number): Promise<ICacheResponse> => {
    try {
      const response = await jwtAxios.get(
        `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.DraftCache}${
          id !== undefined ? `/${id}` : ""
        }`
      );
      return response.data;
    } catch (error: any) {
      const response = error.response || null;
      return response;
    }
  };

  public delete = async (id: number): Promise<void> => {
    try {
      const response = await jwtAxios.delete(
        `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.DraftCache}/${id}`
      );

      useAlertStore().process(
        new ResponseStatus({
          code: response.status,
          message: response.data.statusMessage,
        })
      );

      return;
    } catch (error: any) {
      useAlertStore().process(
        new ResponseStatus({
          code: error.response.status,
          message: error.response.data.statusMessage,
        })
      );

      return;
    }
  };
}
