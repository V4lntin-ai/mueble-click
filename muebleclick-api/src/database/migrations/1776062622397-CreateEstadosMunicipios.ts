import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEstadosMunicipios1776062622397 implements MigrationInterface {
    name = 'CreateEstadosMunicipios1776062622397'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "estados" ("id_estado" SERIAL NOT NULL, "nombre" character varying(100) NOT NULL, "codigo_iso" character varying(10) NOT NULL, CONSTRAINT "PK_7b21e577ab2b3ce4ef85144ee2a" PRIMARY KEY ("id_estado"))`);
        await queryRunner.query(`CREATE TABLE "municipios" ("id_municipio" SERIAL NOT NULL, "nombre" character varying(150) NOT NULL, "id_estado" integer, CONSTRAINT "PK_da5d86d82419fc6467cd4f3fa83" PRIMARY KEY ("id_municipio"))`);
        await queryRunner.query(`ALTER TABLE "municipios" ADD CONSTRAINT "FK_5ee522a1f8590f26f13f85e12bc" FOREIGN KEY ("id_estado") REFERENCES "estados"("id_estado") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "municipios" DROP CONSTRAINT "FK_5ee522a1f8590f26f13f85e12bc"`);
        await queryRunner.query(`DROP TABLE "municipios"`);
        await queryRunner.query(`DROP TABLE "estados"`);
    }

}
