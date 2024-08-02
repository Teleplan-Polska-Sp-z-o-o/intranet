import { nodeConfig } from "../../config/env";
import { Endpoints } from "../../config/axios/Endpoints";
import { NewsEntity } from "./NewsEntity";
import { INewsEntity } from "../../interfaces/editor/INewsEntity";
import { usePermissionStore } from "../../stores/permissionStore";
import { IResponseStatus } from "../../interfaces/common/IResponseStatus";
import { ResponseStatus } from "../common/ResponseStatus";
import { TConfidentiality } from "../../interfaces/user/UserTypes";
import { useUserStore } from "../../stores/userStore";
import { SimpleUser } from "../user/SimpleUser";
import { useAlertStore } from "../../stores/alertStore";
import jwtAxios from "../../config/axios/jwtAxios";

class NewsManager {
  constructor() {}

  public new = () => new NewsEntity();

  public post = async (
    formData: FormData,
    status: boolean = false
  ): Promise<Array<INewsEntity> | IResponseStatus> => {
    const response = await jwtAxios.post(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.News}`,
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

  public put = async (
    formData: FormData,
    status: boolean = false
  ): Promise<Array<INewsEntity> | IResponseStatus> => {
    const response = await jwtAxios.put(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.News}`,
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

  public get = async (
    confidentiality: boolean = false,
    skip: number = 0,
    take: number = 0
  ): Promise<Array<INewsEntity>> => {
    const userInfo = useUserStore().info();
    let conf: TConfidentiality = "public";
    if (userInfo) {
      const user: SimpleUser = new SimpleUser().build(userInfo);
      conf = confidentiality ? (await usePermissionStore().get(user)).confidentiality : "secret";
    }
    const response = await jwtAxios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.News}/${conf}/${skip}/${take}`
    );
    return response.data.news;
  };

  public delete = async (
    id: number,
    status: boolean = false
  ): Promise<Array<INewsEntity> | IResponseStatus> => {
    const response = await jwtAxios.delete(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.News}/${id}`
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

export { NewsManager };
