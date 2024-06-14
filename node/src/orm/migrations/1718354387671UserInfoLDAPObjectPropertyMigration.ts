import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UserInfoLDAPObjectPropertyMigration1718354387671 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "user_info",
      new TableColumn({
        name: "LDAPObject",
        type: "jsonb",
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("user_info", "LDAPObject");
  }
}
