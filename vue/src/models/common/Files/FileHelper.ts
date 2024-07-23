import axios from "axios";
import { Endpoints } from "../../../config/Endpoints";
import { nodeConfig } from "../../../config/env";

enum TypeEndpoint {
  pdf = "/documents",
  docx = "/docx_documents",
}

class FileHelper {
  filename: string;
  type: "docx" | "pdf";
  blob: Blob | null;
  file: File | null;

  constructor(filename: string, type: "docx" | "pdf") {
    this.filename = filename;
    this.type = type;
    this.blob = null;
    this.file = null;
  }

  async retrieveFromServer(): Promise<this> {
    try {
      const endpoint = TypeEndpoint[this.type];
      const fileUrl = `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.uploads}${endpoint}/${this.filename}`;
      const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
      const fileContent = response.data;
      this.blob = new Blob([fileContent]);
      this.file = new File([this.blob], this.filename, { type: response.headers["content-type"] });
    } catch (error) {
      console.error(`Error fetching blob at retrieveFileFromServer at FileHelper, ${error}`);
    } finally {
      return this;
    }
  }

  getRetrieved(): { file: File | null; blob: Blob | null } {
    return { file: this.file, blob: this.blob };
  }

  downloadBlob(blob: Blob): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = this.filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  }
}

export { FileHelper };
