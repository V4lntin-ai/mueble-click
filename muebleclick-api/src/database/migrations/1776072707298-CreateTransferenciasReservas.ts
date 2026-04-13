import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTransferenciasReservas1776072707298 implements MigrationInterface {
    name = 'CreateTransferenciasReservas1776072707298'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transferencias" ("id_transferencia" SERIAL NOT NULL, "fecha_transferencia" TIMESTAMP NOT NULL DEFAULT now(), "estado" character varying(20) NOT NULL DEFAULT 'Pendiente', "id_sucursal_origen" integer, "id_sucursal_destino" integer, "creado_por" integer, CONSTRAINT "PK_044bbc9c77b64980d3097c4398a" PRIMARY KEY ("id_transferencia"))`);
        await queryRunner.query(`CREATE TABLE "reservas_stock" ("id_reserva" SERIAL NOT NULL, "id_pedido" integer NOT NULL, "cantidad" integer NOT NULL, "fecha_reserva" TIMESTAMP NOT NULL DEFAULT now(), "fecha_expira" TIMESTAMP NOT NULL, "id_producto" integer, CONSTRAINT "PK_05b3044ef0346b7b89c49e4a232" PRIMARY KEY ("id_reserva"))`);
        await queryRunner.query(`ALTER TABLE "transferencias" ADD CONSTRAINT "FK_f3ec6bb31ec4389b2ec6644487d" FOREIGN KEY ("id_sucursal_origen") REFERENCES "sucursales"("id_sucursal") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transferencias" ADD CONSTRAINT "FK_fe37b07e5b1fd150261661db833" FOREIGN KEY ("id_sucursal_destino") REFERENCES "sucursales"("id_sucursal") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transferencias" ADD CONSTRAINT "FK_689cc90dc8fa26f74e118c575a0" FOREIGN KEY ("creado_por") REFERENCES "usuarios"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservas_stock" ADD CONSTRAINT "FK_88b6c90d3ae98c7b4a033ebd3ac" FOREIGN KEY ("id_producto") REFERENCES "productos"("id_producto") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservas_stock" DROP CONSTRAINT "FK_88b6c90d3ae98c7b4a033ebd3ac"`);
        await queryRunner.query(`ALTER TABLE "transferencias" DROP CONSTRAINT "FK_689cc90dc8fa26f74e118c575a0"`);
        await queryRunner.query(`ALTER TABLE "transferencias" DROP CONSTRAINT "FK_fe37b07e5b1fd150261661db833"`);
        await queryRunner.query(`ALTER TABLE "transferencias" DROP CONSTRAINT "FK_f3ec6bb31ec4389b2ec6644487d"`);
        await queryRunner.query(`DROP TABLE "reservas_stock"`);
        await queryRunner.query(`DROP TABLE "transferencias"`);
    }

}
