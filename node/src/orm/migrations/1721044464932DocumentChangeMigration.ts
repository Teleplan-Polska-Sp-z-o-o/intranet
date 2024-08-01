import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

export class DocumentChange1721044464932 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "document_change",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "ormCreateDate",
            type: "timestamp",
            isNullable: false,
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "ormUpdateDate",
            type: "timestamp",
            isNullable: true,
            default: null,
          },
          {
            name: "ormVersion",
            type: "int",
            isNullable: false,
            default: 1,
          },
          {
            name: "no",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "year",
            type: "int",
            isNullable: false,
          },
          {
            name: "originator",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "priority",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "affected",
            type: "text",
            isNullable: false,
          },
          {
            name: "docxNumber",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "docxRevision",
            type: "int",
            isNullable: false,
          },
          {
            name: "docxReference",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "checker",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "checkerComment",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "checked",
            type: "boolean",
            isNullable: true,
          },
          {
            name: "checkedDate",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "approver",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "approverComment",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "approved",
            type: "boolean",
            isNullable: true,
          },
          {
            name: "approvedDate",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "registerer",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "registered",
            type: "boolean",
            isNullable: false,
          },
          {
            name: "registeredDate",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "timeline",
            type: "jsonb",
            isNullable: false,
          },
          {
            name: "affectedCompetences",
            type: "jsonb",
            isNullable: true,
          },
          {
            name: "requireAcknowledgmentOrTraining",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "trainingDetails",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "status",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "fileNames",
            type: "jsonb",
            isNullable: false,
          },
          {
            name: "docxSource",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "tags",
            type: "varchar",
            isNullable: true,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("document_change");
  }
}
