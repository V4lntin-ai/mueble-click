import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProduccion1776076560747 implements MigrationInterface {
    name = 'CreateProduccion1776076560747'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ordenes_produccion" ("id_produccion" SERIAL NOT NULL, "cantidad_planificada" integer NOT NULL, "fecha_programada" date, "fecha_inicio" TIMESTAMP, "fecha_fin" TIMESTAMP, "estado" character varying(20) NOT NULL DEFAULT 'Planificada', "notas" text, "id_producto" integer, "id_sucursal" integer, "creado_por" integer, CONSTRAINT "PK_813ef6e8d205bbc0b75e0fc06e6" PRIMARY KEY ("id_produccion"))`);
        await queryRunner.query(`CREATE TABLE "detalle_orden_produccion" ("id_detalle" SERIAL NOT NULL, "cantidad_requerida" numeric(12,3) NOT NULL, "cantidad_consumida" numeric(12,3) NOT NULL DEFAULT '0', "unidad" character varying(20), "id_produccion" integer, "id_materia" integer, CONSTRAINT "PK_3c12f56faa77e21658ac8dadb5f" PRIMARY KEY ("id_detalle"))`);
        await queryRunner.query(`ALTER TABLE "ordenes_produccion" ADD CONSTRAINT "FK_fd470fa4cad7bb4813c3be9c31c" FOREIGN KEY ("id_producto") REFERENCES "productos"("id_producto") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ordenes_produccion" ADD CONSTRAINT "FK_ddfcc7574d51d840a903d6b70c1" FOREIGN KEY ("id_sucursal") REFERENCES "sucursales"("id_sucursal") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ordenes_produccion" ADD CONSTRAINT "FK_6200f1747ccf300db9e42fa5403" FOREIGN KEY ("creado_por") REFERENCES "usuarios"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "detalle_orden_produccion" ADD CONSTRAINT "FK_f04637035c86acc0e3670967e03" FOREIGN KEY ("id_produccion") REFERENCES "ordenes_produccion"("id_produccion") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "detalle_orden_produccion" ADD CONSTRAINT "FK_d3e34c150d0f5b0c9fabdb9c98a" FOREIGN KEY ("id_materia") REFERENCES "materias_primas"("id_materia") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "detalle_orden_produccion" DROP CONSTRAINT "FK_d3e34c150d0f5b0c9fabdb9c98a"`);
        await queryRunner.query(`ALTER TABLE "detalle_orden_produccion" DROP CONSTRAINT "FK_f04637035c86acc0e3670967e03"`);
        await queryRunner.query(`ALTER TABLE "ordenes_produccion" DROP CONSTRAINT "FK_6200f1747ccf300db9e42fa5403"`);
        await queryRunner.query(`ALTER TABLE "ordenes_produccion" DROP CONSTRAINT "FK_ddfcc7574d51d840a903d6b70c1"`);
        await queryRunner.query(`ALTER TABLE "ordenes_produccion" DROP CONSTRAINT "FK_fd470fa4cad7bb4813c3be9c31c"`);
        await queryRunner.query(`DROP TABLE "detalle_orden_produccion"`);
        await queryRunner.query(`DROP TABLE "ordenes_produccion"`);
    }

}
