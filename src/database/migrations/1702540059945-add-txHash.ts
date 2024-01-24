import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTxHash1702540059945 implements MigrationInterface {
    name = 'AddTxHash1702540059945'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" ADD "txHash" character varying(256)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "txHash"`);
    }

}
