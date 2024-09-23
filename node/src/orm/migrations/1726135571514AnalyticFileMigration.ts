import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AnalyticFile1726135571514 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "analytic_file",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "ref",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "progName",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "catName",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "subName",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "fileType",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "fileName",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "normalizedFileName",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "fileDir",
            type: "varchar",
            length: "500",
            isNullable: false,
          },
          {
            name: "excelObjectJson",
            type: "jsonb",
            isNullable: true,
          },
          {
            name: "jsObjectJson",
            type: "jsonb",
            isNullable: true,
          },
          {
            name: "archive",
            type: "jsonb",
            isNullable: true,
          },
          {
            name: "fileVersion",
            type: "int",
          },
          {
            name: "createdBy",
            type: "jsonb",
            isNullable: false,
          },
          {
            name: "updatedBy",
            type: "jsonb",
            isNullable: true,
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
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("analytic_file");
  }
}
