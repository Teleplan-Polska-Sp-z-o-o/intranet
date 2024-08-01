import axios from "axios";
import { Endpoints } from "../../../config/Endpoints";
import { nodeConfig } from "../../../config/env";
import { CommonTypes } from "../../../interfaces/common/CommonTypes";

class FileHelper {
  filename: string;
  folder: "dc" | "doc";
  accept: CommonTypes.FileTypes.AcceptedType[];

  blob: Blob | null;
  file: File | null;

  constructor(
    filename: string,
    folder: "dc" | "doc",
    accept: CommonTypes.FileTypes.AcceptedType[]
  ) {
    this.filename = filename;
    this.folder = folder;
    this.accept = accept;
    this.blob = null;
    this.file = null;
  }

  private getFileExtension(): string {
    const lastDotIndex = this.filename.lastIndexOf(".");
    if (lastDotIndex === -1) return ""; // No dot found
    return this.filename.slice(lastDotIndex + 1);
  }

  async retrieveFromServer(): Promise<this> {
    try {
      const fileExtension = `.${this.getFileExtension()}` as CommonTypes.FileTypes.AcceptedType;

      if (!this.accept.includes(fileExtension)) {
        throw new Error(`File type ${fileExtension} not accepted.`);
      }

      const endpoint = CommonTypes.FileTypes.DocEndpoint[this.folder];
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
