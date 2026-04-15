import { MigrationInterface, QueryRunner } from "typeorm";

export class AddResetTokenToUsuarios1776290902086 implements MigrationInterface {
    name = 'AddResetTokenToUsuarios1776290902086'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuarios" ADD "reset_token" text`);
        await queryRunner.query(`ALTER TABLE "usuarios" ADD "reset_token_expires" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN "reset_token_expires"`);
        await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN "reset_token"`);
    }

}
