import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateVentas1776080044531 implements MigrationInterface {
    name = 'CreateVentas1776080044531'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ventas" ("id_venta" SERIAL NOT NULL, "fecha_venta" TIMESTAMP NOT NULL DEFAULT now(), "sub_total" numeric(12,2) NOT NULL, "descuento" numeric(12,2) NOT NULL DEFAULT '0', "total_venta" numeric(12,2) NOT NULL, "comision" numeric(10,2), "estado_venta" character varying(20) NOT NULL DEFAULT 'Completada', "id_pedido" integer, "id_cliente" integer, "id_metodo_pago" integer, "id_cupon" integer, "id_vendedor" integer, CONSTRAINT "REL_f22187ad5ab0e53cd956ad686e" UNIQUE ("id_pedido"), CONSTRAINT "PK_ededad4b3d60fe3193a9660329e" PRIMARY KEY ("id_venta"))`);
        await queryRunner.query(`CREATE TABLE "detalle_venta" ("id_detalle_venta" SERIAL NOT NULL, "cantidad" integer NOT NULL, "precio_unitario" numeric(12,2) NOT NULL, "subtotal" numeric(12,2) NOT NULL, "id_venta" integer, "id_producto" integer, CONSTRAINT "PK_6f82cbdcb2490fde276fb57074d" PRIMARY KEY ("id_detalle_venta"))`);
        await queryRunner.query(`ALTER TABLE "ventas" ADD CONSTRAINT "FK_f22187ad5ab0e53cd956ad686e9" FOREIGN KEY ("id_pedido") REFERENCES "pedidos"("id_pedido") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ventas" ADD CONSTRAINT "FK_efcc546e78ea86d15a8fc7cf270" FOREIGN KEY ("id_cliente") REFERENCES "cliente"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ventas" ADD CONSTRAINT "FK_9aafdb7f3e8e222946e008d1ad4" FOREIGN KEY ("id_metodo_pago") REFERENCES "metodo_pago"("id_metodo") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ventas" ADD CONSTRAINT "FK_2e1cc74a08c79d7e5be14dd55a9" FOREIGN KEY ("id_cupon") REFERENCES "cupones"("id_cupon") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ventas" ADD CONSTRAINT "FK_1a324f167d61f11491bb3d6b101" FOREIGN KEY ("id_vendedor") REFERENCES "empleado"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "detalle_venta" ADD CONSTRAINT "FK_175fd103d258655939b7fa81530" FOREIGN KEY ("id_venta") REFERENCES "ventas"("id_venta") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "detalle_venta" ADD CONSTRAINT "FK_46042990544850e9e972c1961e8" FOREIGN KEY ("id_producto") REFERENCES "productos"("id_producto") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "detalle_venta" DROP CONSTRAINT "FK_46042990544850e9e972c1961e8"`);
        await queryRunner.query(`ALTER TABLE "detalle_venta" DROP CONSTRAINT "FK_175fd103d258655939b7fa81530"`);
        await queryRunner.query(`ALTER TABLE "ventas" DROP CONSTRAINT "FK_1a324f167d61f11491bb3d6b101"`);
        await queryRunner.query(`ALTER TABLE "ventas" DROP CONSTRAINT "FK_2e1cc74a08c79d7e5be14dd55a9"`);
        await queryRunner.query(`ALTER TABLE "ventas" DROP CONSTRAINT "FK_9aafdb7f3e8e222946e008d1ad4"`);
        await queryRunner.query(`ALTER TABLE "ventas" DROP CONSTRAINT "FK_efcc546e78ea86d15a8fc7cf270"`);
        await queryRunner.query(`ALTER TABLE "ventas" DROP CONSTRAINT "FK_f22187ad5ab0e53cd956ad686e9"`);
        await queryRunner.query(`DROP TABLE "detalle_venta"`);
        await queryRunner.query(`DROP TABLE "ventas"`);
    }

}
