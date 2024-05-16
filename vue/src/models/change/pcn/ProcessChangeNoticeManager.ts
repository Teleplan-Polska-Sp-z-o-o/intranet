import axios from "axios";
import { Endpoints } from "../../../config/Endpoints";
import { nodeConfig } from "../../../config/env";
import { IResponseStatus } from "../../../interfaces/common/IResponseStatus";
import { ResponseStatus } from "../../common/ResponseStatus";
import { IProcessChangeRequest } from "../../../interfaces/change/IProcessChangeRequest";
import { ProcessChangeNoticeFields } from "./ProcessChangeNoticeFields";

class ProcessChangeNoticeManager {
  constructor() {}

  public new = () => new ProcessChangeNoticeFields();

  public put = async (
    formData: FormData,
    status: boolean = false
  ): Promise<Array<IProcessChangeRequest> | IResponseStatus> => {
    const response = await axios.put(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.ChangeNotice}`,
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
    status: boolean = true
  ): Promise<{ response: ResponseStatus; closed: IProcessChangeRequest }> => {
    const response = await axios.put(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.ChangeNotice}/close`,
      formData
    );
    if (status) {
      return {
        response: new ResponseStatus({
          code: response.status,
          message: response.data.statusMessage,
        }),
        closed: response.data.closed,
      };
    }
    return response.data.closed;
  };

  public delete = async (
    id: number,
    status: boolean = false
  ): Promise<Array<IProcessChangeRequest> | IResponseStatus> => {
    const response = await axios.delete(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.ChangeNotice}/${id}`
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
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.ChangeNotice}`
    );
    return response.data.got;
  };

  public getNotice = async (id: number): Promise<IProcessChangeRequest> => {
    const response = await axios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.ChangeNotice}/${id}`
    );
    return response.data.got;
  };
}

export { ProcessChangeNoticeManager };
