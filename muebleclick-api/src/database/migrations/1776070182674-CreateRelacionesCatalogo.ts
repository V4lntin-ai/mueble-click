import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRelacionesCatalogo1776070182674 implements MigrationInterface {
    name = 'CreateRelacionesCatalogo1776070182674'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "proveedor_materia_prima" ("id" SERIAL NOT NULL, "codigo_proveedor" character varying(50), "precio_compra" numeric(12,2) NOT NULL, "lead_time_days" integer, "min_cantidad_pedido" integer, "activo" boolean NOT NULL DEFAULT true, "id_proveedor" integer, "id_materia" integer, CONSTRAINT "PK_21360b54e1de67a6dbadafc7542" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "proveedor_producto" ("id" SERIAL NOT NULL, "codigo_proveedor" character varying(50), "precio_compra" numeric(12,2) NOT NULL, "lead_time_days" integer, "min_cantidad_pedido" integer, "activo" boolean NOT NULL DEFAULT true, "id_proveedor" integer, "id_producto" integer, CONSTRAINT "PK_6d2a80f00838e28956564444171" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "producto_materia_prima" ("id" SERIAL NOT NULL, "cantidad_por_unidad" numeric(10,3) NOT NULL, "unidad" character varying(20), "id_producto" integer, "id_materia" integer, CONSTRAINT "PK_30d07c95578cfbcd82392237878" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "proveedor_materia_prima" ADD CONSTRAINT "FK_1081f5f9160f2205ae7f46cf8c3" FOREIGN KEY ("id_proveedor") REFERENCES "proveedores"("id_proveedor") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "proveedor_materia_prima" ADD CONSTRAINT "FK_3349832cb9e38da3da619a733e6" FOREIGN KEY ("id_materia") REFERENCES "materias_primas"("id_materia") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "proveedor_producto" ADD CONSTRAINT "FK_2fe0e8a86c89ea96cdcbe57010c" FOREIGN KEY ("id_proveedor") REFERENCES "proveedores"("id_proveedor") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "proveedor_producto" ADD CONSTRAINT "FK_5babf71bb1e7b31a8df46b1469a" FOREIGN KEY ("id_producto") REFERENCES "productos"("id_producto") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "producto_materia_prima" ADD CONSTRAINT "FK_293ebeb9b66ae31a5b243d8d198" FOREIGN KEY ("id_producto") REFERENCES "productos"("id_producto") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "producto_materia_prima" ADD CONSTRAINT "FK_19eaf2c70122a3fd686c72386c2" FOREIGN KEY ("id_materia") REFERENCES "materias_primas"("id_materia") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "producto_materia_prima" DROP CONSTRAINT "FK_19eaf2c70122a3fd686c72386c2"`);
        await queryRunner.query(`ALTER TABLE "producto_materia_prima" DROP CONSTRAINT "FK_293ebeb9b66ae31a5b243d8d198"`);
        await queryRunner.query(`ALTER TABLE "proveedor_producto" DROP CONSTRAINT "FK_5babf71bb1e7b31a8df46b1469a"`);
        await queryRunner.query(`ALTER TABLE "proveedor_producto" DROP CONSTRAINT "FK_2fe0e8a86c89ea96cdcbe57010c"`);
        await queryRunner.query(`ALTER TABLE "proveedor_materia_prima" DROP CONSTRAINT "FK_3349832cb9e38da3da619a733e6"`);
        await queryRunner.query(`ALTER TABLE "proveedor_materia_prima" DROP CONSTRAINT "FK_1081f5f9160f2205ae7f46cf8c3"`);
        await queryRunner.query(`DROP TABLE "producto_materia_prima"`);
        await queryRunner.query(`DROP TABLE "proveedor_producto"`);
        await queryRunner.query(`DROP TABLE "proveedor_materia_prima"`);
    }

}
