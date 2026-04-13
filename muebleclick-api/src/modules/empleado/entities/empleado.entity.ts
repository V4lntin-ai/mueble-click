import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Sucursal } from '../../sucursales/entities/sucursales.entity';

@ObjectType()
@Entity('empleado')
export class Empleado {
  @Field(() => Int)
  @PrimaryColumn()
  id_usuario!: number;

  @Field(() => Usuario)
  @OneToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'id_usuario' })
  usuario!: Usuario;

  @Field(() => Sucursal, { nullable: true })
  @ManyToOne(() => Sucursal, { eager: true, nullable: true })
  @JoinColumn({ name: 'id_sucursal' })
  sucursal!: Sucursal;

  @Field({ nullable: true })
  @Column({ length: 50, nullable: true })
  puesto!: string;

  @Field({ nullable: true })
  @Column({ type: 'date', nullable: true })
  fecha_ingreso!: string;

  @Field()
  @Column({ default: true })
  activo!: boolean;

  @Field()
  @Column({ default: false })
  es_vendedor!: boolean;

  @Field({ nullable: true })
  @Column({ length: 20, nullable: true })
  codigo_vendedor!: string;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  comision_pct!: number;
}