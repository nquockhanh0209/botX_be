import { MigrationInterface, QueryRunner } from "typeorm";

export class Withdrawn1701334991791 implements MigrationInterface {
    name = 'Withdrawn1701334991791'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "affiliates" DROP CONSTRAINT "FK_261a664b1b7cf96810735fb097a"`);
        await queryRunner.query(`ALTER TABLE "affiliates" DROP CONSTRAINT "FK_99a4bfd72f50dbbc9ba22d9252b"`);
        await queryRunner.query(`CREATE TABLE "withdrawns" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "amountVnd" numeric NOT NULL DEFAULT '0', "balanceAffiWithdrawn" numeric NOT NULL DEFAULT '0', "content" character varying(256), "bankName" character varying(225) NOT NULL, "accountName" character varying(225) NOT NULL, "accountNumber" character varying(225) NOT NULL, "userId" integer, CONSTRAINT "PK_29253d92bb54f6c135fc6b9318c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "affiliates" ADD CONSTRAINT "FK_100066018c42d433433ab26cfb6" FOREIGN KEY ("fromId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "affiliates" ADD CONSTRAINT "FK_8eeeb9e0139952ce58390eed097" FOREIGN KEY ("toId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "withdrawns" ADD CONSTRAINT "FK_954845063974a3b760cb4826746" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "withdrawns" DROP CONSTRAINT "FK_954845063974a3b760cb4826746"`);
        await queryRunner.query(`ALTER TABLE "affiliates" DROP CONSTRAINT "FK_8eeeb9e0139952ce58390eed097"`);
        await queryRunner.query(`ALTER TABLE "affiliates" DROP CONSTRAINT "FK_100066018c42d433433ab26cfb6"`);
        await queryRunner.query(`DROP TABLE "withdrawns"`);
        await queryRunner.query(`ALTER TABLE "affiliates" ADD CONSTRAINT "FK_99a4bfd72f50dbbc9ba22d9252b" FOREIGN KEY ("toId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "affiliates" ADD CONSTRAINT "FK_261a664b1b7cf96810735fb097a" FOREIGN KEY ("fromId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
