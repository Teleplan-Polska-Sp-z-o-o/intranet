import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class MigrationName1713018107529 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "user_notification",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "state",
            type: "varchar",
          },
          {
            name: "source",
            type: "varchar",
          },
          {
            name: "action",
            type: "varchar",
          },
          {
            name: "title",
            type: "varchar",
          },
          {
            name: "subtitle",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "link",
            type: "varchar",
          },
          {
            name: "receivedDate",
            type: "varchar",
          },
          {
            name: "userId",
            type: "int",
          },
        ],
        foreignKeys: [
          {
            columnNames: ["userId"],
            referencedColumnNames: ["id"],
            referencedTableName: "user",
            onDelete: "CASCADE",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("user_notification");
  }
}
