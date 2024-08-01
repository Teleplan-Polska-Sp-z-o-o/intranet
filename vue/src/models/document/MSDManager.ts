import axios from "axios";
import { nodeConfig } from "../../config/env";
import { Endpoints } from "../../config/Endpoints";
import { IDocumentEntity } from "../../interfaces/document/IDocumentEntity";
import { useUserStore } from "../../stores/userStore";
import { DocumentManager } from "./DocumentManager";

class MSDManager extends DocumentManager {
  public get = async (reqData: any): Promise<Array<IDocumentEntity>> => {
    let lvl: number = 0;
    if (reqData.departmentName) lvl = 1;
    if (reqData.categoryName) lvl = 2;
    if (reqData.subcategoryName) lvl = 3;

    const userInfo = useUserStore().info();
    let confidentiality = "public";
    if (userInfo) confidentiality = userInfo.permission.confidentiality;

    let params: string = `/MSD/true/${confidentiality}`;
    switch (lvl) {
      case 1:
        params = `/by/${reqData.departmentName}/MSD/true/${confidentiality}`;
        break;
      case 2:
        params = `/by/${reqData.departmentName}/${reqData.categoryName}/MSD/true/${confidentiality}`;
        break;
      case 3:
        params = `/by/${reqData.departmentName}/${reqData.categoryName}/${reqData.subcategoryName}/MSD/true/${confidentiality}`;
        break;

      default:
        break;
    }

    const response = await axios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Document}${params}`
    );
    return response.data.documents;
  };
}

export { MSDManager };
