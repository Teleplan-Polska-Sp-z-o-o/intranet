import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreatorDrafts1734436418444 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the Draft table
    await queryRunner.createTable(
      new Table({
        name: "document_creator_draft",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "uuid",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "name",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "stepper",
            type: "json",
            isNullable: false,
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
            comment: "The user and date when the draft was created",
          },
          {
            name: "updatedBy",
            type: "json",
            isNullable: true,
            comment: "The users and dates when the draft was updated",
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("draft", true);
  }
}
