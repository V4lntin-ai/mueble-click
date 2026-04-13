import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRoles1776052784866 implements MigrationInterface {
    name = 'CreateRoles1776052784866'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "roles" ("id_rol" SERIAL NOT NULL, "nombre" character varying(50) NOT NULL, "descripcion" text, CONSTRAINT "UQ_a5be7aa67e759e347b1c6464e10" UNIQUE ("nombre"), CONSTRAINT "PK_25f8d4161f00a1dd1cbe5068695" PRIMARY KEY ("id_rol"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "roles"`);
    }

}
