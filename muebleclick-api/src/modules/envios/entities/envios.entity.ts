import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Venta } from '../../ventas/entities/ventas.entity';
import { Paqueteria } from '../../paqueterias/entities/paqueterias.entity';
import { DireccionEnvio } from '../../direcciones-envio/entities/direcciones-envio.entity';

@ObjectType()
@Entity('envios')
export class Envio {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id_envio!: number;

  @Field(() => Venta)
  @ManyToOne(() => Venta, { eager: true })
  @JoinColumn({ name: 'id_venta' })
  venta!: Venta;

  @Field(() => Paqueteria)
  @ManyToOne(() => Paqueteria, { eager: true })
  @JoinColumn({ name: 'id_paqueteria' })
  paqueteria!: Paqueteria;

  @Field(() => DireccionEnvio)
  @ManyToOne(() => DireccionEnvio, { eager: true })
  @JoinColumn({ name: 'id_direccion' })
  direccion!: DireccionEnvio;

  @Field({ nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  fecha_envio!: Date;

  @Field({ nullable: true })
  @Column({ type: 'date', nullable: true })
  fecha_entrega_estimada!: string;

  @Field({ nullable: true })
  @Column({ type: 'date', nullable: true })
  fecha_entrega_real!: string;

  @Field()
  @Column({ length: 20, default: 'Preparando' })
  estado_envio!: string; // Preparando | En_camino | Entregado | Devuelto

  @Field({ nullable: true })
  @Column({ length: 100, nullable: true })
  tracking_number!: string;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  costo_envio!: number;

  @Field()
  @Column({ default: false })
  seguro!: boolean;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  nota!: string;
}