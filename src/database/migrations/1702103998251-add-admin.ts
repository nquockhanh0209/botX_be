import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAdmin1702103998251 implements MigrationInterface {
  name = "AddAdmin1702103998251";
  //pass admin: admin@12345

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO users (email, username, password,"refId",role)
        VALUES ('admin@gmail.com', 'admin_x','9580ab5d9db022c73d6678b07c86c9db' ,'ADMIN','admin');`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
