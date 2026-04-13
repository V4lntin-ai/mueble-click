import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEmpleado1776068063609 implements MigrationInterface {
    name = 'CreateEmpleado1776068063609'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "empleado" ("id_usuario" integer NOT NULL, "puesto" character varying(50), "fecha_ingreso" date, "activo" boolean NOT NULL DEFAULT true, "es_vendedor" boolean NOT NULL DEFAULT false, "codigo_vendedor" character varying(20), "comision_pct" numeric(5,2), "id_sucursal" integer, CONSTRAINT "PK_6bf5665e2c89ccefeb75b978565" PRIMARY KEY ("id_usuario"))`);
        await queryRunner.query(`ALTER TABLE "empleado" ADD CONSTRAINT "FK_6bf5665e2c89ccefeb75b978565" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "empleado" ADD CONSTRAINT "FK_35429e6d44ba38843108f9b984a" FOREIGN KEY ("id_sucursal") REFERENCES "sucursales"("id_sucursal") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "empleado" DROP CONSTRAINT "FK_35429e6d44ba38843108f9b984a"`);
        await queryRunner.query(`ALTER TABLE "empleado" DROP CONSTRAINT "FK_6bf5665e2c89ccefeb75b978565"`);
        await queryRunner.query(`DROP TABLE "empleado"`);
    }

}
