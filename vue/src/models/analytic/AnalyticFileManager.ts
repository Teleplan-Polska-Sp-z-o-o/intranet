import { AnalyticFileTypes } from "../../components/views/tools/analytic/files/Types";
import { Endpoints } from "../../config/axios/Endpoints";
import jwtAxios from "../../config/axios/jwtAxios";
import { nodeConfig } from "../../config/env";
import { useAlertStore } from "../../stores/alertStore";
import { ResponseStatus } from "../common/ResponseStatus";
import { AnalyticFileFrontendFields } from "./AnalyticFileFrontendFields";

class AnalyticFileManager {
  constructor() {}

  public new = (
    form?: AnalyticFileTypes.IAnalyticFileFrontendFields
  ): AnalyticFileTypes.IAnalyticFileFrontendFields => {
    if (form) {
      return new AnalyticFileFrontendFields().build(form);
    } else {
      return new AnalyticFileFrontendFields();
    }
  };

  public createFormData = (preFormData: AnalyticFileTypes.PreFormData) => {
    const formData = new FormData();
    formData.append("id", JSON.stringify(preFormData.fields.id));
    formData.append("progName", JSON.stringify(preFormData.fields.progName));
    formData.append("catName", JSON.stringify(preFormData.fields.catName));
    formData.append("subName", JSON.stringify(preFormData.fields.subName));
    formData.append("normalizedFileName", JSON.stringify(preFormData.fields.normalizedFileName));
    formData.append("fileType", JSON.stringify(preFormData.fields.fileType));
    formData.append("file", preFormData.file);
    return formData;
  };
  public post = async (
    formData: FormData,
    status: boolean = false
  ): Promise<AnalyticFileTypes.IAnalyticFileEntity[]> => {
    const response = await jwtAxios.post(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.AnalyticFile}`,
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

  public put = async (
    formData: FormData,
    status: boolean = false
  ): Promise<AnalyticFileTypes.IAnalyticFileEntity[]> => {
    const response = await jwtAxios.put(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.AnalyticFile}`,
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

  public restore = async (id: number, status: boolean = false): Promise<boolean> => {
    const response = await jwtAxios.put(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.AnalyticFile}/restore/${id}`
    );
    if (status) {
      useAlertStore().process(
        new ResponseStatus({
          code: response.status,
          message: response.data.statusMessage,
        })
      );
    }
    return await response.data.edited;
  };

  public delete = async (
    id: number,
    status: boolean = false
  ): Promise<AnalyticFileTypes.IAnalyticFileEntity[]> => {
    const response = await jwtAxios.delete(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.AnalyticFile}/${id}`
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

  public get = async (
    status: boolean = false
  ): Promise<AnalyticFileTypes.IAnalyticFileEntity[]> => {
    const response = await jwtAxios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.AnalyticFile}`
    );
    if (status) {
      useAlertStore().process(
        new ResponseStatus({
          code: response.status,
          message: response.data.statusMessage,
        })
      );
    }
    return await response.data.got;
  };
  public getById = async (
    id: number,
    status: boolean = false
  ): Promise<AnalyticFileTypes.IAnalyticFileEntity[]> => {
    const response = await jwtAxios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.AnalyticFile}/by/${id}`
    );
    if (status) {
      useAlertStore().process(
        new ResponseStatus({
          code: response.status,
          message: response.data.statusMessage,
        })
      );
    }
    return await response.data.got;
  };
  public getByProgAndCatAndSub = async (
    progName: string,
    catName: string,
    subName: string,
    status: boolean = false
  ): Promise<AnalyticFileTypes.IAnalyticFileEntity[]> => {
    const response = await jwtAxios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.AnalyticFile}/by/${progName}/${catName}/${subName}`
    );
    if (status) {
      useAlertStore().process(
        new ResponseStatus({
          code: response.status,
          message: response.data.statusMessage,
        })
      );
    }
    return await response.data.got;
  };
}

export { AnalyticFileManager };
