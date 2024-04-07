import { IResponseStatus } from "../../interfaces/common/IResponseStatus";

class ResponseStatus implements IResponseStatus {
  code: number;
  message: string;

  constructor(resStatus: IResponseStatus) {
    this.code = resStatus.code;
    this.message = resStatus.message;
  }
}

export { ResponseStatus };
