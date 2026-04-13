import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCliente1776064321697 implements MigrationInterface {
    name = 'CreateCliente1776064321697'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cliente" ("id_usuario" integer NOT NULL, "telefono" character varying(20), "direccion_principal" text, "puntos" integer NOT NULL DEFAULT '0', "id_municipio_default" integer, CONSTRAINT "PK_679622fb965353efd5e328c549a" PRIMARY KEY ("id_usuario"))`);
        await queryRunner.query(`ALTER TABLE "cliente" ADD CONSTRAINT "FK_679622fb965353efd5e328c549a" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cliente" ADD CONSTRAINT "FK_f3612236bb9d15cae0bc8056c5e" FOREIGN KEY ("id_municipio_default") REFERENCES "municipios"("id_municipio") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cliente" DROP CONSTRAINT "FK_f3612236bb9d15cae0bc8056c5e"`);
        await queryRunner.query(`ALTER TABLE "cliente" DROP CONSTRAINT "FK_679622fb965353efd5e328c549a"`);
        await queryRunner.query(`DROP TABLE "cliente"`);
    }

}
