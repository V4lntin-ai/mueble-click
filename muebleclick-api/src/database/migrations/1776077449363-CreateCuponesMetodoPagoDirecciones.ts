import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCuponesMetodoPagoDirecciones1776077449363 implements MigrationInterface {
    name = 'CreateCuponesMetodoPagoDirecciones1776077449363'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "metodo_pago" ("id_metodo" SERIAL NOT NULL, "tipo_pago" character varying(30) NOT NULL, "detalles_pago" text, "estado_pago" character varying(20), CONSTRAINT "PK_84d29be8d52ccfc5dcf4a52123d" PRIMARY KEY ("id_metodo"))`);
        await queryRunner.query(`CREATE TABLE "direcciones_envio" ("id_direccion" SERIAL NOT NULL, "calle_numero" text NOT NULL, "referencias" text, "id_cliente" integer, "id_municipio" integer, CONSTRAINT "PK_2fde20c1bae2c40cd804f993f5c" PRIMARY KEY ("id_direccion"))`);
        await queryRunner.query(`CREATE TABLE "cupones" ("id_cupon" SERIAL NOT NULL, "codigo" character varying(20) NOT NULL, "descuento_porcentaje" numeric(5,2) NOT NULL, "fecha_expiracion" date NOT NULL, "activo" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_5e11e0e4e948543f97ed85d457a" UNIQUE ("codigo"), CONSTRAINT "PK_047e4b673c492e6dd8c786d66f8" PRIMARY KEY ("id_cupon"))`);
        await queryRunner.query(`ALTER TABLE "direcciones_envio" ADD CONSTRAINT "FK_0b3caa6782f70a91138a22d0d78" FOREIGN KEY ("id_cliente") REFERENCES "cliente"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "direcciones_envio" ADD CONSTRAINT "FK_a5e40aa3b7eaf7a56e00c51ba9a" FOREIGN KEY ("id_municipio") REFERENCES "municipios"("id_municipio") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "direcciones_envio" DROP CONSTRAINT "FK_a5e40aa3b7eaf7a56e00c51ba9a"`);
        await queryRunner.query(`ALTER TABLE "direcciones_envio" DROP CONSTRAINT "FK_0b3caa6782f70a91138a22d0d78"`);
        await queryRunner.query(`DROP TABLE "cupones"`);
        await queryRunner.query(`DROP TABLE "direcciones_envio"`);
        await queryRunner.query(`DROP TABLE "metodo_pago"`);
    }

}
