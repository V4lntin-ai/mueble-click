import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Venta } from '../../ventas/entities/ventas.entity';
import { Producto } from '../../productos/entities/productos.entity';

@ObjectType()
@Entity('detalle_venta')
export class DetalleVenta {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id_detalle_venta!: number;

  @Field(() => Venta)
  @ManyToOne(() => Venta, { eager: true })
  @JoinColumn({ name: 'id_venta' })
  venta!: Venta;

  @Field(() => Producto)
  @ManyToOne(() => Producto, { eager: true })
  @JoinColumn({ name: 'id_producto' })
  producto!: Producto;

  @Field(() => Int)
  @Column()
  cantidad!: number;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  precio_unitario!: number;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  subtotal!: number;
}