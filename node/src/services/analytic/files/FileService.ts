import fs from "fs";
import path from "path";
import { SimpleUser } from "../../../models/user/SimpleUser";
import chokidar, { FSWatcher } from "chokidar";
import { dataSource } from "../../../config/dataSource";
import { AnalyticFile } from "../../../orm/entity/analytic/AnalyticFileEntity";
import { putAnalyticFile } from "../../../controllers/analytic/AnalyticFileController";
import { HttpResponseMessage } from "../../../enums/response";
import { Request, Response } from "express";
import { AnalyticFileHelper } from "../packed/AnalyticFileHelper";

export namespace FileService {
  type RawBody = {
    progName: string;
    catName: string;
    subName: string;
    normalizedFileName: string;
    issuer: SimpleUser;
    file: Buffer;
    fileType: string;
  };

  class MockRequest {
    body: RawBody;
    constructor(
      progName: string,
      catName: string,
      subName: string,
      normalizedFileName: string,
      file: Buffer,
      fileType: string
    ) {
      const issuer = new SimpleUser().build({
        id: 0,
        username: "BYD-Intranet",
      });

      this.body = {
        progName,
        catName,
        subName,
        normalizedFileName,
        issuer,
        file,
        fileType,
      };
    }
  }

  class MockResponse {
    statusCode?: number;
    status(code: number): this {
      this.statusCode = code;
      return this;
    }
    json(object: object) {
      return object;
    }
  }

  export class FileWatcherService {
    private watcher: FSWatcher;

    private progName: string;
    private catName: string;
    private subName: string;
    private fileType: string;
    private directoryPath: string;

    private fileOfType: AnalyticFile;
    private fileBuffer: Buffer;

    constructor(
      progName: string,
      catName: string,
      subName: string,
      fileType: string,
      directoryPath: string
    ) {
      this.watcher = chokidar.watch(this.directoryPath, {
        persistent: true,
      });
      this.setupWatcher();

      this.progName = progName;
      this.catName = catName;
      this.subName = subName;
      this.fileType = fileType;
      this.directoryPath = directoryPath;
    }

    // Watch for file changes in the given directory
    private setupWatcher() {
      this.watcher.on("change", (filePath: string) => this.handleFileUpdate(filePath));
    }

    // Function to handle file addition or update
    private async handleFileUpdate(filePath: string) {
      try {
        const shouldProceed = this.retrieveBuffer_1(filePath);
        if (shouldProceed) this.uploadChangedFile_2();
      } catch (error) {
        console.error(`Error handling change of file: ${error}`);
      }
    }

    private async retrieveBuffer_1(filePath: string) {
      const analyticFiles = await dataSource
        .getRepository(AnalyticFile)
        .find({ where: { progName: this.progName, catName: this.catName, subName: this.subName } });

      // Use the helper to get the latest file
      const consideredFiles = AnalyticFileHelper.addConsideredProperty(analyticFiles);

      this.fileOfType = consideredFiles.find(
        (file: AnalyticFile & { considered: boolean }) =>
          file.fileType === this.fileType && file.considered
      );

      if (!this.fileOfType) {
        console.error(
          `Error 01: Cannot find the latest AnalyticFile of type "${this.fileType}" for ${this.progName}/${this.catName}/${this.subName}`
        );
        return false;
      }

      if (!filePath.includes(this.fileOfType.fileName)) return false;

      this.fileBuffer = await fs.promises.readFile(filePath);
      return true;
    }

    private async uploadChangedFile_2() {
      const mockRequest = new MockRequest(
        this.progName,
        this.catName,
        this.subName,
        this.fileOfType.normalizedFileName,
        this.fileBuffer,
        this.fileOfType.fileType
      ) as Request;
      const mockResponse = new MockResponse() as Response;
      type FilesResponseObject = {
        edited: [AnalyticFile];
        message: string;
        statusMessage: HttpResponseMessage;
      };

      const response = await (putAnalyticFile(
        mockRequest,
        mockResponse
      ) as unknown as Promise<FilesResponseObject>);

      if (response.statusMessage !== HttpResponseMessage.PUT_SUCCESS) {
        console.error(`Failed to update file, ${response.message}`);
      }
    }
  }
}
