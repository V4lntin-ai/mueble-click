import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrdenCompra } from '../../ordenes-compra/entities/ordenes-compra.entity';
import { Producto } from '../../productos/entities/productos.entity';
import { MateriaPrima } from '../../materias-primas/entities/materias-primas.entity';

@ObjectType()
@Entity('detalle_orden_compra')
export class DetalleOrdenCompra {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id_detalle!: number;

  @Field(() => OrdenCompra)
  @ManyToOne(() => OrdenCompra, { eager: true })
  @JoinColumn({ name: 'id_orden' })
  orden!: OrdenCompra;

  @Field(() => Producto, { nullable: true })
  @ManyToOne(() => Producto, { eager: true, nullable: true })
  @JoinColumn({ name: 'id_producto' })
  producto!: Producto;

  @Field(() => MateriaPrima, { nullable: true })
  @ManyToOne(() => MateriaPrima, { eager: true, nullable: true })
  @JoinColumn({ name: 'id_materia' })
  materia_prima!: MateriaPrima;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 12, scale: 3 })
  cantidad!: number;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  precio_unitario!: number;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  subtotal!: number;
}