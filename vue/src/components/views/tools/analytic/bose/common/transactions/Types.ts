import { CommonTypes } from "../../../../../../../interfaces/common/CommonTypes";

export namespace AnalyticTypes {
  export type TPrograms = "bose";
  export type TGroups = "combined";
  export type TManager = CommonTypes.Api.GetManager &
    CommonTypes.Api.CreateFormDataManager & { program: TPrograms };
}
