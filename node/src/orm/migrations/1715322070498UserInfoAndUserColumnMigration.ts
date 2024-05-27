import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm";

export class UserInfoAndUserColumn1715322070498 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "user_info",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          { name: "position", type: "varchar", isNullable: true },
          { name: "department", type: "varchar", isNullable: true },
          { name: "decisionMaker", type: "boolean", isNullable: true },
        ],
      })
    );

    await queryRunner.addColumn(
      "user",
      new TableColumn({
        name: "infoId",
        type: "int",
        isNullable: true,
      })
    );

    await queryRunner.createForeignKey(
      "user",
      new TableForeignKey({
        columnNames: ["infoId"],
        referencedColumnNames: ["id"],
        referencedTableName: "user_info",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    let table = await queryRunner.getTable("user");
    const foreignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf("infoId") !== -1);
    await queryRunner.dropForeignKey("user", foreignKey);
    await queryRunner.dropTable("user_info");
    await queryRunner.dropColumn("user", "infoId");
  }
}
