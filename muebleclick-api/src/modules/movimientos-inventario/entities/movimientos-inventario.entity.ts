import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Sucursal } from '../../sucursales/entities/sucursales.entity';
import { Producto } from '../../productos/entities/productos.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@ObjectType()
@Entity('movimientos_inventario')
export class MovimientoInventario {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id_movimiento!: number;

  @Field(() => Sucursal)
  @ManyToOne(() => Sucursal, { eager: true })
  @JoinColumn({ name: 'id_sucursal' })
  sucursal!: Sucursal;

  @Field(() => Producto)
  @ManyToOne(() => Producto, { eager: true })
  @JoinColumn({ name: 'id_producto' })
  producto!: Producto;

  @Field()
  @Column({ length: 20 })
  tipo!: string; // entrada | salida | ajuste

  @Field(() => Int)
  @Column()
  cantidad!: number;

  @Field()
  @CreateDateColumn()
  fecha!: Date;

  @Field({ nullable: true })
  @Column({ length: 50, nullable: true })
  referencia_tipo!: string; // pedido | venta | transferencia | produccion

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  referencia_id!: number;

  @Field(() => Usuario)
  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'id_usuario' })
  usuario!: Usuario;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  nota!: string;
}