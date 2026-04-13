import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePedidos1776079126888 implements MigrationInterface {
    name = 'CreatePedidos1776079126888'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "detalle_pedido" ADD "subtotal" numeric(12,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "detalle_pedido" DROP COLUMN "precio_unitario"`);
        await queryRunner.query(`ALTER TABLE "detalle_pedido" ADD "precio_unitario" numeric(12,2) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "detalle_pedido" DROP COLUMN "precio_unitario"`);
        await queryRunner.query(`ALTER TABLE "detalle_pedido" ADD "precio_unitario" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "detalle_pedido" DROP COLUMN "subtotal"`);
    }

}
