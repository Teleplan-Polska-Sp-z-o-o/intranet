import { IChip, IChips, TDocumentType } from "../../interfaces/document/DocumentTypes";
import { nodeConfig } from "../../config/env";
import { Endpoints } from "../../config/axios/Endpoints";
import { Chip } from "./Chip";
import { IResponseStatus } from "../../interfaces/common/IResponseStatus";
import { ResponseStatus } from "../common/ResponseStatus";
import { useAlertStore } from "../../stores/alertStore";
import jwtAxios from "../../config/axios/jwtAxios";
import { useCrudTypeChipsStore } from "../../stores/crud/useCrudTypeChipsStore";

class DepartmentsManager {
  endpoint: Endpoints;
  quickAccess: boolean | undefined;
  whereDocType: TDocumentType[] | false | undefined;

  constructor(
    endpoint:
      | Endpoints.DocumentDepartment
      | Endpoints.DocumentCategory
      | Endpoints.DocumentSubcategory,
    quickAccess: boolean | undefined = undefined,
    whereDocType: TDocumentType[] | false | undefined = undefined
  ) {
    this.endpoint = endpoint;
    this.quickAccess = quickAccess;
    this.whereDocType = whereDocType;
  }

  public new = () => new Chip();

  public post = async (
    data: any,
    status: boolean = false
  ): Promise<Array<IChip> | IResponseStatus> => {
    const response = await jwtAxios.post(
      `${nodeConfig.origin}:${nodeConfig.port}${this.endpoint}`,
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

  public get = async (
    chips: IChips,
    quickAccess: boolean = false,
    whereDocType?: TDocumentType[] | false
  ): Promise<Array<IChip>> => {
    const params: string[] = [];
    if (this.endpoint !== Endpoints.DocumentDepartment)
      params.push(chips.departmentName ?? "undefined");
    if (this.endpoint === Endpoints.DocumentSubcategory)
      params.push(chips.categoryName ?? "undefined");
    params.push(
      this.quickAccess !== undefined ? this.quickAccess.toString() : quickAccess.toString()
    );
    params.push(JSON.stringify(whereDocType ?? this.whereDocType ?? useCrudTypeChipsStore().TYPES));

    const response = await jwtAxios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${this.endpoint}/${params.join("/")}`
    );
    return response.data.got;
  };

  public put = async (
    chip: IChip,
    status: boolean = false
  ): Promise<Array<IChip> | IResponseStatus> => {
    const id: number = chip.id;
    const name: string = chip.name;
    const response = await jwtAxios.put(
      `${nodeConfig.origin}:${nodeConfig.port}${this.endpoint}/${id}/${name}`
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
  ): Promise<Array<IChip> | IResponseStatus> => {
    const response = await jwtAxios.delete(
      `${nodeConfig.origin}:${nodeConfig.port}${this.endpoint}/${id}`
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

export { DepartmentsManager };
