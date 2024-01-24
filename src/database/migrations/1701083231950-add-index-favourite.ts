import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexFavourite1701083231950 implements MigrationInterface {
    name = 'AddIndexFavourite1701083231950'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c35aefd8818f16ad18584882fd" ON "user_favourites" ("userId", "serviceId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_c35aefd8818f16ad18584882fd"`);
    }

}
