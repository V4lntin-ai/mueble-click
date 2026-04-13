import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMueblerias1776065810613 implements MigrationInterface {
    name = 'CreateMueblerias1776065810613'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "mueblerias" ("id_muebleria" SERIAL NOT NULL, "nombre_negocio" character varying(150) NOT NULL, "razon_social" character varying(150), "rfc" character varying(20), "direccion_principal" text, "telefono" character varying(20), "creado_en" TIMESTAMP NOT NULL DEFAULT now(), "id_propietario" integer, CONSTRAINT "PK_ea0b95062666bc55815e8fe6f3b" PRIMARY KEY ("id_muebleria"))`);
        await queryRunner.query(`ALTER TABLE "mueblerias" ADD CONSTRAINT "FK_4b1970a0d3d4d9e7289fafabcee" FOREIGN KEY ("id_propietario") REFERENCES "propietario"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mueblerias" DROP CONSTRAINT "FK_4b1970a0d3d4d9e7289fafabcee"`);
        await queryRunner.query(`DROP TABLE "mueblerias"`);
    }

}
