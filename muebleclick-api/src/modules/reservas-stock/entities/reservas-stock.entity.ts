import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Producto } from '../../productos/entities/productos.entity';

@ObjectType()
@Entity('reservas_stock')
export class ReservaStock {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id_reserva!: number;

  @Field(() => Int)
  @Column()
  id_pedido!: number;

  @Field(() => Producto)
  @ManyToOne(() => Producto, { eager: true })
  @JoinColumn({ name: 'id_producto' })
  producto!: Producto;

  @Field(() => Int)
  @Column()
  cantidad!: number;

  @Field()
  @CreateDateColumn()
  fecha_reserva!: Date;

  @Field()
  @Column({ type: 'timestamp' })
  fecha_expira!: Date;
}