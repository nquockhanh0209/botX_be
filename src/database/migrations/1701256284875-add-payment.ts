import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPayment1701256284875 implements MigrationInterface {
    name = 'AddPayment1701256284875'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."payments_statuspayment_enum" AS ENUM('pending', 'done', 'cancel')`);
        await queryRunner.query(`CREATE TABLE "payments" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "amountVnd" numeric NOT NULL DEFAULT '0', "amountSys" numeric NOT NULL DEFAULT '0', "content" character varying(256), "statusPayment" "public"."payments_statuspayment_enum" NOT NULL DEFAULT 'pending', "userId" integer, CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_d35cb3c13a18e1ea1705b2817b1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_d35cb3c13a18e1ea1705b2817b1"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TYPE "public"."payments_statuspayment_enum"`);
    }

}
