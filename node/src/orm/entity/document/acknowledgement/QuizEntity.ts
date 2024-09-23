import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm";
import { AbstractBaseOrmEntity } from "../../../../interfaces/common/AbstractOrm";
import { QuizTypes } from "../../../../interfaces/QuizTypes";
import { File } from "multer";
import * as fs from "fs";
import path from "path";
import { QUIZZES_FOLDER, UPLOADS_PATH } from "../../../../config/routeConstants";

@Entity()
class Quiz extends AbstractBaseOrmEntity {
  @PrimaryGeneratedColumn({
    type: "int",
    comment: "Primary key of the entity",
    unsigned: true,
  })
  id: number;

  @Column({
    type: "varchar",
    length: 255,
    nullable: false,
    unique: true,
    comment: "Reference string",
  })
  ref: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: false,
    unique: true,
    comment: "Unique name of the quiz",
  })
  name: string;

  @Column("text", { array: true })
  folderStructure: string[];

  @Column({
    type: "json",
    nullable: true,
    comment: "Quiz object",
  })
  quiz: QuizTypes.IQuiz | null;

  constructor() {
    super();
  }

  /**
   * Upserts the quiz object and quiz name.
   *
   * @param {string} name - The unique name of the quiz.
   * @param {QuizTypes.IQuiz} quiz - The quiz object associated with the name.
   * @param {string} ref - The reference string.
   * @returns {this} The current instance with updated values.
   */
  upsertQuiz(name: string, folderStructure: string[], quiz: QuizTypes.IQuiz, ref: string): this {
    this.name = name;
    this.folderStructure = folderStructure;
    this.quiz = quiz;
    if (!this.ref) this.ref = ref;
    return this;
  }

  /**
   * Saves quiz files to the specified QUIZZES_FOLDER.
   *
   * @param {File[]} files - Array of files to save.
   * @returns {boolean} True if the operation was successful, false otherwise.
   */
  saveQuizFiles(files: File[]): boolean {
    try {
      function getFileName(file: File) {
        const originalName = file.originalname;
        const parsedName = path.parse(originalName).name;
        const index = parsedName.indexOf("_qs_");
        if (index !== -1) {
          // Remove _qs_ and everything after it
          return parsedName.substring(0, index);
        }
        return parsedName;
      }

      for (const file of files) {
        const name = getFileName(file);
        const queryString = new URLSearchParams({ uuid: this.ref }).toString();
        const extension = path.extname(file.originalname);
        const saveAs = `${name}_qs_${queryString}${extension}`;

        fs.renameSync(file.path, path.join(UPLOADS_PATH, QUIZZES_FOLDER, saveAs));
      }

      return true;
    } catch (error) {
      console.error("Error saving quiz files: ", error);
      return false;
    }
  }

  /**
   * Retrieves the names or full paths of quiz files associated with the current `ref`.
   *
   * @param {boolean} withDirectory - If `true`, returns the full paths to the quiz files including the directory. If `false`, returns only the file names.
   * @returns {string[]} An array of file names or paths associated with the current `ref`.
   */
  getQuizFileNamesOrPaths(withDirectory: boolean): string[] {
    const directory = path.join(UPLOADS_PATH, QUIZZES_FOLDER);
    const files = fs.readdirSync(directory);
    const fileNamesWithRef = files.filter((file) => file.includes(this.ref));

    return withDirectory
      ? fileNamesWithRef.map((fileName) => path.join(directory, fileName))
      : fileNamesWithRef;
  }

  /**
   * Deletes quiz files based on the UUID.
   *
   * @returns {boolean} True if the operation was successful, false otherwise.
   */
  deleteQuizFiles(): boolean {
    try {
      const filesToDelete = this.getQuizFileNamesOrPaths(true);
      for (const filePath of filesToDelete) {
        fs.unlinkSync(filePath);
      }

      return true;
    } catch (error) {
      console.error("Error deleting quiz files: ", error);
      return false;
    }
  }
}

export { Quiz };
