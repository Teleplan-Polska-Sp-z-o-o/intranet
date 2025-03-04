import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class MSTranslatorUsage1741008397457 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "ms_translator_usage",
        columns: [
          {
            name: "id",
            type: "serial",
            isPrimary: true,
          },
          {
            name: "charactersUsed",
            type: "int",
            default: 0,
            isNullable: false,
          },
          {
            name: "resultedInError",
            type: "boolean",
            isNullable: false,
          },
          {
            name: "errorMessage",
            type: "text",
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
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
          {
            name: "ormVersion",
            type: "int",
            isNullable: false,
            default: 1,
          },
          {
            name: "createdBy",
            type: "json",
            isNullable: false,
            comment: "User and date when the record was created",
          },
          {
            name: "updatedBy",
            type: "json",
            isNullable: true,
            comment: "Users and dates when the record was last updated",
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("ms_translator_usage", true);
  }
}
