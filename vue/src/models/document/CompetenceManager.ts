import axios from "axios";
import { nodeConfig } from "../../config/env";
import { Endpoints } from "../../config/Endpoints";
import { IResponseStatus } from "../../interfaces/common/IResponseStatus";
import { ResponseStatus } from "../common/ResponseStatus";
import { Competence } from "./Competence";
import { ICompetence } from "../../interfaces/document/DocumentTypes";
import { useAlertStore } from "../../stores/alertStore";

class CompetenceManager {
  constructor() {}

  public new = (): ICompetence => new Competence();

  public post = async (
    reqData: FormData,
    status: boolean = false
  ): Promise<Array<ICompetence> | IResponseStatus> => {
    const response = await axios.post(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Competence}`,
      reqData
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

  public get = async (_reqData?: any): Promise<Array<ICompetence>> => {
    const response = await axios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Competence}`
    );
    return response.data.got;
  };

  public put = async (
    reqData: FormData,
    status: boolean = false
  ): Promise<Array<ICompetence> | IResponseStatus> => {
    const response = await axios.put(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Competence}`,
      reqData
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

  public delete = async (
    id: number,
    status: boolean = false
  ): Promise<Array<ICompetence> | IResponseStatus> => {
    const response = await axios.delete(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Competence}/${id}`
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
}

export { CompetenceManager };
