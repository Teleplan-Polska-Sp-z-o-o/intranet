import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { Confidentiality1718179454316 } from "./1718179454316ConfidentialityMigration";

export class Editor1711454048711 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "news",
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
          },
          // {
          //   name: "permission",
          //   type: "jsonb",
          // },
          {
            name: "confidentiality",
            type: "varchar",
          },
          {
            name: "title",
            type: "varchar",
          },
          {
            name: "subtitle",
            type: "varchar",
          },
          {
            name: "content",
            type: "text",
          },
          {
            name: "bgImage",
            type: "varchar",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("news");
  }
}
