import axios from "axios";
import { Endpoints } from "../../../config/Endpoints";
import { nodeConfig } from "../../../config/env";
import { ResponseStatus } from "../../common/ResponseStatus";
import { useAlertStore } from "../../../stores/alertStore";
import { DocumentChange } from "./DocumentChange";
import { BaseManager } from "../../common/BaseManager";
import { DocumentChangeTypes } from "../../../interfaces/change/dcr/DocumentChangeTypes";

class DocumentChangeManager extends BaseManager<DocumentChangeTypes.TDocumentChange> {
  constructor() {
    super();
  }
  protected endpoint = Endpoints.ChangeDocument;

  public new = () => new DocumentChange();

  /**
   *
   * @param formData (IDocumentChangeRequest) formData.append("obj"
   * @param status (boolean) true if alert, else false
   * @returns (Promise<IDocumentChangeRequest>)
   */
  public post = async (
    formData: FormData,
    status: boolean = false
  ): Promise<DocumentChangeTypes.TDocumentChange> => {
    const response = await axios.post(
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
  };

  /**
   *
   * @param formData (IDocumentChangeRequest) formData.append("obj"
   * @param status (boolean) true if alert, else false
   * @returns (Promise<IDocumentChangeRequest>)
   */
  public put = async (
    formData: FormData,
    status: boolean = false
  ): Promise<DocumentChangeTypes.TDocumentChange> => {
    const response = await axios.put(
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
  };

  /**
   *
   * @param id (number)
   * @param status (boolean) true if alert, else false
   * @returns (Promise<IDocumentChangeRequest>)
   */
  public delete = async (
    id: number,
    status: boolean = false
  ): Promise<DocumentChangeTypes.TDocumentChange> => {
    const response = await axios.delete(
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

  /**
   * Retrieves all unregistered DocumentChange
   *
   * @returns Sorted DocumentChange by creation date (descending) and by request priority (high, medium, low).
   *
   */
  public get = async (): Promise<Array<DocumentChange>> => {
    const response = await axios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${this.endpoint}/unregistered`
    );
    return response.data.got;
  };

  /**
   *
   * @param formData (Assessment) formData.append("assessment"
   * @param status (boolean) true if alert, else false
   * @returns (Promise<IDocumentChangeRequest>)
   */
  public assess = async (
    formData: FormData,
    status: boolean = true
  ): Promise<{ assessed: DocumentChange }> => {
    const response = await axios.put(
      `${nodeConfig.origin}:${nodeConfig.port}${this.endpoint}/assess`,
      formData
    );
    if (status) {
      useAlertStore().process(
        new ResponseStatus({
          code: response.status,
          message: response.data.statusMessage,
        })
      );
      return {
        assessed: response.data.assessed,
      };
    }
    return response.data.assessed;
  };

  /**
   *
   * @param id (number)
   * @param status (boolean) false if no alert, else true
   * @returns (Promise<IDocumentChangeRequest>)
   */
  public registration = async (
    id: number,
    registered: boolean,
    status: boolean = true
  ): Promise<DocumentChange> => {
    const response = await axios.put(
      `${nodeConfig.origin}:${nodeConfig.port}${this.endpoint}/registration/${id}/${registered}`
    );
    if (status) {
      useAlertStore().process(
        new ResponseStatus({
          code: response.status,
          message: response.data.statusMessage,
        })
      );
    }
    return response.data.registered;
  };
}

export { DocumentChangeManager };
