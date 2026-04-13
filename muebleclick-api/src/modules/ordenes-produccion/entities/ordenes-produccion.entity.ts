import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Producto } from '../../productos/entities/productos.entity';
import { Sucursal } from '../../sucursales/entities/sucursales.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@ObjectType()
@Entity('ordenes_produccion')
export class OrdenProduccion {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id_produccion!: number;

  @Field(() => Producto)
  @ManyToOne(() => Producto, { eager: true })
  @JoinColumn({ name: 'id_producto' })
  producto!: Producto;

  @Field(() => Sucursal)
  @ManyToOne(() => Sucursal, { eager: true })
  @JoinColumn({ name: 'id_sucursal' })
  sucursal!: Sucursal;

  @Field(() => Int)
  @Column()
  cantidad_planificada!: number;

  @Field({ nullable: true })
  @Column({ type: 'date', nullable: true })
  fecha_programada!: string;

  @Field({ nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  fecha_inicio!: Date;

  @Field({ nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  fecha_fin!: Date;

  @Field()
  @Column({ length: 20, default: 'Planificada' })
  estado!: string; // Planificada | En_proceso | Completada | Cancelada

  @Field(() => Usuario)
  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'creado_por' })
  creado_por!: Usuario;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  notas!: string;
}