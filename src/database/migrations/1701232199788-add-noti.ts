import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNoti1701232199788 implements MigrationInterface {
  name = "AddNoti1701232199788";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "notis" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "title" character varying, "content" character varying, "isSeen" boolean NOT NULL DEFAULT false, "userId" integer, CONSTRAINT "PK_3ea7466b6294820549eb0719ae6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "notis" ADD CONSTRAINT "FK_1665b180c09bde4bf10e245b130" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notis" DROP CONSTRAINT "FK_1665b180c09bde4bf10e245b130"`,
    );
    await queryRunner.query(`DROP TABLE "notis"`);
  }
}
