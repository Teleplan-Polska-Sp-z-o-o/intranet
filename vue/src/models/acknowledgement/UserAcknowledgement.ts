import { CommonTypes } from "../../interfaces/common/CommonTypes";
import { SimpleUser } from "../user/SimpleUser";
import { ToAcknowledge } from "./ToAcknowledge";

export class UserAcknowledgement {
  id: number;
  toAcknowledge: ToAcknowledge;
  user: SimpleUser;
  acknowledged: boolean;
  createdBy: CommonTypes.Api.OrmTypes.IOrmUserAction;
  updatedBy: CommonTypes.Api.OrmTypes.IOrmUserAction[];

  constructor(
    id: number = 0,
    toAcknowledge: ToAcknowledge = new ToAcknowledge(),
    user: SimpleUser = new SimpleUser(),
    acknowledged: boolean = false,
    createdBy: CommonTypes.Api.OrmTypes.IOrmUserAction = {
      user: {
        id: 0,
        username: "",
        domain: "",
      },
      date: new Date(),
    },
    updatedBy: CommonTypes.Api.OrmTypes.IOrmUserAction[] = []
  ) {
    this.id = id;
    this.toAcknowledge = toAcknowledge;
    this.user = user;
    this.acknowledged = acknowledged;
    this.createdBy = createdBy;
    this.updatedBy = updatedBy;
  }

  /**
   * Creates FormData object for sending data to the backend.
   *
   * @returns {FormData} FormData object containing user acknowledgement data.
   */
  createEndpointData(): FormData {
    const formData = new FormData();
    formData.append("id", JSON.stringify(this.id));
    formData.append("toAcknowledgeId", JSON.stringify(this.toAcknowledge.id));
    formData.append("userId", JSON.stringify(this.user.id));
    formData.append("acknowledged", JSON.stringify(this.acknowledged));
    return formData;
  }
}
