import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInventario1776070886909 implements MigrationInterface {
    name = 'CreateInventario1776070886909'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "inventario" ("id_inventario" SERIAL NOT NULL, "cantidad" integer NOT NULL DEFAULT '0', "reservado" integer NOT NULL DEFAULT '0', "stock_min" integer NOT NULL DEFAULT '0', "stock_max" integer NOT NULL DEFAULT '0', "ultimo_movimiento" TIMESTAMP NOT NULL DEFAULT now(), "id_sucursal" integer, "id_producto" integer, CONSTRAINT "PK_d026f8a15da0fe506783e4ccb7f" PRIMARY KEY ("id_inventario"))`);
        await queryRunner.query(`ALTER TABLE "inventario" ADD CONSTRAINT "FK_a045b2b9f2622a0881b699b17e5" FOREIGN KEY ("id_sucursal") REFERENCES "sucursales"("id_sucursal") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventario" ADD CONSTRAINT "FK_467c42d673222f61151a26570fa" FOREIGN KEY ("id_producto") REFERENCES "productos"("id_producto") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventario" DROP CONSTRAINT "FK_467c42d673222f61151a26570fa"`);
        await queryRunner.query(`ALTER TABLE "inventario" DROP CONSTRAINT "FK_a045b2b9f2622a0881b699b17e5"`);
        await queryRunner.query(`DROP TABLE "inventario"`);
    }

}
