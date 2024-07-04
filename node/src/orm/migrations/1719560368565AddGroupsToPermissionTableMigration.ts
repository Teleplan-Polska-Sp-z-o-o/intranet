import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class AddGroupsToPermissionTable1719560368565 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "user_group",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "name",
            type: "varchar",
          },
          {
            name: "permissionId",
            type: "int",
            isNullable: true,
          },
        ],
      }),
      true
    );
    await queryRunner.createTable(
      new Table({
        name: "user_subgroup",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "name",
            type: "varchar",
          },
          {
            name: "groupId",
            type: "int",
            isNullable: true,
          },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      "user_group",
      new TableForeignKey({
        columnNames: ["permissionId"],
        referencedColumnNames: ["id"],
        referencedTableName: "user_permission",
        onDelete: "CASCADE",
      })
    );
    await queryRunner.createForeignKey(
      "user_subgroup",
      new TableForeignKey({
        columnNames: ["groupId"],
        referencedColumnNames: ["id"],
        referencedTableName: "user_group",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const grpForeignKey = (await queryRunner.getTable("user_group")).foreignKeys.find(
      (fk) => fk.columnNames.indexOf("permissionId") !== -1
    );

    if (grpForeignKey) {
      await queryRunner.dropForeignKey("user_group", grpForeignKey);
    }

    const subGrpForeignKey = (await queryRunner.getTable("user_subgroup")).foreignKeys.find(
      (fk) => fk.columnNames.indexOf("groupId") !== -1
    );
    await queryRunner.dropForeignKey("user_subgroup", subGrpForeignKey);

    await queryRunner.dropTable("user_subgroup");
    await queryRunner.dropTable("user_group");
  }
}
