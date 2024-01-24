import { MigrationInterface, QueryRunner } from "typeorm";

export class Affiliate1701316417744 implements MigrationInterface {
    name = 'Affiliate1701316417744'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "affiliates" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "priceService" numeric NOT NULL DEFAULT '0', "balanceAffi" numeric NOT NULL DEFAULT '0', "content" character varying(256), "fromId" integer, "toId" integer, CONSTRAINT "PK_127fbba4e71f16e17f02ea2564a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "affiliates" ADD CONSTRAINT "FK_261a664b1b7cf96810735fb097a" FOREIGN KEY ("fromId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "affiliates" ADD CONSTRAINT "FK_99a4bfd72f50dbbc9ba22d9252b" FOREIGN KEY ("toId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "affiliates" DROP CONSTRAINT "FK_99a4bfd72f50dbbc9ba22d9252b"`);
        await queryRunner.query(`ALTER TABLE "affiliates" DROP CONSTRAINT "FK_261a664b1b7cf96810735fb097a"`);
        await queryRunner.query(`DROP TABLE "affiliates"`);
    }

}
