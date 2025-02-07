import { AxiosResponse } from "axios";
import { Endpoints } from "../../../config/axios/Endpoints";
import jwtAxios from "../../../config/axios/jwtAxios";
import { nodeConfig } from "../../../config/env";
import { useAlertStore } from "../../../stores/alertStore";
import { ResponseStatus } from "../../common/ResponseStatus";
import { IDraftEntity } from "./IDraftEntity";

class DocumentCreatorManager {
  constructor() {}

  private alert = (response: AxiosResponse<any, any>, status: boolean) => {
    if (status) {
      useAlertStore().process(
        new ResponseStatus({
          code: response.status,
          message: response.data.statusMessage,
        })
      );
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

  public get = async (): Promise<IDraftEntity[]> => {
    const response = await jwtAxios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.GetDrafts}`
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
    status: boolean = false
  ): Promise<void> => {
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

      // Create a temporary download link
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `GeneratedDocument.docx`; // Filename for the downloaded document
      document.body.appendChild(link);
      link.click();

      // Clean up the temporary link
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      return;
    } catch (error) {
      console.error("Error generating and downloading document:", error);
    }
  };
}

export { DocumentCreatorManager };
