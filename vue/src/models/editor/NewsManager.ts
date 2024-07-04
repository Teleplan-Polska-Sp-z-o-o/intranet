import axios from "axios";
import { nodeConfig } from "../../config/env";
import { Endpoints } from "../../config/Endpoints";
import { NewsEntity } from "./NewsEntity";
import { INewsEntity } from "../../interfaces/editor/INewsEntity";
import { usePermissionStore } from "../../stores/permissionStore";
import { IResponseStatus } from "../../interfaces/common/IResponseStatus";
import { ResponseStatus } from "../common/ResponseStatus";

class NewsManager {
  constructor() {}

  public new = () => new NewsEntity();

  public post = async (
    formData: FormData,
    status: boolean = false
  ): Promise<Array<INewsEntity> | IResponseStatus> => {
    const response = await axios.post(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.News}`,
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

  public put = async (
    formData: FormData,
    status: boolean = false
  ): Promise<Array<INewsEntity> | IResponseStatus> => {
    const response = await axios.put(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.News}`,
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

  public get = async (
    permission: boolean = false,
    skip: number = 0,
    take: number = 0
  ): Promise<Array<INewsEntity>> => {
    const permissionStore = usePermissionStore();

    const code: "user" | "moderator" | "admin" = permission
      ? (permissionStore.translatePermissionToStringCode() as "user" | "moderator" | "admin")
      : "admin";
    const response = await axios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.News}/${code}/${skip}/${take}`
    );
    return response.data.news;
  };

  public delete = async (
    id: number,
    status: boolean = false
  ): Promise<Array<INewsEntity> | IResponseStatus> => {
    const response = await axios.delete(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.News}/${id}`
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

export { NewsManager };
