import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRefreshTokenToUsuarios1776242057602 implements MigrationInterface {
    name = 'AddRefreshTokenToUsuarios1776242057602'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuarios" ADD "refresh_token" text`);
        await queryRunner.query(`ALTER TABLE "usuarios" ADD "last_logout" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN "last_logout"`);
        await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN "refresh_token"`);
    }

}
