import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSucursales1776066523001 implements MigrationInterface {
    name = 'CreateSucursales1776066523001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sucursales" ("id_sucursal" SERIAL NOT NULL, "nombre_sucursal" character varying(150) NOT NULL, "calle_numero" text, "telefono" character varying(20), "horario" json, "activo" boolean NOT NULL DEFAULT true, "creado_en" TIMESTAMP NOT NULL DEFAULT now(), "id_muebleria" integer, "id_municipio" integer, CONSTRAINT "PK_42eed5a427940786e449f7fb3c6" PRIMARY KEY ("id_sucursal"))`);
        await queryRunner.query(`ALTER TABLE "sucursales" ADD CONSTRAINT "FK_47efe97b29a7b3b7deb2ae7da6c" FOREIGN KEY ("id_muebleria") REFERENCES "mueblerias"("id_muebleria") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sucursales" ADD CONSTRAINT "FK_6c982712a763832d3e5ab2a69b1" FOREIGN KEY ("id_municipio") REFERENCES "municipios"("id_municipio") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sucursales" DROP CONSTRAINT "FK_6c982712a763832d3e5ab2a69b1"`);
        await queryRunner.query(`ALTER TABLE "sucursales" DROP CONSTRAINT "FK_47efe97b29a7b3b7deb2ae7da6c"`);
        await queryRunner.query(`DROP TABLE "sucursales"`);
    }

}
