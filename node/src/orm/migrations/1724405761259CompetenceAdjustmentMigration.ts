import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class CompetenceAdjustment1724405761259 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "competence",
      new TableColumn({
        name: "code",
        type: "varchar",
      })
    );

    await queryRunner.addColumn(
      "competence",
      new TableColumn({
        name: "position",
        type: "varchar",
      })
    );

    await queryRunner.addColumn(
      "competence",
      new TableColumn({
        name: "subcategoryId",
        type: "int",
        isNullable: true,
      })
    );
    await queryRunner.addColumn(
      "competence",
      new TableColumn({
        name: "categoryId",
        type: "int",
        isNullable: true,
      })
    );
    await queryRunner.addColumn(
      "competence",
      new TableColumn({
        name: "departmentId",
        type: "int",
        isNullable: true,
      })
    );

    await queryRunner.addColumn(
      "competence",
      new TableColumn({
        name: "folderStructure",
        type: "text[]",
        isNullable: false,
        default: "'{}'",
      })
    );

    // Creating foreign keys
    await queryRunner.createForeignKey(
      "competence",
      new TableForeignKey({
        columnNames: ["subcategoryId"],
        referencedColumnNames: ["id"],
        referencedTableName: "subcategory",
        onDelete: "SET NULL",
      })
    );

    await queryRunner.createForeignKey(
      "competence",
      new TableForeignKey({
        columnNames: ["categoryId"],
        referencedColumnNames: ["id"],
        referencedTableName: "category",
        onDelete: "SET NULL",
      })
    );

    await queryRunner.createForeignKey(
      "competence",
      new TableForeignKey({
        columnNames: ["departmentId"],
        referencedColumnNames: ["id"],
        referencedTableName: "department",
        onDelete: "SET NULL",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Dropping foreign keys
    const table = await queryRunner.getTable("competence");

    const subcategoryForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("subcategoryId") !== -1
    );
    if (subcategoryForeignKey) {
      await queryRunner.dropForeignKey("competence", subcategoryForeignKey);
    }

    const categoryForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("categoryId") !== -1
    );
    if (categoryForeignKey) {
      await queryRunner.dropForeignKey("competence", categoryForeignKey);
    }

    const departmentForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("departmentId") !== -1
    );
    if (departmentForeignKey) {
      await queryRunner.dropForeignKey("competence", departmentForeignKey);
    }

    // Dropping columns
    await queryRunner.dropColumn("competence", "code");
    await queryRunner.dropColumn("competence", "position");
    await queryRunner.dropColumn("competence", "subcategoryId");
    await queryRunner.dropColumn("competence", "categoryId");
    await queryRunner.dropColumn("competence", "departmentId");
    await queryRunner.dropColumn("competence", "folderStructure");
  }
}
