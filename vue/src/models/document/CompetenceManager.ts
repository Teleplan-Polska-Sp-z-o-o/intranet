import { nodeConfig } from "../../config/env";
import { Endpoints } from "../../config/axios/Endpoints";
import { ResponseStatus } from "../common/ResponseStatus";
import { Competence } from "./Competence";
import { DocumentTypes, IChips } from "../../interfaces/document/DocumentTypes";
import { useAlertStore } from "../../stores/alertStore";
import jwtAxios from "../../config/axios/jwtAxios";
import axios from "axios";
import { Chips } from "./Chips";

class CompetenceManager {
  constructor() {}

  public new = (): DocumentTypes.ICompetenceEntity => new Competence();

  public post = async (
    reqData: FormData,
    status: boolean = false
  ): Promise<DocumentTypes.ICompetenceEntity[]> => {
    try {
      const response = await jwtAxios.post(
        `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Competence}`,
        reqData
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
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && status) {
        useAlertStore().process(
          new ResponseStatus({
            code: error.response.status,
            message: error.response.data.statusMessage,
          })
        );
      }

      console.error(`post at CompetenceManager, error: ${error}`);
      return [];
    }
  };

  public get = async (chips: IChips = new Chips()): Promise<DocumentTypes.ICompetenceEntity[]> => {
    const folderStructure: string = JSON.stringify(Object.values(chips));
    const response = await jwtAxios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Competence}/${folderStructure}`
    );
    return response.data.got;
  };

  public put = async (
    reqData: FormData,
    status: boolean = false
  ): Promise<DocumentTypes.ICompetenceEntity[]> => {
    try {
      const response = await jwtAxios.put(
        `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Competence}`,
        reqData
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
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && status) {
        useAlertStore().process(
          new ResponseStatus({
            code: error.response.status,
            message: error.response.data.statusMessage,
          })
        );
      }

      console.error(`put at CompetenceManager, error: ${error}`);
      return [];
    }
  };

  public delete = async (
    id: number,
    status: boolean = false
  ): Promise<DocumentTypes.ICompetenceEntity[]> => {
    try {
      const response = await jwtAxios.delete(
        `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Competence}/${id}`
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
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && status) {
        useAlertStore().process(
          new ResponseStatus({
            code: error.response.status,
            message: error.response.data.statusMessage,
          })
        );
      }

      console.error(`delete at CompetenceManager, error: ${error}`);
      return [];
    }
  };
}

export { CompetenceManager };
