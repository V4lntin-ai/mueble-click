import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEnviosComisiones1776080693025 implements MigrationInterface {
    name = 'CreateEnviosComisiones1776080693025'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "paqueterias" ("id_paqueteria" SERIAL NOT NULL, "nombre" character varying(100) NOT NULL, "telefono" character varying(20), "url_tracking" text, "tiempo_promedio_entrega_days" integer, CONSTRAINT "PK_de663e394aabf790c6613b60af7" PRIMARY KEY ("id_paqueteria"))`);
        await queryRunner.query(`CREATE TABLE "envios" ("id_envio" SERIAL NOT NULL, "fecha_envio" TIMESTAMP, "fecha_entrega_estimada" date, "fecha_entrega_real" date, "estado_envio" character varying(20) NOT NULL DEFAULT 'Preparando', "tracking_number" character varying(100), "costo_envio" numeric(10,2) NOT NULL DEFAULT '0', "seguro" boolean NOT NULL DEFAULT false, "nota" text, "id_venta" integer, "id_paqueteria" integer, "id_direccion" integer, CONSTRAINT "PK_22585763a400257119fe237b9fc" PRIMARY KEY ("id_envio"))`);
        await queryRunner.query(`CREATE TABLE "comisiones" ("id_comision" SERIAL NOT NULL, "porcentaje" numeric(5,2) NOT NULL, "monto" numeric(12,2) NOT NULL, "fecha" TIMESTAMP NOT NULL DEFAULT now(), "pagada" boolean NOT NULL DEFAULT false, "id_venta" integer, "id_vendedor" integer, CONSTRAINT "PK_df93764ed1febf8ddde5ee4f0ab" PRIMARY KEY ("id_comision"))`);
        await queryRunner.query(`ALTER TABLE "envios" ADD CONSTRAINT "FK_ede7e0290061661ee6fec044366" FOREIGN KEY ("id_venta") REFERENCES "ventas"("id_venta") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "envios" ADD CONSTRAINT "FK_72a9994b78467c1fd44074ead82" FOREIGN KEY ("id_paqueteria") REFERENCES "paqueterias"("id_paqueteria") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "envios" ADD CONSTRAINT "FK_b9c5889631d9307a49f7f0cd003" FOREIGN KEY ("id_direccion") REFERENCES "direcciones_envio"("id_direccion") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comisiones" ADD CONSTRAINT "FK_387a17912f2fef6cc6888db3612" FOREIGN KEY ("id_venta") REFERENCES "ventas"("id_venta") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comisiones" ADD CONSTRAINT "FK_0ed8ee43aef7e33162ae114f3d1" FOREIGN KEY ("id_vendedor") REFERENCES "empleado"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comisiones" DROP CONSTRAINT "FK_0ed8ee43aef7e33162ae114f3d1"`);
        await queryRunner.query(`ALTER TABLE "comisiones" DROP CONSTRAINT "FK_387a17912f2fef6cc6888db3612"`);
        await queryRunner.query(`ALTER TABLE "envios" DROP CONSTRAINT "FK_b9c5889631d9307a49f7f0cd003"`);
        await queryRunner.query(`ALTER TABLE "envios" DROP CONSTRAINT "FK_72a9994b78467c1fd44074ead82"`);
        await queryRunner.query(`ALTER TABLE "envios" DROP CONSTRAINT "FK_ede7e0290061661ee6fec044366"`);
        await queryRunner.query(`DROP TABLE "comisiones"`);
        await queryRunner.query(`DROP TABLE "envios"`);
        await queryRunner.query(`DROP TABLE "paqueterias"`);
    }

}
