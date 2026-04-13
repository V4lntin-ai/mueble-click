import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePropietario1776063305749 implements MigrationInterface {
    name = 'CreatePropietario1776063305749'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "propietario" ("id_usuario" integer NOT NULL, "curp_rfc" character varying(20), "clabe_interbancaria" character varying(18), "banco" character varying(50), "verificado" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_2f7e342254efc324311cc1ff671" PRIMARY KEY ("id_usuario"))`);
        await queryRunner.query(`ALTER TABLE "propietario" ADD CONSTRAINT "FK_2f7e342254efc324311cc1ff671" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "propietario" DROP CONSTRAINT "FK_2f7e342254efc324311cc1ff671"`);
        await queryRunner.query(`DROP TABLE "propietario"`);
    }

}
