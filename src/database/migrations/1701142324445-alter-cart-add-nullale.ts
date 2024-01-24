import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterCartAddNullale1701142324445 implements MigrationInterface {
    name = 'AlterCartAddNullale1701142324445'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "carts" ALTER COLUMN "quantity" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "carts" ALTER COLUMN "link" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "carts" ALTER COLUMN "link" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "carts" ALTER COLUMN "quantity" SET NOT NULL`);
    }

}
