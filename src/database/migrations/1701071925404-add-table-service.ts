import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableService1701071925404 implements MigrationInterface {
    name = 'AddTableService1701071925404'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "services" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "title" character varying(256) NOT NULL, "desc" text, "minQuantity" integer, "maxQuantity" integer, "price" numeric NOT NULL, "typeService" character varying(64) NOT NULL, "isHot" boolean NOT NULL DEFAULT false, "guarantee" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_ba2d347a3168a296416c6c5ccb2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_favourites" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" integer, "serviceId" integer, CONSTRAINT "PK_07b4ed05ae1c251c063ce335ea9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "carts" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "quantity" integer NOT NULL, "link" character varying(256) NOT NULL, "userId" integer, "serviceId" integer, CONSTRAINT "PK_b5f695a59f5ebb50af3c8160816" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_histories" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "link" character varying(256), "price" numeric NOT NULL, "amount" integer NOT NULL, "progress" integer NOT NULL, "statusOrder" character varying NOT NULL DEFAULT 'active', "userId" integer, "serviceId" integer, CONSTRAINT "PK_580471ac7bdbe26a80ca6f5b7e4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_favourites" ADD CONSTRAINT "FK_4337cae10ad097b0ca6cf77a12e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_favourites" ADD CONSTRAINT "FK_a12bdf5acdd1d923c3b05c253ba" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "carts" ADD CONSTRAINT "FK_69828a178f152f157dcf2f70a89" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "carts" ADD CONSTRAINT "FK_2fad27fe3fa8fa79e4ef4a1b748" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_histories" ADD CONSTRAINT "FK_fe6508850eb40a6959a88476423" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_histories" ADD CONSTRAINT "FK_03d8590ab8b2dc0d3d02c9e808c" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_histories" DROP CONSTRAINT "FK_03d8590ab8b2dc0d3d02c9e808c"`);
        await queryRunner.query(`ALTER TABLE "order_histories" DROP CONSTRAINT "FK_fe6508850eb40a6959a88476423"`);
        await queryRunner.query(`ALTER TABLE "carts" DROP CONSTRAINT "FK_2fad27fe3fa8fa79e4ef4a1b748"`);
        await queryRunner.query(`ALTER TABLE "carts" DROP CONSTRAINT "FK_69828a178f152f157dcf2f70a89"`);
        await queryRunner.query(`ALTER TABLE "user_favourites" DROP CONSTRAINT "FK_a12bdf5acdd1d923c3b05c253ba"`);
        await queryRunner.query(`ALTER TABLE "user_favourites" DROP CONSTRAINT "FK_4337cae10ad097b0ca6cf77a12e"`);
        await queryRunner.query(`DROP TABLE "order_histories"`);
        await queryRunner.query(`DROP TABLE "carts"`);
        await queryRunner.query(`DROP TABLE "user_favourites"`);
        await queryRunner.query(`DROP TABLE "services"`);
    }

}
