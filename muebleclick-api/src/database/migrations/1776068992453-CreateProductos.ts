import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductos1776068992453 implements MigrationInterface {
    name = 'CreateProductos1776068992453'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "productos" ("id_producto" SERIAL NOT NULL, "sku" character varying(50), "nombre" character varying(150) NOT NULL, "descripcion" text, "categoria" character varying(50), "unidad_medida" character varying(20), "imagen_url" text, "precio_venta" numeric(12,2) NOT NULL, "peso_kg" numeric(8,2), "volumen_m3" numeric(8,2), "tipo_producto" character varying(20), "creado_en" TIMESTAMP NOT NULL DEFAULT now(), "actualizado_en" TIMESTAMP NOT NULL DEFAULT now(), "id_muebleria" integer, CONSTRAINT "UQ_805687bf24c1411756fbd37b2f3" UNIQUE ("sku"), CONSTRAINT "PK_8c832a65b374c16cbd8135d6be5" PRIMARY KEY ("id_producto"))`);
        await queryRunner.query(`ALTER TABLE "productos" ADD CONSTRAINT "FK_fcc16d9f3f1aa36e06f28c957ad" FOREIGN KEY ("id_muebleria") REFERENCES "mueblerias"("id_muebleria") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "productos" DROP CONSTRAINT "FK_fcc16d9f3f1aa36e06f28c957ad"`);
        await queryRunner.query(`DROP TABLE "productos"`);
    }

}
