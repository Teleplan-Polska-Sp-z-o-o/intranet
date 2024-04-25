import axios from "axios";
import { Endpoints } from "../../../config/Endpoints";
import { nodeConfig } from "../../../config/env";
import { IResponseStatus } from "../../../interfaces/common/IResponseStatus";
import { ResponseStatus } from "../../common/ResponseStatus";
import { IProcessChangeRequest } from "../../../interfaces/change/IProcessChangeRequest";
import { ProcessChangeRequestBase } from "./ProcessChangeRequestBase";
import { IProcessChangeRequestUpdates } from "../../../interfaces/change/IProcessChangeRequestUpdates";

class ProcessChangeRequestManager {
  constructor() {}

  public new = () => new ProcessChangeRequestBase();

  public post = async (
    formData: FormData,
    status: boolean = false
  ): Promise<Array<IProcessChangeRequest> | IResponseStatus> => {
    const response = await axios.post(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.ChangeRequest}`,
      formData
    );
    if (status) {
      return new ResponseStatus({
        code: response.status,
        message: response.data.statusMessage,
      });
    }
    return response.data.added;
  };

  public put = async (
    formData: FormData,
    status: boolean = false
  ): Promise<Array<IProcessChangeRequest> | IResponseStatus> => {
    const response = await axios.put(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.ChangeRequest}`,
      formData
    );
    if (status) {
      return new ResponseStatus({
        code: response.status,
        message: response.data.statusMessage,
      });
    }
    return response.data.edited;
  };

  public close = async (
    formData: FormData,
    assessment: "Implementation" | "Rejection",
    status: boolean = false
  ): Promise<Array<IProcessChangeRequest> | IResponseStatus> => {
    const response = await axios.put(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.ChangeRequest}/${assessment}`,
      formData
    );
    if (status) {
      return new ResponseStatus({
        code: response.status,
        message: response.data.statusMessage,
      });
    }
    return response.data.closed;
  };

  public delete = async (
    id: number,
    status: boolean = false
  ): Promise<Array<IProcessChangeRequest> | IResponseStatus> => {
    const response = await axios.delete(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.ChangeRequest}/${id}`
    );
    if (status) {
      return new ResponseStatus({
        code: response.status,
        message: response.data.statusMessage,
      });
    }
    return response.data.deleted;
  };

  public get = async (_blank: any): Promise<Array<IProcessChangeRequest>> => {
    const response = await axios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.ChangeRequest}`
    );
    return response.data.got;
  };

  public getRequest = async (id: number): Promise<IProcessChangeRequest> => {
    const response = await axios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.ChangeRequest}/${id}`
    );
    return response.data.got;
  };

  public getRequestUpdates = async (id: number): Promise<Array<IProcessChangeRequestUpdates>> => {
    const response = await axios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.ChangeRequest}/updates/${id}`
    );
    return response.data.got;
  };
}

export { ProcessChangeRequestManager };
