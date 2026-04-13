import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProveedores1776068517171 implements MigrationInterface {
    name = 'CreateProveedores1776068517171'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "proveedores" ("id_proveedor" SERIAL NOT NULL, "nombre" character varying(150) NOT NULL, "contacto_nombre" character varying(100), "contacto_email" character varying(100), "telefono" character varying(20), "direccion" text, "rfc" character varying(20), "cuenta_bancaria" character varying(30), "tiempo_entrega_dias" integer, "tipo_proveedor" character varying(20), "id_municipio" integer, CONSTRAINT "PK_eb21842babaec13f046c27ae222" PRIMARY KEY ("id_proveedor"))`);
        await queryRunner.query(`ALTER TABLE "proveedores" ADD CONSTRAINT "FK_079ca1bfcdd743e8af8e5da68f1" FOREIGN KEY ("id_municipio") REFERENCES "municipios"("id_municipio") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "proveedores" DROP CONSTRAINT "FK_079ca1bfcdd743e8af8e5da68f1"`);
        await queryRunner.query(`DROP TABLE "proveedores"`);
    }

}
