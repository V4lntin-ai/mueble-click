import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInventarioMP1776071322826 implements MigrationInterface {
    name = 'CreateInventarioMP1776071322826'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "inventario_mp" ("id_inventario_mp" SERIAL NOT NULL, "cantidad" numeric(12,3) NOT NULL DEFAULT '0', "stock_min" numeric(12,3) NOT NULL DEFAULT '0', "stock_max" numeric(12,3) NOT NULL DEFAULT '0', "ultimo_movimiento" TIMESTAMP NOT NULL DEFAULT now(), "id_sucursal" integer, "id_materia" integer, CONSTRAINT "PK_f262f6fe726e2018b5862726ac9" PRIMARY KEY ("id_inventario_mp"))`);
        await queryRunner.query(`ALTER TABLE "inventario_mp" ADD CONSTRAINT "FK_ffeb33903df27fc819d9dfda03d" FOREIGN KEY ("id_sucursal") REFERENCES "sucursales"("id_sucursal") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventario_mp" ADD CONSTRAINT "FK_6502bddd54aa1dcee0cfe549841" FOREIGN KEY ("id_materia") REFERENCES "materias_primas"("id_materia") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventario_mp" DROP CONSTRAINT "FK_6502bddd54aa1dcee0cfe549841"`);
        await queryRunner.query(`ALTER TABLE "inventario_mp" DROP CONSTRAINT "FK_ffeb33903df27fc819d9dfda03d"`);
        await queryRunner.query(`DROP TABLE "inventario_mp"`);
    }

}
