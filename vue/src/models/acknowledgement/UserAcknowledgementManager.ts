import { nodeConfig } from "../../config/env";
import { Endpoints } from "../../config/axios/Endpoints";
import { ResponseStatus } from "../common/ResponseStatus";
import { useAlertStore } from "../../stores/alertStore";
import jwtAxios from "../../config/axios/jwtAxios";
import { UserAcknowledgement } from "./UserAcknowledgement";
import { AcknowledgementTypes } from "../../interfaces/acknowledgement/AcknowledgementTypes";

class UserAcknowledgementManager {
  closed: boolean;
  source: AcknowledgementTypes.IIs;

  constructor(closed: boolean, source: AcknowledgementTypes.IIs) {
    this.closed = closed;
    this.source = source;
  }

  public new = () => new UserAcknowledgement();

  public post = async (
    data: FormData,
    status: boolean = false
  ): Promise<Array<UserAcknowledgement>> => {
    const response = await jwtAxios.post(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.UserAcknowledgement}`,
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

  public get = async (): Promise<Array<UserAcknowledgement>> => {
    const response = await jwtAxios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.UserAcknowledgement}/${this.closed}/${this.source}}`
    );
    return response.data.got;
  };

  public put = async (
    data: FormData,
    status: boolean = false
  ): Promise<Array<UserAcknowledgement>> => {
    const response = await jwtAxios.put(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.UserAcknowledgement}`,
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

  public delete = async (
    id: number,
    status: boolean = false
  ): Promise<Array<UserAcknowledgement>> => {
    const response = await jwtAxios.delete(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.UserAcknowledgement}/${id}`
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

export { UserAcknowledgementManager };
