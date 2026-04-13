import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCompras1776075533366 implements MigrationInterface {
    name = 'CreateCompras1776075533366'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ordenes_compra" ("id_orden" SERIAL NOT NULL, "fecha_orden" TIMESTAMP NOT NULL DEFAULT now(), "fecha_recepcion_esperada" date, "estado" character varying(20) NOT NULL DEFAULT 'Pendiente', "total" numeric(12,2) NOT NULL DEFAULT '0', "id_proveedor" integer, "id_sucursal" integer, "creado_por" integer, CONSTRAINT "PK_b71d3fa4a9438455fc14d379447" PRIMARY KEY ("id_orden"))`);
        await queryRunner.query(`CREATE TABLE "detalle_orden_compra" ("id_detalle" SERIAL NOT NULL, "cantidad" numeric(12,3) NOT NULL, "precio_unitario" numeric(12,2) NOT NULL, "subtotal" numeric(12,2) NOT NULL, "id_orden" integer, "id_producto" integer, "id_materia" integer, CONSTRAINT "PK_f6218d406c5aa15b88cc0ed7bdd" PRIMARY KEY ("id_detalle"))`);
        await queryRunner.query(`CREATE TABLE "compras_proveedores" ("id_compra" SERIAL NOT NULL, "fecha_compra" TIMESTAMP NOT NULL DEFAULT now(), "total" numeric(12,2) NOT NULL, "factura_num" character varying(50), "notas" text, "id_proveedor" integer, CONSTRAINT "PK_afec9e0c0be47e73bcdfa1cb89d" PRIMARY KEY ("id_compra"))`);
        await queryRunner.query(`ALTER TABLE "ordenes_compra" ADD CONSTRAINT "FK_033330cc1b59c4e98aa4476f5ef" FOREIGN KEY ("id_proveedor") REFERENCES "proveedores"("id_proveedor") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ordenes_compra" ADD CONSTRAINT "FK_faf1c552c5972ebb96b169ed5dc" FOREIGN KEY ("id_sucursal") REFERENCES "sucursales"("id_sucursal") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ordenes_compra" ADD CONSTRAINT "FK_814f92cbce19560bbcbcb8cf64f" FOREIGN KEY ("creado_por") REFERENCES "usuarios"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "detalle_orden_compra" ADD CONSTRAINT "FK_44eb14b03308c34cd84744d8b37" FOREIGN KEY ("id_orden") REFERENCES "ordenes_compra"("id_orden") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "detalle_orden_compra" ADD CONSTRAINT "FK_51a45878ab18df6498383287d02" FOREIGN KEY ("id_producto") REFERENCES "productos"("id_producto") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "detalle_orden_compra" ADD CONSTRAINT "FK_9fa83f5f66b72db3e7651201b68" FOREIGN KEY ("id_materia") REFERENCES "materias_primas"("id_materia") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "compras_proveedores" ADD CONSTRAINT "FK_3dab27855e2c02fec2ef689181a" FOREIGN KEY ("id_proveedor") REFERENCES "proveedores"("id_proveedor") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "compras_proveedores" DROP CONSTRAINT "FK_3dab27855e2c02fec2ef689181a"`);
        await queryRunner.query(`ALTER TABLE "detalle_orden_compra" DROP CONSTRAINT "FK_9fa83f5f66b72db3e7651201b68"`);
        await queryRunner.query(`ALTER TABLE "detalle_orden_compra" DROP CONSTRAINT "FK_51a45878ab18df6498383287d02"`);
        await queryRunner.query(`ALTER TABLE "detalle_orden_compra" DROP CONSTRAINT "FK_44eb14b03308c34cd84744d8b37"`);
        await queryRunner.query(`ALTER TABLE "ordenes_compra" DROP CONSTRAINT "FK_814f92cbce19560bbcbcb8cf64f"`);
        await queryRunner.query(`ALTER TABLE "ordenes_compra" DROP CONSTRAINT "FK_faf1c552c5972ebb96b169ed5dc"`);
        await queryRunner.query(`ALTER TABLE "ordenes_compra" DROP CONSTRAINT "FK_033330cc1b59c4e98aa4476f5ef"`);
        await queryRunner.query(`DROP TABLE "compras_proveedores"`);
        await queryRunner.query(`DROP TABLE "detalle_orden_compra"`);
        await queryRunner.query(`DROP TABLE "ordenes_compra"`);
    }

}
