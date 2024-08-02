import jwtAxios from "../../config/axios/jwtAxios";
import { nodeConfig } from "../../config/env";
import { useAlertStore } from "../../stores/alertStore";
import { ResponseStatus } from "./ResponseStatus";

abstract class BaseManager<T> {
  protected abstract endpoint: string;

  constructor() {}

  public abstract new(): T;

  public async post(formData: FormData, status: boolean = false): Promise<T> {
    const response = await jwtAxios.post(
      `${nodeConfig.origin}:${nodeConfig.port}${this.endpoint}`,
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
  }

  public async put(formData: FormData, status: boolean = false): Promise<T> {
    const response = await jwtAxios.put(
      `${nodeConfig.origin}:${nodeConfig.port}${this.endpoint}`,
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
  }

  public async delete(id: number, status: boolean = false): Promise<T> {
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
  }

  public abstract get(): Promise<Array<T>>;
}

export { BaseManager };
