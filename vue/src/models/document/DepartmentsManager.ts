import axios from "axios";
import { IChip, IChips, TDocumentType } from "../../interfaces/document/DocumentTypes";
import { nodeConfig } from "../../config/env";
import { Endpoints } from "../../config/Endpoints";
import { Chip } from "./Chip";
import { IResponseStatus } from "../../interfaces/common/IResponseStatus";
import { ResponseStatus } from "../common/ResponseStatus";
import { useAlertStore } from "../../stores/alertStore";

class DepartmentsManager {
  constructor() {}

  public new = () => new Chip();

  public post = async (
    reqData: any,
    status: boolean = false
  ): Promise<Array<IChip> | IResponseStatus> => {
    const requestData = {
      name: reqData.name,
    };

    const response = await axios.post(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.DocumentDepartment}`,
      requestData
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

  public get = async (_reqData?: IChips, whereDocType?: TDocumentType): Promise<Array<IChip>> => {
    const response = await axios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.DocumentDepartment}${
        whereDocType ? `/${whereDocType}` : ""
      }`
    );
    return response.data.got;
  };

  public put = async (
    reqData: any,
    status: boolean = false
  ): Promise<Array<IChip> | IResponseStatus> => {
    const id: string = reqData.id;
    const name: string = reqData.name;
    const response = await axios.put(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.DocumentDepartment}/${id}/${name}`
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
  ): Promise<Array<IChip> | IResponseStatus> => {
    const response = await axios.delete(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.DocumentDepartment}/${id}`
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

export { DepartmentsManager };
