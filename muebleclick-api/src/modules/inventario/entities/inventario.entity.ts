import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Sucursal } from '../../sucursales/entities/sucursales.entity';
import { Producto } from '../../productos/entities/productos.entity';

@ObjectType()
@Entity('inventario')
export class Inventario {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id_inventario!: number;

  @Field(() => Sucursal)
  @ManyToOne(() => Sucursal, { eager: true })
  @JoinColumn({ name: 'id_sucursal' })
  sucursal!: Sucursal;

  @Field(() => Producto)
  @ManyToOne(() => Producto, { eager: true })
  @JoinColumn({ name: 'id_producto' })
  producto!: Producto;

  @Field(() => Int)
  @Column({ default: 0 })
  cantidad!: number;

  @Field(() => Int)
  @Column({ default: 0 })
  reservado!: number;

  @Field(() => Int)
  @Column({ default: 0 })
  stock_min!: number;

  @Field(() => Int)
  @Column({ default: 0 })
  stock_max!: number;

  @Field()
  @UpdateDateColumn()
  ultimo_movimiento!: Date;
}