import { MigrationInterface, QueryRunner } from "typeorm";

export class WithdrawnStatus1701337432439 implements MigrationInterface {
    name = 'WithdrawnStatus1701337432439'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."withdrawns_statuswithdrawn_enum" AS ENUM('pending', 'done', 'cancel')`);
        await queryRunner.query(`ALTER TABLE "withdrawns" ADD "statusWithdrawn" "public"."withdrawns_statuswithdrawn_enum" NOT NULL DEFAULT 'pending'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "withdrawns" DROP COLUMN "statusWithdrawn"`);
        await queryRunner.query(`DROP TYPE "public"."withdrawns_statuswithdrawn_enum"`);
    }

}
