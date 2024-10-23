import { Entity, PrimaryGeneratedColumn, Column, Unique, EntityManager } from "typeorm";
import { AbstractBaseOrmEntityWithUser } from "../../../interfaces/common/AbstractOrm";
import { AnalyticTypes } from "../../../interfaces/analytic/AnalyticTypes";
import { v4 as uuidv4 } from "uuid";
import { File } from "multer";
import * as fs from "fs";
import path from "path";
import { UPLOADS_PATH, ANALYTIC_DOCUMENTS_FOLDER } from "../../../config/routeConstants";
import ExcelReader from "../../../models/xlsx/ExcelReader";

@Entity()
class AnalyticFile extends AbstractBaseOrmEntityWithUser implements AnalyticTypes.IAnalyticFile {
  @PrimaryGeneratedColumn({
    type: "int",
    comment: "Primary key of the entity",
    unsigned: true,
  })
  id: number;

  @Column({
    type: "varchar",
    comment: "UUID reference string to connect the entity with the associated file",
  })
  ref: string;

  @Column({
    type: "varchar",
    length: 255,
    comment: "Name of the program",
  })
  progName: string;

  @Column({
    type: "varchar",
    length: 255,
    comment: "Name of the category",
  })
  catName: string;

  @Column({
    type: "varchar",
    length: 255,
    comment: "Name of the subcategory",
  })
  subName: string;

  @Column({
    type: "varchar",
    length: 255,
    comment: "Type of the file, unique within the sub-tab",
  })
  fileType: string; // unique within subTabName

  @Column({
    type: "varchar",
    length: 255,
    comment: "Dir file name",
  })
  fileName: string;

  @Column({
    type: "varchar",
    length: 255,
    comment: "Normalized file name for user-friendly display",
  })
  normalizedFileName: string;

  @Column({
    type: "varchar",
    length: 500,
    comment: "Directory path where the file is stored",
  })
  fileDir: string;

  @Column({
    type: "jsonb",
    nullable: false,
    comment: "Excel file data stored as JSON",
  })
  excelObjectJson: string;

  @Column({
    type: "jsonb",
    nullable: false,
    comment: "JavaScript object representation of the file data stored as JSON",
  })
  jsObjectJson: string;

  @Column({
    type: "jsonb",
    nullable: true,
    comment:
      "Archived data of the latest version of the file, including excelObjectJson and jsObjectJson",
  })
  archive: {
    fileName: string;
    normalizedFileName: string;
    fileDir: string;
    fileVersion: number;
    excelObjectJson: string;
    jsObjectJson: string;
  } | null;

  @Column({
    type: "int",
    comment: "Tracks the current version of the file",
  })
  fileVersion: number;

  constructor() {
    super();
  }

  // Step 1 (Go to Step 3 if update)
  createReference(): this {
    if (!this.ref) this.ref = uuidv4();
    return this;
  }

  // Step 2 (Go to Step 3 if update)
  specifySource(progName: string, catName: string, subName: string): this {
    this.progName = progName;
    this.catName = catName;
    this.subName = subName;
    return this;
  }

  /**
   * Reads the Excel file and transforms it into JSON format for excelObjectJson and jsObjectJson.
   * It reads all the data from the Excel file and saves both the raw data and the transformed data.
   */
  private async readAndSaveExcelAndJsJson(): Promise<void> {
    const excelReader = new ExcelReader(this.fileName, this.fileDir);
    const readResult = await excelReader.read(); // Read the Excel file
    if (readResult.data) {
      // Save the Excel data in both formats
      this.excelObjectJson = JSON.stringify(readResult.data); // Save the raw data as JSON
      this.jsObjectJson = JSON.stringify(excelReader.transformAllSheetsToObjects(readResult.data)); // Save the transformed data as JSON
    } else {
      throw new Error(`AnalyticFileError (4): Failed to read Excel file: ${readResult.message}`);
    }
  }

  private archiveFile() {
    this.archive = {
      fileName: this.fileName,
      normalizedFileName: this.normalizedFileName,
      fileDir: this.fileDir,
      fileVersion: this.fileVersion,
      excelObjectJson: this.excelObjectJson,
      jsObjectJson: this.jsObjectJson,
    };
  }

  /**
   * Swaps the current version with the previous (archived) version.
   * This method restores the previous version from the `archive` field
   * and moves the current version to the `archive`.
   */
  restoreFile(): this {
    if (!this.archive) {
      throw new Error("AnalyticFileError (6): No previous version available for restoration.");
    }

    // Temporary save archive version
    const previousArchiveFileName = this.archive.fileName;
    const previousArchiveNormalizedFileName = this.archive.normalizedFileName;
    const previousArchiveFileDir = this.archive.fileDir;
    const previousArchiveExcelObjectJson = this.archive.excelObjectJson;
    const previousArchiveJsObjectJson = this.archive.jsObjectJson;

    // Save the current version to the archive
    this.archiveFile();

    const incrementedFileNameVersion = (fileName: string) => {
      return fileName.replace(/_ver=(\d+)/, (_match, p1) => `_ver=${+p1 + 2}`);
    };

    // Restore archived data
    this.fileDir = previousArchiveFileDir;
    this.fileName = incrementedFileNameVersion(previousArchiveFileName);

    this.normalizedFileName = previousArchiveNormalizedFileName;
    this.excelObjectJson = previousArchiveExcelObjectJson;
    this.jsObjectJson = previousArchiveJsObjectJson;
    this.fileVersion += 2;

    fs.renameSync(
      path.join(this.fileDir, previousArchiveFileName),
      path.join(this.fileDir, this.fileName)
    );

    return this;
  }

  private upsertFile(multerFile: File, originalFileName: string): void {
    function getFileName() {
      const parsedName = path.parse(originalFileName).name;
      const index = parsedName.indexOf("_qs_");
      if (index !== -1) {
        // Remove _qs_ and everything after it
        return parsedName.substring(0, index);
      }
      return parsedName;
    }

    const name = getFileName();

    if (this.fileVersion > 0) {
      this.archiveFile();
    }

    if (!this.fileVersion) {
      this.fileVersion = 0;
    }
    this.fileVersion += 1;

    const params = { ver: this.fileVersion.toString(), ref: this.ref };
    const queryString = new URLSearchParams(params).toString();
    const extension = path.extname(originalFileName);
    const saveAs = `${name}_qs_${queryString}${extension}`;
    // Rename and move file to destination folder or overwrite existing file
    const dir = path.join(UPLOADS_PATH, ANALYTIC_DOCUMENTS_FOLDER);

    if (!fs.existsSync(dir)) {
      throw new Error(`AnalyticFileError (5): Directory does not exist: ${dir}`);
    }

    if (multerFile.copy === true) fs.copyFileSync(multerFile.path, path.join(dir, saveAs));
    else fs.renameSync(multerFile.path, path.join(dir, saveAs));

    this.fileDir = dir;
    this.fileName = saveAs;
  }

  private deleteOldFile(): this {
    if (this.archive && this.archive.fileVersion) {
      const versionToDelete = this.archive.fileVersion - 1; // Calculate older than the archived version
      if (versionToDelete >= 1) {
        const filesInDir = fs.readdirSync(this.fileDir);

        const oldFile = filesInDir.find(
          (file) => file.includes(`ref=${this.ref}`) && file.includes(`_ver=${versionToDelete}`)
        );

        if (oldFile) {
          const oldFilePath = path.join(this.fileDir, oldFile); // Construct full file path
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath); // Delete the old file
          } else {
            throw new Error(
              `AnalyticFileError (7): Old version file not found at path ${oldFilePath}.`
            );
          }
        }
      }
    }

    return this;
  }

  // Step 3
  async processFile(multerFile: File, fileType: string, normalizedFileName: string): Promise<this> {
    this.fileType = fileType;
    const originalFileName = multerFile.originalname;
    this.upsertFile(multerFile, originalFileName);
    this.normalizedFileName = normalizedFileName;
    await this.readAndSaveExcelAndJsJson();
    return this.deleteOldFile();
  }

  deleteFiles(): this {
    try {
      const dirPath = this.fileDir;
      // Read all files in the directory
      const filesInDir = fs.readdirSync(dirPath);
      // Filter the files that contain the ref in their filename
      const filesToDelete = filesInDir.filter((file) => file.includes(this.ref));

      // Iterate and delete each file that matches the ref
      filesToDelete.forEach((file) => {
        const filePath = path.join(dirPath, file);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    } catch (error) {
      throw new Error(`AnalyticFileError (8): Failed to delete the file(s): ${error.message}`);
    }

    return this;
  }
}

export { AnalyticFile };
