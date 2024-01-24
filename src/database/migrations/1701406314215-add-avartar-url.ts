import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAvartarUrl1701406314215 implements MigrationInterface {
    name = 'AddAvartarUrl1701406314215'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "avatarUrl" character varying(512)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatarUrl"`);
    }

}
