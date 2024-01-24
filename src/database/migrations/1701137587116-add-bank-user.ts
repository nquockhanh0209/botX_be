import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBankUser1701137587116 implements MigrationInterface {
    name = 'AddBankUser1701137587116'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "bankName" character varying(225)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "accountName" character varying(225)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "accountNumber" character varying(225)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "accountNumber"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "accountName"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "bankName"`);
    }

}
