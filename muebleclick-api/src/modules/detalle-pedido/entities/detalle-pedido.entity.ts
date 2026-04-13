import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pedido } from '../../pedidos/entities/pedidos.entity';
import { Producto } from '../../productos/entities/productos.entity';

@ObjectType()
@Entity('detalle_pedido')
export class DetallePedido {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id_detalle_pedido!: number;

  @Field(() => Pedido)
  @ManyToOne(() => Pedido, { eager: true })
  @JoinColumn({ name: 'id_pedido' })
  pedido!: Pedido;

  @Field(() => Producto)
  @ManyToOne(() => Producto, { eager: true })
  @JoinColumn({ name: 'id_producto' })
  producto!: Producto;

  @Field(() => Int)
  @Column()
  cantidad!: number;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  subtotal!: number;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  precio_unitario!: number;
}   