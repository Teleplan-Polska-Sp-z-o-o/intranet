import axios from "axios";
import { nodeConfig } from "../../config/env";
import { Endpoints } from "../../config/Endpoints";
import { IDocumentEntity } from "../../interfaces/document/IDocumentEntity";
import { DocumentEntity } from "./DocumentEntity";
import { IResponseStatus } from "../../interfaces/common/IResponseStatus";
import { ResponseStatus } from "../common/ResponseStatus";
import { useUserStore } from "../../stores/userStore";
import { TConfidentiality } from "../../interfaces/user/UserTypes";
import { useAlertStore } from "../../stores/alertStore";

class DocumentManager {
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

  public get = async (reqData: any): Promise<Array<IDocumentEntity>> => {
    let lvl: number = 0;
    if (reqData.departmentName) lvl = 1;
    if (reqData.categoryName) lvl = 2;
    if (reqData.subcategoryName) lvl = 3;

    const userInfo = useUserStore().info();

    let confidentiality: TConfidentiality = "public";
    if (userInfo) confidentiality = userInfo.permission.confidentiality;

    let params: string = `/all/false/${confidentiality}`;
    switch (lvl) {
      case 1:
        params = `/${reqData.departmentName}/all/false/${confidentiality}`;
        break;
      case 2:
        params = `/${reqData.departmentName}/${reqData.categoryName}/all/false/${confidentiality}`;
        break;
      case 3:
        params = `/${reqData.departmentName}/${reqData.categoryName}/${reqData.subcategoryName}/all/false/${confidentiality}`;
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
  ): Promise<Array<IDocumentEntity> | IResponseStatus> => {
    const response = await axios.delete(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Document}/${id}`
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

  public getByUuidAndLangs = async (uuid: string, langs: string): Promise<IDocumentEntity> => {
    const response = await axios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Document}/uuidLangs/${uuid}/${langs}`
    );
    return response.data.document;
  };
}

export { DocumentManager };
