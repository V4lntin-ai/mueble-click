import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Sucursal } from '../../sucursales/entities/sucursales.entity';
import { MateriaPrima } from '../../materias-primas/entities/materias-primas.entity';

@ObjectType()
@Entity('inventario_mp')
export class InventarioMP {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id_inventario_mp!: number;

  @Field(() => Sucursal)
  @ManyToOne(() => Sucursal, { eager: true })
  @JoinColumn({ name: 'id_sucursal' })
  sucursal!: Sucursal;

  @Field(() => MateriaPrima)
  @ManyToOne(() => MateriaPrima, { eager: true })
  @JoinColumn({ name: 'id_materia' })
  materia_prima!: MateriaPrima;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 12, scale: 3, default: 0 })
  cantidad!: number;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 12, scale: 3, default: 0 })
  stock_min!: number;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 12, scale: 3, default: 0 })
  stock_max!: number;

  @Field()
  @UpdateDateColumn()
  ultimo_movimiento!: Date;
}