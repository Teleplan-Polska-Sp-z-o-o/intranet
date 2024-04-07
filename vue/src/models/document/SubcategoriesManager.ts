import axios from "axios";
import { IChip } from "../../interfaces/document/IChip";
import { nodeConfig } from "../../config/env";
import { Endpoints } from "../../config/Endpoints";
import { Chip } from "./Chip";
import { IChips } from "../../interfaces/document/IChips";
import { ResponseStatus } from "../common/ResponseStatus";
import { IResponseStatus } from "../../interfaces/common/IResponseStatus";

class SubcategoriesManager {
  constructor() {}

  public new = () => new Chip();

  public post = async (
    reqData: any,
    status: boolean = false
  ): Promise<Array<IChip> | IResponseStatus> => {
    const requestData = {
      name: reqData.name,
      departmentName: reqData.departmentName,
      categoryName: reqData.categoryName,
    };

    const response = await axios.post(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.DocumentSubcategory}`,
      requestData
    );
    if (status) {
      return new ResponseStatus({
        code: response.status,
        message: response.data.statusMessage,
      });
    }
    return response.data.added;
  };

  public get = async (reqData: IChips): Promise<Array<IChip>> => {
    const departmentName: string = reqData.departmentName;
    const categoryName: string = reqData.categoryName;
    const response = await axios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.DocumentSubcategory}/${departmentName}/${categoryName}`
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
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.DocumentSubcategory}/${id}/${name}`
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
  ): Promise<Array<IChip> | IResponseStatus> => {
    const response = await axios.delete(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.DocumentSubcategory}/${id}`
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

export { SubcategoriesManager };
