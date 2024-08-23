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
import { useCrudTypeChipsStore } from "../../stores/crud/useCrudTypeChipsStore";
import axios from "axios";

class DocumentManager {
  reduce: boolean;
  quickAccess: boolean;
  /**
   * If not specified useCrudTypeChipsStore all TDocumentType options
   *
   * If given as TDocumentType[] response is always limited to these types
   *
   * If given as string which represents id connection of filters and crud
   * response is based on chosen types
   */
  types?: TDocumentType[] | string;

  constructor(
    types: TDocumentType[] | string | undefined = undefined,
    reduce: boolean = false,
    quickAccess: boolean = false
  ) {
    this.types = types;
    this.reduce = reduce;
    this.quickAccess = quickAccess;
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

  public get = async (chips: IChips): Promise<Array<DocumentEntity>> => {
    const folderStructure: string = JSON.stringify(Object.values(chips));
    const types: TDocumentType[] = !Array.isArray(this.types)
      ? useCrudTypeChipsStore().getTypes(this.types).value
      : this.types;
    const userInfo = useUserStore().info();
    let confidentiality: TConfidentiality = "public";
    if (userInfo) {
      const permission = await usePermissionStore().get(userInfo);
      confidentiality = permission.confidentiality;
    }
    const params: string[] = [
      "by",
      folderStructure,
      JSON.stringify(types),
      this.reduce.toString(),
      confidentiality,
      this.quickAccess.toString(),
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

  public toggleQuickAccess = async (id: number, status: boolean = false): Promise<boolean> => {
    try {
      const response = await jwtAxios.put(
        `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Document}/toggle-quick/${id}`
      );

      if (status) {
        useAlertStore().process(
          new ResponseStatus({
            code: response.status,
            message: response.data.statusMessage,
          })
        );
      }

      return true;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && status) {
        useAlertStore().process(
          new ResponseStatus({
            code: error.response.status,
            message: error.response.data.statusMessage,
          })
        );
      }

      console.error(`changeQuicks at DocumentManager, error: ${error}`);
      return false;
    }
  };
}

export { DocumentManager };
