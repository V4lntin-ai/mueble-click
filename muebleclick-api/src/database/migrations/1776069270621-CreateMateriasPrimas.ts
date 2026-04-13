import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMateriasPrimas1776069270621 implements MigrationInterface {
    name = 'CreateMateriasPrimas1776069270621'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "materias_primas" ("id_materia" SERIAL NOT NULL, "codigo" character varying(50), "nombre" character varying(150) NOT NULL, "descripcion" text, "unidad_medida" character varying(20), "precio_unitario" numeric(12,2) NOT NULL, "creado_en" TIMESTAMP NOT NULL DEFAULT now(), "actualizado_en" TIMESTAMP NOT NULL DEFAULT now(), "proveedor_preferente" integer, CONSTRAINT "UQ_592e4926a020d103afff0554eda" UNIQUE ("codigo"), CONSTRAINT "PK_8bc4c3f635af68983baa3140354" PRIMARY KEY ("id_materia"))`);
        await queryRunner.query(`ALTER TABLE "materias_primas" ADD CONSTRAINT "FK_3ce9bb35176b82ce312fe168acd" FOREIGN KEY ("proveedor_preferente") REFERENCES "proveedores"("id_proveedor") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "materias_primas" DROP CONSTRAINT "FK_3ce9bb35176b82ce312fe168acd"`);
        await queryRunner.query(`DROP TABLE "materias_primas"`);
    }

}
