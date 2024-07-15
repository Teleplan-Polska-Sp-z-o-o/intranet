import { useRoute } from "vue-router";
import { nodeConfig } from "../../../config/env";
import { useAlertStore } from "../../../stores/alertStore";

class DocumentViewerBase {
  // constants
  protected MESSAGE_BASE = "document_viewer";
  protected BACKEND_PATH: string = `${nodeConfig.origin}:${nodeConfig.port}/uploads/documents/`;
  // doc info
  protected fileName: string = "";
  protected fileLangs: string = "";
  protected fileUUID: string = "";

  constructor() {
    const route = useRoute();
    const params = route.params;

    const getParam = (param: string | string[]) => {
      return typeof param === "string" ? param : (param.at(0) as string);
    };

    if (!params.fileName || !params.fileLangs || !params.fileUUID) {
      const message = `${this.MESSAGE_BASE}.parameters_missing`;
      useAlertStore().process(message);
    } else {
      this.fileName = getParam(params.fileName);
      this.fileLangs = getParam(params.fileLangs);
      this.fileUUID = getParam(params.fileUUID);
    }
  }
}

export { DocumentViewerBase };
