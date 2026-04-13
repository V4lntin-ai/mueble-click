import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsuarios1776055542475 implements MigrationInterface {
    name = 'CreateUsuarios1776055542475'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "usuarios" ("id_usuario" SERIAL NOT NULL, "nombre" character varying(100) NOT NULL, "correo" character varying(100) NOT NULL, "password" character varying(255) NOT NULL, "fecha_registro" TIMESTAMP NOT NULL DEFAULT now(), "activo" boolean NOT NULL DEFAULT true, "role_id" integer, CONSTRAINT "UQ_63665765c1a778a770c9bd585d3" UNIQUE ("correo"), CONSTRAINT "PK_dfe59db369749f9042499fd8107" PRIMARY KEY ("id_usuario"))`);
        await queryRunner.query(`ALTER TABLE "usuarios" ADD CONSTRAINT "FK_933f1f766daaa16d3848d186a59" FOREIGN KEY ("role_id") REFERENCES "roles"("id_rol") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuarios" DROP CONSTRAINT "FK_933f1f766daaa16d3848d186a59"`);
        await queryRunner.query(`DROP TABLE "usuarios"`);
    }

}
