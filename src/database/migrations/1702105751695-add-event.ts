import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEvent1702105751695 implements MigrationInterface {
    name = 'AddEvent1702105751695'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_eventuser_enum" AS ENUM('free', 'fee')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "eventUser" "public"."users_eventuser_enum" NOT NULL DEFAULT 'free'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "eventUser"`);
        await queryRunner.query(`DROP TYPE "public"."users_eventuser_enum"`);
    }

}
