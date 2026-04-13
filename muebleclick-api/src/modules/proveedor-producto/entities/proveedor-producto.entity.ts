import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Proveedor } from '../../proveedores/entities/proveedores.entity';
import { Producto } from '../../productos/entities/productos.entity';

@ObjectType()
@Entity('proveedor_producto')
export class ProveedorProducto {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => Proveedor)
  @ManyToOne(() => Proveedor, { eager: true })
  @JoinColumn({ name: 'id_proveedor' })
  proveedor!: Proveedor;

  @Field(() => Producto)
  @ManyToOne(() => Producto, { eager: true })
  @JoinColumn({ name: 'id_producto' })
  producto!: Producto;

  @Field({ nullable: true })
  @Column({ length: 50, nullable: true })
  codigo_proveedor!: string;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  precio_compra!: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  lead_time_days!: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  min_cantidad_pedido!: number;

  @Field()
  @Column({ default: true })
  activo!: boolean;
}