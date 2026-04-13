import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Venta } from '../../ventas/entities/ventas.entity';
import { Empleado } from '../../empleado/entities/empleado.entity';

@ObjectType()
@Entity('comisiones')
export class Comision {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id_comision!: number;

  @Field(() => Venta)
  @ManyToOne(() => Venta, { eager: true })
  @JoinColumn({ name: 'id_venta' })
  venta!: Venta;

  @Field(() => Empleado)
  @ManyToOne(() => Empleado, { eager: true })
  @JoinColumn({ name: 'id_vendedor' })
  vendedor!: Empleado;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 5, scale: 2 })
  porcentaje!: number;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  monto!: number;

  @Field()
  @CreateDateColumn()
  fecha!: Date;

  @Field()
  @Column({ default: false })
  pagada!: boolean;
}