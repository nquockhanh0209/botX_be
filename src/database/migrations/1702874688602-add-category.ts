import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCategory1702874688602 implements MigrationInterface {
    name = 'AddCategory1702874688602'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "title" character varying NOT NULL, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "services" ADD "categoryId" integer`);
        await queryRunner.query(`ALTER TABLE "services" ADD CONSTRAINT "FK_034b52310c2d211bc979c3cc4e8" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "services" DROP CONSTRAINT "FK_034b52310c2d211bc979c3cc4e8"`);
        await queryRunner.query(`ALTER TABLE "services" DROP COLUMN "categoryId"`);
        await queryRunner.query(`DROP TABLE "categories"`);
    }

}
