import { Endpoints } from "../../../config/axios/Endpoints";
import { nodeConfig } from "../../../config/env";
import { IResponseStatus } from "../../../interfaces/common/IResponseStatus";
import { ResponseStatus } from "../../common/ResponseStatus";
import { IProcessChangeRequest } from "../../../interfaces/change/IProcessChangeRequest";
import { ProcessChangeNoticeFields } from "./ProcessChangeNoticeFields";
import { IProcessChangeNoticeUpdates } from "../../../interfaces/change/IProcessChangeNoticeUpdates";
import { useAlertStore } from "../../../stores/alertStore";
import jwtAxios from "../../../config/axios/jwtAxios";

class ProcessChangeNoticeManager {
  constructor() {}

  public new = () => new ProcessChangeNoticeFields();

  public put = async (
    formData: FormData,
    status: boolean = false
  ): Promise<Array<IProcessChangeRequest> | IResponseStatus> => {
    const response = await jwtAxios.put(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.ChangeNotice}`,
      formData
    );
    if (status) {
      // return new ResponseStatus({
      //   code: response.status,
      //   message: response.data.statusMessage,
      // });
      useAlertStore().process(
        new ResponseStatus({
          code: response.status,
          message: response.data.statusMessage,
        })
      );
    }
    return response.data.edited;
  };

  public assess = async (
    formData: FormData,
    assessment: "approve" | "rejection",
    status: boolean = true
  ): Promise<{ assessed: IProcessChangeRequest }> => {
    const response = await jwtAxios.put(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.ChangeNotice}/${assessment}`,
      formData
    );
    if (status) {
      useAlertStore().process(
        new ResponseStatus({
          code: response.status,
          message: response.data.statusMessage,
        })
      );
      return {
        // response: new ResponseStatus({
        //   code: response.status,
        //   message: response.data.statusMessage,
        // }),
        assessed: response.data.assessed,
      };
    }
    return response.data.assessed;
  };

  public delete = async (
    id: number,
    status: boolean = false
  ): Promise<Array<IProcessChangeRequest> | IResponseStatus> => {
    const response = await jwtAxios.delete(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.ChangeNotice}/${id}`
    );
    if (status) {
      // return new ResponseStatus({
      //   code: response.status,
      //   message: response.data.statusMessage,
      // });
      useAlertStore().process(
        new ResponseStatus({
          code: response.status,
          message: response.data.statusMessage,
        })
      );
    }
    return response.data.deleted;
  };

  public get = async (_blank: any): Promise<Array<IProcessChangeRequest>> => {
    const response = await jwtAxios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.ChangeNotice}`
    );
    return response.data.got;
  };

  public getNotice = async (id: number): Promise<IProcessChangeRequest> => {
    const response = await jwtAxios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.ChangeNotice}/${id}`
    );
    return response.data.got;
  };

  public getNoticeUpdates = async (id: number): Promise<Array<IProcessChangeNoticeUpdates>> => {
    const response = await jwtAxios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.ChangeNotice}/updates/${id}`
    );
    return response.data.got;
  };
}

export { ProcessChangeNoticeManager };
