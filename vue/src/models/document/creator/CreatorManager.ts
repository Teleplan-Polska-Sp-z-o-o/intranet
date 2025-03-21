import axios, { AxiosResponse } from "axios";
import { Endpoints } from "../../../config/axios/Endpoints";
import jwtAxios from "../../../config/axios/jwtAxios";
import { nodeConfig } from "../../../config/env";
import { useAlertStore } from "../../../stores/alertStore";
import { ResponseStatus } from "../../common/ResponseStatus";
import { IDraftEntity } from "../../../interfaces/document/creator/IDraftEntity";
import { DocumentCreatorStepper } from "../../../components/views/tools/matrix/document/creator/tabs/new/StepperTypes";

enum EMSErrorCodes {
  INVALID_API_KEY = "INVALID_API_KEY_TYPE",
  INVALID_BASE_ENDPOINT = "INVALID_BASE_ENDPOINT_TYPE",
  INVALID_VERSION = "INVALID_VERSION_TYPE",
  INVALID_HTTP_CLIENT = "INVALID_HTTP_CLIENT",
  INVALID_ENDPOINTS = "INVALID_ENDPOINTS_TYPE",
  INVALID_CONTENT_TYPE = "INVALID_CONTENT_TYPE",
  UNDETECTABLE_CONTENT_TYPE = "UNDETECTABLE_CONTENT_TYPE",
  FETCH_ERROR = "FETCH_ERROR",
  TRANSLATE_ERROR = "TRANSLATE_ERROR",
  DETECT_ERROR = "DETECT_ERROR",
  UNSUPPORTED_LANGUAGE = "UNSUPPORTED_LANGUAGE",
  BAD_REQUEST = "BAD_REQUEST",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  REQUEST_TIMEOUT = "REQUEST_TIMEOUT",
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",
  NO_RESPONSE = "NO_RESPONSE",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

interface IMSErrorDetails {
  receivedType: string;
  receivedValue: any;
}
interface IMSTranslatorErrorJSON {
  name: string;
  message: string;
  code: string;
  details?: IMSErrorDetails;
  stack?: string;
}

class DocumentCreatorManager {
  constructor() {}

  private isMSTranslatorError(response: any): response is IMSTranslatorErrorJSON {
    return (
      response &&
      typeof response === "object" &&
      "name" in response &&
      "message" in response &&
      "code" in response &&
      Object.values(EMSErrorCodes).includes(response.code as EMSErrorCodes)
    );
  }

  private alert = (response: AxiosResponse<any, any>, status: boolean) => {
    if (status) {
      if (this.isMSTranslatorError(response.data)) {
        useAlertStore().process(
          new ResponseStatus({
            code: response.status,
            message: `Translation Error: ${response.data.message}, code: ${response.data.code}`,
          })
        );
      } else {
        useAlertStore().process(
          new ResponseStatus({
            code: response.status,
            message: response.data.statusMessage,
          })
        );
      }
    }
  };

  public post = async (data: FormData, status: boolean = false): Promise<IDraftEntity[]> => {
    try {
      const response = await jwtAxios.post(
        `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.AddDraft}`,
        data
      );
      this.alert(response, status);

      return response.data.saved;
    } catch (error: any) {
      const response = error.response || null;

      this.alert(response, status);

      return response;
    }
  };

  public get = async (data: FormData): Promise<IDraftEntity[]> => {
    const response = await jwtAxios.post(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.GetDrafts}`,
      data
    );
    return response.data.retrieved;
  };

  public put = async (id: number, data: FormData, status: boolean = false): Promise<void> => {
    const response = await jwtAxios.put(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.PutDrafts}/${id}`,
      data
    );
    this.alert(response, status);

    return;
  };

  public changeStatusOfDraft = async (
    id: number,
    targetDraftStatus: DocumentCreatorStepper.EStepperStatus,
    data: FormData,
    status: boolean = false
  ): Promise<void> => {
    const response = await jwtAxios.put(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.ChangeStatusOfDraft}/${id}/${targetDraftStatus}`,
      data
    );
    this.alert(response, status);

    return;
  };

  public downloadGeneratedDocuments = async (
    id: number,
    data: FormData,
    status: boolean = false
  ): Promise<void> => {
    const response = await jwtAxios.post(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.DownloadGeneratedDocuments}/${id}`,
      data,
      {
        responseType: "blob",
      }
    );
    const blob = new Blob([response.data], { type: "application/zip" });

    // Generate a temporary download link
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);

    this.alert(response, status);
  };

  public checkRevision = async (docId: string, revision: string): Promise<boolean> => {
    const response: AxiosResponse<{
      isValid: boolean;
      statusMessage: string;
    }> = await jwtAxios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.CheckDraftRevision}/${docId}/${revision}`
    );
    return response.data.isValid;
  };

  // public addFiles = async (docId: string, revision: string): Promise<boolean> => {
  //   const response: AxiosResponse<{
  //     isValid: boolean;
  //     statusMessage: string;
  //   }> = await jwtAxios.get(
  //     `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.CheckDraftRevision}/${docId}/${revision}`
  //   );
  //   console.log("checkRevision", response.data);
  //   return response.data.isValid;
  // };

  public delete = async (id: number, status: boolean = false): Promise<void> => {
    const response = await jwtAxios.delete(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.DeleteDrafts}/${id}`
    );
    this.alert(response, status);

    return;
  };

  public generate = async (
    id: number,
    language: string,
    status: boolean = false,
    returnFile: boolean = false,
    fileName: string = "GeneratedDocument"
  ): Promise<void | File> => {
    try {
      const response: AxiosResponse<{
        generated: string;
        message: string;
        statusMessage: string;
      }> = await jwtAxios.post(
        `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.GenerateDrafts}/${id}/${language}`
      );

      this.alert(response, status);

      const base64Data = response.data.generated;

      // Convert the base64 string to a Blob
      const byteCharacters = atob(base64Data); // Decode base64
      const byteNumbers = new Array(byteCharacters.length)
        .fill(0)
        .map((_, i) => byteCharacters.charCodeAt(i));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // MIME type for .docx
      });

      const file = new File([blob], `${fileName}_${language}.docx`, {
        type: blob.type,
      });

      if (returnFile) {
        // Return File object to caller
        return file;
      }

      // Create a temporary download link
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${fileName}_${language}.docx`; // Filename for the downloaded document
      document.body.appendChild(link);
      link.click();

      // Clean up the temporary link
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      return;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response && status) {
        useAlertStore().process(
          new ResponseStatus({
            code: error.response.status,
            message: error.response.data.statusMessage, // "template_not_found"
          })
        );
      }

      console.error("Error generating and downloading document:", error);
    }
  };
}

export { DocumentCreatorManager };
