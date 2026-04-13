import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrdenProduccion } from '../../ordenes-produccion/entities/ordenes-produccion.entity';
import { MateriaPrima } from '../../materias-primas/entities/materias-primas.entity';

@ObjectType()
@Entity('detalle_orden_produccion')
export class DetalleOrdenProduccion {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id_detalle!: number;

  @Field(() => OrdenProduccion)
  @ManyToOne(() => OrdenProduccion, { eager: true })
  @JoinColumn({ name: 'id_produccion' })
  orden_produccion!: OrdenProduccion;

  @Field(() => MateriaPrima)
  @ManyToOne(() => MateriaPrima, { eager: true })
  @JoinColumn({ name: 'id_materia' })
  materia_prima!: MateriaPrima;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 12, scale: 3 })
  cantidad_requerida!: number;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 12, scale: 3, default: 0 })
  cantidad_consumida!: number;

  @Field({ nullable: true })
  @Column({ length: 20, nullable: true })
  unidad!: string;
}