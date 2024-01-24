import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDiscount1703492241782 implements MigrationInterface {
    name = 'AddDiscount1703492241782'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_histories" ADD "discount" numeric NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_histories" DROP COLUMN "discount"`);
    }

}
