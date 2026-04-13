import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMovimientos1776071978505 implements MigrationInterface {
    name = 'CreateMovimientos1776071978505'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "movimientos_inventario_mp" ("id_movimiento" SERIAL NOT NULL, "tipo" character varying(20) NOT NULL, "cantidad" numeric(12,3) NOT NULL, "fecha" TIMESTAMP NOT NULL DEFAULT now(), "referencia_tipo" character varying(50), "referencia_id" integer, "nota" text, "id_sucursal" integer, "id_materia" integer, "id_usuario" integer, CONSTRAINT "PK_55151abc25ecc7d0bf6e5a0ec0a" PRIMARY KEY ("id_movimiento"))`);
        await queryRunner.query(`CREATE TABLE "movimientos_inventario" ("id_movimiento" SERIAL NOT NULL, "tipo" character varying(20) NOT NULL, "cantidad" integer NOT NULL, "fecha" TIMESTAMP NOT NULL DEFAULT now(), "referencia_tipo" character varying(50), "referencia_id" integer, "nota" text, "id_sucursal" integer, "id_producto" integer, "id_usuario" integer, CONSTRAINT "PK_8b1e32cedd7e52f4b01801ec018" PRIMARY KEY ("id_movimiento"))`);
        await queryRunner.query(`ALTER TABLE "movimientos_inventario_mp" ADD CONSTRAINT "FK_f5af1bad24dd4b96eb8ecc9ec49" FOREIGN KEY ("id_sucursal") REFERENCES "sucursales"("id_sucursal") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movimientos_inventario_mp" ADD CONSTRAINT "FK_2718aa7eb2819fd05c2db7ceab5" FOREIGN KEY ("id_materia") REFERENCES "materias_primas"("id_materia") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movimientos_inventario_mp" ADD CONSTRAINT "FK_e1d2e1eef5575572a86f3f12385" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movimientos_inventario" ADD CONSTRAINT "FK_54364932b7ccdf97ec966b06866" FOREIGN KEY ("id_sucursal") REFERENCES "sucursales"("id_sucursal") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movimientos_inventario" ADD CONSTRAINT "FK_074b78358b6e5c89b22991d1d36" FOREIGN KEY ("id_producto") REFERENCES "productos"("id_producto") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movimientos_inventario" ADD CONSTRAINT "FK_55e8a0bb4e1a478e105f188c5a4" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movimientos_inventario" DROP CONSTRAINT "FK_55e8a0bb4e1a478e105f188c5a4"`);
        await queryRunner.query(`ALTER TABLE "movimientos_inventario" DROP CONSTRAINT "FK_074b78358b6e5c89b22991d1d36"`);
        await queryRunner.query(`ALTER TABLE "movimientos_inventario" DROP CONSTRAINT "FK_54364932b7ccdf97ec966b06866"`);
        await queryRunner.query(`ALTER TABLE "movimientos_inventario_mp" DROP CONSTRAINT "FK_e1d2e1eef5575572a86f3f12385"`);
        await queryRunner.query(`ALTER TABLE "movimientos_inventario_mp" DROP CONSTRAINT "FK_2718aa7eb2819fd05c2db7ceab5"`);
        await queryRunner.query(`ALTER TABLE "movimientos_inventario_mp" DROP CONSTRAINT "FK_f5af1bad24dd4b96eb8ecc9ec49"`);
        await queryRunner.query(`DROP TABLE "movimientos_inventario"`);
        await queryRunner.query(`DROP TABLE "movimientos_inventario_mp"`);
    }

}
