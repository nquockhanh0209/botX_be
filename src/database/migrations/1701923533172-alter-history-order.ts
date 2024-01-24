import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterHistoryOrder1701923533172 implements MigrationInterface {
    name = 'AlterHistoryOrder1701923533172'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_histories" ADD "inQueue" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_histories" DROP COLUMN "inQueue"`);
    }

}
