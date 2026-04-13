import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Proveedor } from '../../proveedores/entities/proveedores.entity';
import { Sucursal } from '../../sucursales/entities/sucursales.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@ObjectType()
@Entity('ordenes_compra')
export class OrdenCompra {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id_orden!: number;

  @Field(() => Proveedor)
  @ManyToOne(() => Proveedor, { eager: true })
  @JoinColumn({ name: 'id_proveedor' })
  proveedor!: Proveedor;

  @Field(() => Sucursal)
  @ManyToOne(() => Sucursal, { eager: true })
  @JoinColumn({ name: 'id_sucursal' })
  sucursal!: Sucursal;

  @Field()
  @CreateDateColumn()
  fecha_orden!: Date;

  @Field({ nullable: true })
  @Column({ type: 'date', nullable: true })
  fecha_recepcion_esperada!: string;

  @Field()
  @Column({ length: 20, default: 'Pendiente' })
  estado!: string; // Pendiente | Enviada | Recibida | Cancelada

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  total!: number;

  @Field(() => Usuario)
  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'creado_por' })
  creado_por!: Usuario;
}