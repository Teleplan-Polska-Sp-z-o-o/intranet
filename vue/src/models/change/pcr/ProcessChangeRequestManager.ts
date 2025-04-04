import { Endpoints } from "../../../config/axios/Endpoints";
import { nodeConfig } from "../../../config/env";
import { IResponseStatus } from "../../../interfaces/common/IResponseStatus";
import { ResponseStatus } from "../../common/ResponseStatus";
import { IProcessChangeRequest } from "../../../interfaces/change/IProcessChangeRequest";
import { ProcessChangeRequestBase } from "./ProcessChangeRequestBase";
import { IProcessChangeRequestUpdates } from "../../../interfaces/change/IProcessChangeRequestUpdates";
import { useAlertStore } from "../../../stores/alertStore";
import jwtAxios from "../../../config/axios/jwtAxios";

class ProcessChangeRequestManager {
  constructor() {}

  public new = () => new ProcessChangeRequestBase();

  public post = async (
    formData: FormData,
    status: boolean = false
  ): Promise<Array<IProcessChangeRequest> | IResponseStatus> => {
    const response = await jwtAxios.post(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.ChangeRequest}`,
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
    return response.data.added;
  };

  public put = async (
    formData: FormData,
    status: boolean = false
  ): Promise<Array<IProcessChangeRequest> | IResponseStatus> => {
    const response = await jwtAxios.put(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.ChangeRequest}`,
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

  public close = async (
    formData: FormData,
    assessment: "Implementation" | "Rejection",
    status: boolean = true
  ): Promise<{ closed: IProcessChangeRequest }> => {
    const response = await jwtAxios.put(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.ChangeRequest}/${assessment}`,
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
        closed: response.data.closed,
      };
    }
    return response.data.closed;
  };

  public delete = async (
    id: number,
    status: boolean = false
  ): Promise<Array<IProcessChangeRequest> | IResponseStatus> => {
    const response = await jwtAxios.delete(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.ChangeRequest}/${id}`
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
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.ChangeRequest}`
    );
    return response.data.got;
  };

  public getRequest = async (id: number): Promise<IProcessChangeRequest> => {
    const response = await jwtAxios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.ChangeRequest}/${id}`
    );
    return response.data.got;
  };

  public getRequestUpdates = async (id: number): Promise<Array<IProcessChangeRequestUpdates>> => {
    const response = await jwtAxios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.ChangeRequest}/updates/${id}`
    );
    return response.data.got;
  };
}

export { ProcessChangeRequestManager };
