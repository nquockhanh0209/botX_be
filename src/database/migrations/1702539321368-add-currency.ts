import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCurrency1702539321368 implements MigrationInterface {
    name = 'AddCurrency1702539321368'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "currencies" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "rate" numeric NOT NULL DEFAULT '0', "name" character varying NOT NULL DEFAULT '0', CONSTRAINT "PK_d528c54860c4182db13548e08c4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "payments" RENAME COLUMN "amountVnd" TO "amountDeposit"`);
        await queryRunner.query(`ALTER TABLE "payments" ADD currency character varying(24)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN currency`);
        await queryRunner.query(`ALTER TABLE "payments" RENAME COLUMN "amountDeposit" TO amountVnd`);
        await queryRunner.query(`DROP TABLE "currencies"`);
    }

}
