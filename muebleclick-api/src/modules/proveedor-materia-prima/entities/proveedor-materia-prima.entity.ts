import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Proveedor } from '../../proveedores/entities/proveedores.entity';
import { MateriaPrima } from '../../materias-primas/entities/materias-primas.entity';

@ObjectType()
@Entity('proveedor_materia_prima')
export class ProveedorMateriaPrima {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => Proveedor)
  @ManyToOne(() => Proveedor, { eager: true })
  @JoinColumn({ name: 'id_proveedor' })
  proveedor!: Proveedor;

  @Field(() => MateriaPrima)
  @ManyToOne(() => MateriaPrima, { eager: true })
  @JoinColumn({ name: 'id_materia' })
  materia_prima!: MateriaPrima;

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