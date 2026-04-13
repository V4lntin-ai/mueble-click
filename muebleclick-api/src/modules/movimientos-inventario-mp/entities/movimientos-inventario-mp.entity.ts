import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Sucursal } from '../../sucursales/entities/sucursales.entity';
import { MateriaPrima } from '../../materias-primas/entities/materias-primas.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@ObjectType()
@Entity('movimientos_inventario_mp')
export class MovimientoInventarioMP {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id_movimiento!: number;

  @Field(() => Sucursal)
  @ManyToOne(() => Sucursal, { eager: true })
  @JoinColumn({ name: 'id_sucursal' })
  sucursal!: Sucursal;

  @Field(() => MateriaPrima)
  @ManyToOne(() => MateriaPrima, { eager: true })
  @JoinColumn({ name: 'id_materia' })
  materia_prima!: MateriaPrima;

  @Field()
  @Column({ length: 20 })
  tipo!: string; // entrada | salida | ajuste | consumo

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 12, scale: 3 })
  cantidad!: number;

  @Field()
  @CreateDateColumn()
  fecha!: Date;

  @Field({ nullable: true })
  @Column({ length: 50, nullable: true })
  referencia_tipo!: string; // orden_compra | orden_produccion | ajuste

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