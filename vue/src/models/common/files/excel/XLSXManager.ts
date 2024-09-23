//"/read/:fileName/:fileDir/:_worksheetNameOrIndex?/:_rowCount?/:_columnCount?",

import { Endpoints } from "../../../../config/axios/Endpoints";
import jwtAxios from "../../../../config/axios/jwtAxios";
import { nodeConfig } from "../../../../config/env";

class XLSXManager {
  constructor() {}

  public read = async (formData: FormData): Promise<any> => {
    const response = await jwtAxios.post(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.XLSX}/read`,
      formData
    );
    return response.data.data;
  };
}

export { XLSXManager };
