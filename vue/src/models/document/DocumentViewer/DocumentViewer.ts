import { DocumentManager } from "../DocumentManager";
import { DocumentViewerBase } from "./DocumentViewerBase";
import { useUserStore } from "../../../stores/userStore";
import { IUserEntity } from "../../../interfaces/user/IUserEntity";
import { TConfidentiality } from "../../../interfaces/user/UserTypes";
import { useAlertStore } from "../../../stores/alertStore";
import { ResponseStatus } from "../../common/ResponseStatus";
import { EDocumentType } from "../../../interfaces/document/DocumentTypes";

class DocumentViewer extends DocumentViewerBase {
  private source: string = "";

  private buildSource(): DocumentViewer {
    if (this.fileName && this.fileLangs && this.fileUUID) {
      const file = `${this.fileName}_qs_langs=${this.fileLangs}&uuid=${this.fileUUID}`;
      this.source = `${this.BACKEND_PATH}${file}.pdf`;
    }
    return this;
  }

  constructor() {
    super();
    this.buildSource();
  }

  public getSource() {
    return this.source;
  }

  async amIAuthorized(): Promise<boolean> {
    try {
      const documentConfidentiality: TConfidentiality = (
        await new DocumentManager(Object.values(EDocumentType)).getByUuidAndLangs(
          this.fileUUID,
          this.fileLangs
        )
      ).confidentiality;

      const getListOfConfidentialitiesThatCanAccess = () => {
        switch (documentConfidentiality) {
          case "restricted":
            return ["restricted", "secret"];
          case "secret":
            return ["secret"];

          default:
            return ["public", "restricted", "secret"];
        }
      };

      const userInfo: IUserEntity | false = useUserStore().info();
      if (!userInfo) {
        throw new Error("unknown");
      }

      const userConfidentiality = userInfo.permission.confidentiality;

      const pass = getListOfConfidentialitiesThatCanAccess().includes(userConfidentiality);
      if (!pass) throw new Error("unauthorized");

      return true;
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message === "unknown" || error.message === "unauthorized")
      ) {
        useAlertStore().process(new ResponseStatus({ code: 400, message: error.message }));
      } else {
        console.log(`DocumentViewer at amIAuthorized, ${error}`);
      }

      return false;
    }
  }
}

export { DocumentViewer };
