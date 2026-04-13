import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePedidos1776078708847 implements MigrationInterface {
    name = 'CreatePedidos1776078708847'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "pedidos" ("id_pedido" SERIAL NOT NULL, "fecha_pedido" TIMESTAMP NOT NULL DEFAULT now(), "tipo_entrega" character varying(20) NOT NULL DEFAULT 'Envio', "estado_pedido" character varying(20) NOT NULL DEFAULT 'Pendiente', "total" numeric(12,2) NOT NULL DEFAULT '0', "id_cliente" integer, "id_direccion" integer, "id_sucursal_origen" integer, CONSTRAINT "PK_9a67e2a4917b3656d2d23fe8b5e" PRIMARY KEY ("id_pedido"))`);
        await queryRunner.query(`CREATE TABLE "detalle_pedido" ("id_detalle_pedido" SERIAL NOT NULL, "cantidad" integer NOT NULL, "precio_unitario" double precision NOT NULL, "id_pedido" integer, "id_producto" integer, CONSTRAINT "PK_ba0a95937520fdda492c99cea90" PRIMARY KEY ("id_detalle_pedido"))`);
        await queryRunner.query(`ALTER TABLE "pedidos" ADD CONSTRAINT "FK_084336bed940d710a81fa96e59c" FOREIGN KEY ("id_cliente") REFERENCES "cliente"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pedidos" ADD CONSTRAINT "FK_569bdd4aa37cf877e118b3fbdeb" FOREIGN KEY ("id_direccion") REFERENCES "direcciones_envio"("id_direccion") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pedidos" ADD CONSTRAINT "FK_64cd0bbef60677447af694c3038" FOREIGN KEY ("id_sucursal_origen") REFERENCES "sucursales"("id_sucursal") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "detalle_pedido" ADD CONSTRAINT "FK_358afcceb14c2f910d152a3ad2f" FOREIGN KEY ("id_pedido") REFERENCES "pedidos"("id_pedido") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "detalle_pedido" ADD CONSTRAINT "FK_1e7d99f4f8c18bbcd15fc0fbe9b" FOREIGN KEY ("id_producto") REFERENCES "productos"("id_producto") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "detalle_pedido" DROP CONSTRAINT "FK_1e7d99f4f8c18bbcd15fc0fbe9b"`);
        await queryRunner.query(`ALTER TABLE "detalle_pedido" DROP CONSTRAINT "FK_358afcceb14c2f910d152a3ad2f"`);
        await queryRunner.query(`ALTER TABLE "pedidos" DROP CONSTRAINT "FK_64cd0bbef60677447af694c3038"`);
        await queryRunner.query(`ALTER TABLE "pedidos" DROP CONSTRAINT "FK_569bdd4aa37cf877e118b3fbdeb"`);
        await queryRunner.query(`ALTER TABLE "pedidos" DROP CONSTRAINT "FK_084336bed940d710a81fa96e59c"`);
        await queryRunner.query(`DROP TABLE "detalle_pedido"`);
        await queryRunner.query(`DROP TABLE "pedidos"`);
    }

}
