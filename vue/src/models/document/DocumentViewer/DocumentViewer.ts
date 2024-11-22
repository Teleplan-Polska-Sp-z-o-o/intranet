import { DocumentManager } from "../DocumentManager";
import { DocumentViewerBase } from "./DocumentViewerBase";
import { useUserStore } from "../../../stores/userStore";
import { IUserEntity } from "../../../interfaces/user/IUserEntity";
import { TConfidentiality } from "../../../interfaces/user/UserTypes";
import { useAlertStore } from "../../../stores/alertStore";
import { ResponseStatus } from "../../common/ResponseStatus";
import { EDocumentType } from "../../../interfaces/document/DocumentTypes";
import { CommonTypes } from "../../../interfaces/common/CommonTypes";
import jwtAxios from "../../../config/axios/jwtAxios";

class DocumentViewer extends DocumentViewerBase {
  private source: string = "";

  // private buildSource(): DocumentViewer {
  //   if (this.fileName && this.fileLangs && this.fileUUID) {
  //     const file = `${this.fileName}_qs_langs=${this.fileLangs}&uuid=${this.fileUUID}`;
  //     this.source = `${this.BACKEND_PATH}${file}.pdf`;
  //   }
  //   return this;
  // }

  constructor() {
    super();
  }

  private async buildSource(): Promise<DocumentViewer> {
    if (this.fileName && this.fileLangs && this.fileUUID) {
      const baseFileName = `${this.fileName}_qs_langs=${this.fileLangs}&uuid=${this.fileUUID}`;
      const extensions = Object.values(CommonTypes.FileTypes.EAcceptedFileType) as string[]; // Get allowed extensions

      const BACKEND_PATH = this.BACKEND_PATH;

      let fileSource: string | null = null;

      for (const ext of extensions) {
        const filePath = `${BACKEND_PATH}${baseFileName}${ext}`;
        try {
          // Check if the file exists
          const response = await jwtAxios.head(filePath); // Use HEAD request
          if (response.status === 200) {
            fileSource = filePath; // If file exists, set source and break
            break;
          }
        } catch (error) {
          console.warn(`File not found: ${filePath}`);
        }
      }

      if (fileSource) {
        this.source = fileSource;
      } else {
        console.error("No file found for the given parameters.");
      }
    }
    return this;
  }

  public async getSource() {
    await this.buildSource();
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
