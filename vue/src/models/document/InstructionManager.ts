import axios from "axios";
import { nodeConfig } from "../../config/env";
import { Endpoints } from "../../config/Endpoints";
import { IDocumentEntity } from "../../interfaces/document/IDocumentEntity";
import { DocumentEntity } from "./DocumentEntity";
import { IResponseStatus } from "../../interfaces/common/IResponseStatus";
import { ResponseStatus } from "../common/ResponseStatus";

class InstructionManager {
  constructor() {}

  public new = () => new DocumentEntity();

  public post = async (
    formData: FormData,
    status: boolean = false
  ): Promise<Array<IDocumentEntity> | IResponseStatus> => {
    const response = await axios.post(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Document}`,
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

  public get = async (reqData: any): Promise<Array<IDocumentEntity>> => {
    let lvl: number = 0;
    if (reqData.departmentName) lvl = 1;
    if (reqData.categoryName) lvl = 2;
    if (reqData.subcategoryName) lvl = 3;

    let params: string = "/Instruction/true";
    switch (lvl) {
      case 1:
        params = `/${reqData.departmentName}/Instruction/true`;
        break;
      case 2:
        params = `/${reqData.departmentName}/${reqData.categoryName}/Instruction/true`;
        break;
      case 3:
        params = `/${reqData.departmentName}/${reqData.categoryName}/${reqData.subcategoryName}/Instruction/true`;
        break;

      default:
        break;
    }

    const response = await axios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Document}${params}`
    );
    return response.data.documents;
  };

  public put = async (
    formData: FormData,
    status: boolean = false
  ): Promise<Array<IDocumentEntity> | IResponseStatus> => {
    const response = await axios.put(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Document}`,
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

  public delete = async (
    id: number,
    status: boolean = false
  ): Promise<Array<IDocumentEntity> | IResponseStatus> => {
    const response = await axios.delete(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Document}/${id}`
    );
    if (status) {
      return new ResponseStatus({
        code: response.status,
        message: response.data.statusMessage,
      });
    }
    return response.data.deleted;
  };
}

export { InstructionManager };
