import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class Acknowledgement1724839913977 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the Quiz table
    await queryRunner.createTable(
      new Table({
        name: "quiz",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
            unsigned: true,
          },
          {
            name: "ref",
            type: "varchar",
            length: "255",
            isUnique: true,
            isNullable: false,
            comment: "Reference string",
          },
          {
            name: "name",
            type: "varchar",
            length: "255",
            isUnique: true,
            isNullable: false,
            comment: "Unique name of the quiz",
          },
          {
            name: "folderStructure",
            type: "text",
            isArray: true,
            isNullable: false,
          },
          {
            name: "quiz",
            type: "json",
            isNullable: true,
            comment: "Quiz object",
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updatedAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true
    );

    // Create the ToAcknowledge table
    await queryRunner.createTable(
      new Table({
        name: "to_acknowledge",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
            unsigned: true,
          },
          {
            name: "description",
            type: "text",
            isNullable: true,
            comment: "Description or purpose of the acknowledgment or change",
          },
          {
            name: "acknowledgementStartDate",
            type: "timestamp",
            isNullable: true,
            comment: "The timestamp when the acknowledgment should start appearing after login",
          },
          {
            name: "isSafetyDocument",
            type: "boolean",
            default: false,
            comment: "Indicates if the document is related to safety",
          },
          {
            name: "closed",
            type: "boolean",
            default: false,
            comment: "Indicates if the acknowledgement is closed",
          },
          {
            name: "acknowledgementClosedDate",
            type: "timestamp",
            isNullable: true,
            comment: "The timestamp when the acknowledgement closed",
          },
          {
            name: "quizId",
            type: "int",
            isNullable: true,
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updatedAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true
    );

    // Create the UserAcknowledgement table
    await queryRunner.createTable(
      new Table({
        name: "user_acknowledgement",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
            unsigned: true,
          },
          {
            name: "toAcknowledgeId",
            type: "int",
            isNullable: false,
          },
          {
            name: "userId",
            type: "int",
            isNullable: false,
          },
          {
            name: "acknowledged",
            type: "boolean",
            comment: "Indicates if the document has been acknowledged",
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updatedAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true
    );

    // Create the join table for the ManyToMany relationship between ToAcknowledge and Document
    await queryRunner.createTable(
      new Table({
        name: "to_acknowledge_documents",
        columns: [
          {
            name: "toAcknowledgeId",
            type: "int",
            isPrimary: true,
            unsigned: true,
          },
          {
            name: "documentId",
            type: "int",
            isPrimary: true,
            unsigned: true,
          },
        ],
      }),
      true
    );

    // Add foreign key constraints
    await queryRunner.createForeignKey(
      "to_acknowledge",
      new TableForeignKey({
        columnNames: ["quizId"],
        referencedColumnNames: ["id"],
        referencedTableName: "quiz",
        onDelete: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "to_acknowledge_documents",
      new TableForeignKey({
        columnNames: ["toAcknowledgeId"],
        referencedColumnNames: ["id"],
        referencedTableName: "to_acknowledge",
        onDelete: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "to_acknowledge_documents",
      new TableForeignKey({
        columnNames: ["documentId"],
        referencedColumnNames: ["id"],
        referencedTableName: "document",
        onDelete: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "user_acknowledgement",
      new TableForeignKey({
        columnNames: ["toAcknowledgeId"],
        referencedColumnNames: ["id"],
        referencedTableName: "to_acknowledge",
        onDelete: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "user_acknowledgement",
      new TableForeignKey({
        columnNames: ["userId"],
        referencedColumnNames: ["id"],
        referencedTableName: "user",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign keys
    const userAcknowledgementTable = await queryRunner.getTable("user_acknowledgement");
    const userAcknowledgementToAcknowledgeFK = userAcknowledgementTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("toAcknowledgeId") !== -1
    );
    const userAcknowledgementToUserFK = userAcknowledgementTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("userId") !== -1
    );

    await queryRunner.dropForeignKey("user_acknowledgement", userAcknowledgementToAcknowledgeFK);
    await queryRunner.dropForeignKey("user_acknowledgement", userAcknowledgementToUserFK);

    const toAcknowledgeTable = await queryRunner.getTable("to_acknowledge");
    const toAcknowledgeQuizFK = toAcknowledgeTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("quizId") !== -1
    );

    await queryRunner.dropForeignKey("to_acknowledge", toAcknowledgeQuizFK);

    const toAcknowledgeDocumentsTable = await queryRunner.getTable("to_acknowledge_documents");
    const toAcknowledgeDocumentsToAcknowledgeFK = toAcknowledgeDocumentsTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("toAcknowledgeId") !== -1
    );
    const toAcknowledgeDocumentsToDocumentFK = toAcknowledgeDocumentsTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("documentId") !== -1
    );

    await queryRunner.dropForeignKey(
      "to_acknowledge_documents",
      toAcknowledgeDocumentsToAcknowledgeFK
    );
    await queryRunner.dropForeignKey(
      "to_acknowledge_documents",
      toAcknowledgeDocumentsToDocumentFK
    );

    // Drop the tables
    await queryRunner.dropTable("user_acknowledgement");
    await queryRunner.dropTable("to_acknowledge_documents");
    await queryRunner.dropTable("to_acknowledge");
    await queryRunner.dropTable("quiz");
  }
}
