import fs from "fs";
import chokidar from "chokidar";
import { dataSource } from "../../../config/dataSource";
import { AnalyticFile } from "../../../orm/entity/analytic/AnalyticFileEntity";
import { putAnalyticFile } from "../../../controllers/analytic/AnalyticFileController";
import { HttpResponseMessage } from "../../../enums/response";
import { Request, Response } from "express";
import { AnalyticFileHelper } from "../packed/AnalyticFileHelper";
import { IUser } from "../../../interfaces/user/UserTypes";

export namespace FileService {
  type RawBody = {
    // progName: string;
    // catName: string;
    // subName: string;
    id: string;
    normalizedFileName: string;
    fileType: string;
  };
  interface MulterFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
    path: string;
    copy: boolean;
  }

  class MockRequest {
    body: RawBody;
    user: IUser = {
      id: 0,
      username: "BYD-Intranet",
    };
    files: MulterFile[];
    constructor(
      // progName: string,
      // catName: string,
      // subName: string,
      id: number,
      normalizedFileName: string,
      file: MulterFile,
      fileType: string
    ) {
      this.body = {
        // progName,
        // catName,
        // subName,
        id: JSON.stringify(id),
        normalizedFileName: JSON.stringify(normalizedFileName),
        fileType: JSON.stringify(fileType),
      };
      this.files = [file];
    }
  }

  // class MockResponse {
  //   statusCode?: number;
  //   status(code: number): this {
  //     this.statusCode = code;
  //     return this;
  //   }
  //   json(object: object) {
  //     return object;
  //   }
  // }

  class MockResponse {
    statusCode?: number;
    responseData?: object;

    status(code: number): this {
      this.statusCode = code;
      return this;
    }

    // Capture the JSON response data in responseData
    json(object: object): this {
      this.responseData = object;
      return this;
    }

    // Method to retrieve the captured response data
    getResponseData() {
      return this.responseData;
    }
  }

  export class FileWatcherService {
    // private watcher: FSWatcher;

    private progName: string;
    private catName: string;
    private subName: string;
    private fileType: string;
    private fileName: string;
    private directoryPath: string;

    private fileOfType: AnalyticFile;
    private bufferPath: string;
    private fileBuffer: Buffer;

    constructor(
      progName: string,
      catName: string,
      subName: string,
      fileType: string,
      fileName: string,
      directoryPath: string
    ) {
      this.progName = progName;
      this.catName = catName;
      this.subName = subName;
      this.fileType = fileType;
      this.fileName = fileName;
      this.directoryPath = directoryPath;

      // Get the considered file information first
      this.retrieveConsideredFile().then(() => {
        // Watch for changes only on files that match the pattern
        this.setupWatcher();
      });
    }

    // Watch for file changes that match the pattern
    private setupWatcher() {
      if (!this.fileOfType || !this.fileName || !this.fileOfType.normalizedFileName) {
        console.error("File of type not found, cannot setup watcher.");
        return;
      }

      // Read all files in the directory
      // const files = fs.readdirSync(this.directoryPath);
      // console.log("files", files);

      // Exact file path to watch
      const filePath = `${this.directoryPath}/${this.fileName}.xlsx`;
      console.log(`watched file: ${filePath}`);
      // console.log(`Watching for changes on file: ${filePath}`);
      if (!fs.existsSync(filePath)) {
        console.error(`File does not exist: ${filePath}`);
      }

      // Watch the exact file using chokidar
      chokidar
        .watch(filePath, {
          persistent: true, // Keeps the watcher active
          usePolling: true, // Enables polling
          interval: 30000, // Set polling interval to half a minute (30000 ms)
          awaitWriteFinish: {
            stabilityThreshold: 2000, // Waits 2 seconds after the last write event
            pollInterval: 1000, // Poll every 1 second while the file is being written
          },
          atomic: false,
        })
        .on("change", (filePath: string, stats) => {
          console.log(`change of ${filePath}`);
          // console.dir(stats, { depth: null, colors: true });
          this.handleFileUpdate(filePath);
        })
        .on("add", (filePath: string, stats) => {
          console.log(`add of ${filePath}`);
          // console.dir(stats, { depth: null, colors: true });
          this.handleFileUpdate(filePath);
        });
    }

    // Handle file changes or additions
    private async handleFileUpdate(filePath: string) {
      try {
        const shouldProceed = await this.retrieveBuffer_1(filePath);
        if (shouldProceed) {
          await this.uploadChangedFile_2();
        }
      } catch (error) {
        console.error(`Error handling file update: ${error}`);
      }
    }

    // Retrieve the latest considered file from the database
    private async retrieveConsideredFile() {
      const analyticFiles = await dataSource
        .getRepository(AnalyticFile)
        .find({ where: { progName: this.progName, catName: this.catName, subName: this.subName } });

      const consideredFiles = AnalyticFileHelper.addConsideredProperty(analyticFiles);

      this.fileOfType = consideredFiles.find(
        (file: AnalyticFile & { considered: boolean }) =>
          file.fileType === this.fileType && file.considered
      );

      return this.fileOfType;
    }

    // Retrieve file buffer
    private async retrieveBuffer_1(filePath: string) {
      if (!this.fileOfType) {
        console.error(
          `Error: Cannot find the latest AnalyticFile of type "${this.fileType}" for ${this.progName}/${this.catName}/${this.subName}`
        );
        return false;
      }

      // Check if the filePath matches the file we're interested in
      if (!filePath.includes(this.fileName)) {
        return false;
      }

      this.bufferPath = filePath;
      this.fileBuffer = await fs.promises.readFile(filePath);
      return true;
    }

    // Upload the changed file to the API
    private async uploadChangedFile_2() {
      const mockFile: MulterFile = {
        fieldname: "file",
        originalname: this.fileOfType.fileName,
        encoding: "7bit",
        mimetype: "text/plain",
        buffer: this.fileBuffer,
        size: this.fileBuffer.length,
        path: this.bufferPath,
        copy: true,
      };

      const mockRequest = new MockRequest(
        this.fileOfType.id,
        this.fileOfType.normalizedFileName,
        mockFile,
        this.fileOfType.fileType
      ) as Request;

      const mockResponse = new MockResponse();

      type FilesResponseObject = {
        edited: [AnalyticFile];
        message: string;
        statusMessage: HttpResponseMessage;
      };

      await (putAnalyticFile(
        mockRequest,
        mockResponse as unknown as Response
      ) as unknown as Promise<FilesResponseObject>);

      // Access the response data from the mock response object
      const responseData = mockResponse.getResponseData() as FilesResponseObject;

      // Now, check if `statusMessage` exists and handle success or failure
      if (responseData.statusMessage !== HttpResponseMessage.PUT_SUCCESS) {
        console.error(`Failed to update file by FileService: ${responseData.message}`);
      } else {
        console.log(
          `File successfully updated by FileService: ${this.fileOfType.normalizedFileName}`
        );
      }

      // if (response.statusMessage !== HttpResponseMessage.PUT_SUCCESS) {
      //   console.error(`Failed to update file: ${response.message}`);
      // } else {
      //   console.log(`File successfully updated: ${this.fileOfType.normalizedFileName}`);
      // }
    }
  }
}
