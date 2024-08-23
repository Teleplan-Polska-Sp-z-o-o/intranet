// import { IChip, IChips, TDocumentType } from "../../interfaces/document/DocumentTypes";
// import { nodeConfig } from "../../config/env";
// import { Endpoints } from "../../config/axios/Endpoints";
// import { Chip } from "./Chip";
// import { ResponseStatus } from "../common/ResponseStatus";
// import { IResponseStatus } from "../../interfaces/common/IResponseStatus";
// import { useAlertStore } from "../../stores/alertStore";
// import jwtAxios from "../../config/axios/jwtAxios";

// class SubcategoriesManager {
//   constructor() {}

//   public new = () => new Chip();

//   public post = async (
//     reqData: any,
//     status: boolean = false
//   ): Promise<Array<IChip> | IResponseStatus> => {
//     const requestData = {
//       name: reqData.name,
//       departmentName: reqData.departmentName,
//       categoryName: reqData.categoryName,
//     };

//     const response = await jwtAxios.post(
//       `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.DocumentSubcategory}`,
//       requestData
//     );
//     if (status) {
//       // return new ResponseStatus({
//       //   code: response.status,
//       //   message: response.data.statusMessage,
//       // });
//       useAlertStore().process(
//         new ResponseStatus({
//           code: response.status,
//           message: response.data.statusMessage,
//         })
//       );
//     }
//     return response.data.added;
//   };

//   public get = async (reqData: IChips, whereDocType?: TDocumentType): Promise<Array<IChip>> => {
//     const departmentName: string = reqData.departmentName;
//     const categoryName: string = reqData.categoryName;
//     const response = await jwtAxios.get(
//       `${nodeConfig.origin}:${nodeConfig.port}${
//         Endpoints.DocumentSubcategory
//       }/${departmentName}/${categoryName}${whereDocType ? `/${whereDocType}` : ""}`
//     );
//     return response.data.got;
//   };

//   public put = async (
//     reqData: any,
//     status: boolean = false
//   ): Promise<Array<IChip> | IResponseStatus> => {
//     const id: string = reqData.id;
//     const name: string = reqData.name;
//     const response = await jwtAxios.put(
//       `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.DocumentSubcategory}/${id}/${name}`
//     );
//     if (status) {
//       // return new ResponseStatus({
//       //   code: response.status,
//       //   message: response.data.statusMessage,
//       // });
//       useAlertStore().process(
//         new ResponseStatus({
//           code: response.status,
//           message: response.data.statusMessage,
//         })
//       );
//     }
//     return response.data.edited;
//   };

//   public delete = async (
//     id: number,
//     status: boolean = false
//   ): Promise<Array<IChip> | IResponseStatus> => {
//     const response = await jwtAxios.delete(
//       `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.DocumentSubcategory}/${id}`
//     );
//     if (status) {
//       // return new ResponseStatus({
//       //   code: response.status,
//       //   message: response.data.statusMessage,
//       // });
//       useAlertStore().process(
//         new ResponseStatus({
//           code: response.status,
//           message: response.data.statusMessage,
//         })
//       );
//     }
//     return response.data.deleted;
//   };
// }

// export { SubcategoriesManager };
