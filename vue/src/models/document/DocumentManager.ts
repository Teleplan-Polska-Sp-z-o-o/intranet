import { nodeConfig } from "../../config/env";
import { Endpoints } from "../../config/axios/Endpoints";
import { IDocumentEntity } from "../../interfaces/document/IDocumentEntity";
import { DocumentEntity } from "./DocumentEntity";
import { IResponseStatus } from "../../interfaces/common/IResponseStatus";
import { ResponseStatus } from "../common/ResponseStatus";
import { useUserStore } from "../../stores/userStore";
import { TConfidentiality } from "../../interfaces/user/UserTypes";
import { useAlertStore } from "../../stores/alertStore";
import jwtAxios from "../../config/axios/jwtAxios";
import { IChips, TDocumentType } from "../../interfaces/document/DocumentTypes";
import { usePermissionStore } from "../../stores/permissionStore";

class DocumentManager {
  type: TDocumentType;
  reduce: boolean;

  constructor(type: TDocumentType = "all", reduce: boolean = false) {
    this.type = type;
    this.reduce = reduce;
  }

  public new = () => new DocumentEntity();

  public post = async (
    formData: FormData,
    status: boolean = false
  ): Promise<Array<IDocumentEntity> | IResponseStatus> => {
    const response = await jwtAxios.post(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Document}`,
      formData
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

  public get = async (reqData: IChips): Promise<Array<IDocumentEntity>> => {
    const folderStructure: string = JSON.stringify(Object.values(reqData));

    const userInfo = useUserStore().info();
    let confidentiality: TConfidentiality = "public";
    if (userInfo) {
      const permission = await usePermissionStore().get(userInfo);
      confidentiality = permission.confidentiality;
    }

    const params: string[] = [
      "by",
      folderStructure,
      this.type,
      this.reduce.toString(),
      confidentiality,
    ];

    const response = await jwtAxios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Document}/${params.join("/")}`
    );
    return response.data.documents;
  };

  public put = async (
    formData: FormData,
    status: boolean = false
  ): Promise<Array<IDocumentEntity> | IResponseStatus> => {
    const response = await jwtAxios.put(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Document}`,
      formData
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
  ): Promise<Array<IDocumentEntity> | IResponseStatus> => {
    const response = await jwtAxios.delete(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Document}/${id}`
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

  public getByUuidAndLangs = async (uuid: string, langs: string): Promise<IDocumentEntity> => {
    const response = await jwtAxios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Document}/by/${uuid}/${langs}`
    );
    return response.data.document;
  };

  public getByNumber = async (number: string): Promise<IDocumentEntity[]> => {
    const response = await jwtAxios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Document}/by/${number}`
    );
    return response.data.documents;
  };
}

export { DocumentManager };
