import { nodeConfig } from "../../config/env";
import { Endpoints } from "../../config/axios/Endpoints";
import { ResponseStatus } from "../common/ResponseStatus";
import { useAlertStore } from "../../stores/alertStore";
import jwtAxios from "../../config/axios/jwtAxios";
import { ToAcknowledge } from "./ToAcknowledge";
import { AcknowledgementTypes } from "../../interfaces/acknowledgement/AcknowledgementTypes";

class ToAcknowledgeManager {
  closed: boolean;
  source: AcknowledgementTypes.IIs;
  constructor(closed: boolean, source: AcknowledgementTypes.IIs) {
    this.closed = closed;
    this.source = source;
  }

  public new = () => new ToAcknowledge();

  public post = async (data: FormData, status: boolean = false): Promise<Array<ToAcknowledge>> => {
    const response = await jwtAxios.post(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.ToAcknowledge}`,
      data
    );
    if (status) {
      useAlertStore().process(
        new ResponseStatus({
          code: response.status,
          message: response.data.statusMessage,
        })
      );
    }
    return response.data.added;
  };

  public get = async (): Promise<Array<ToAcknowledge>> => {
    const response = await jwtAxios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.ToAcknowledge}/${this.closed}/${this.source}}`
    );
    return response.data.got;
  };

  public put = async (data: FormData, status: boolean = false): Promise<Array<ToAcknowledge>> => {
    const response = await jwtAxios.put(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.ToAcknowledge}`,
      data
    );
    if (status) {
      useAlertStore().process(
        new ResponseStatus({
          code: response.status,
          message: response.data.statusMessage,
        })
      );
    }
    return response.data.edited;
  };

  public close = async (data: FormData, status: boolean = false): Promise<Array<ToAcknowledge>> => {
    const response = await jwtAxios.put(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.ToAcknowledge}/close`,
      data
    );
    if (status) {
      useAlertStore().process(
        new ResponseStatus({
          code: response.status,
          message: response.data.statusMessage,
        })
      );
    }
    return response.data.closed;
  };

  public delete = async (id: number, status: boolean = false): Promise<Array<ToAcknowledge>> => {
    const response = await jwtAxios.delete(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.ToAcknowledge}/${id}`
    );
    if (status) {
      useAlertStore().process(
        new ResponseStatus({
          code: response.status,
          message: response.data.statusMessage,
        })
      );
    }
    return response.data.deleted;
  };
}

export { ToAcknowledgeManager };
