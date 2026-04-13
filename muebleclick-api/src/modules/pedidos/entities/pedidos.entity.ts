import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cliente } from '../../cliente/entities/cliente.entity';
import { DireccionEnvio } from '../../direcciones-envio/entities/direcciones-envio.entity';
import { Sucursal } from '../../sucursales/entities/sucursales.entity';

@ObjectType()
@Entity('pedidos')
export class Pedido {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id_pedido!: number;

  @Field(() => Cliente)
  @ManyToOne(() => Cliente, { eager: true })
  @JoinColumn({ name: 'id_cliente' })
  cliente!: Cliente;

  @Field(() => DireccionEnvio, { nullable: true })
  @ManyToOne(() => DireccionEnvio, { eager: true, nullable: true })
  @JoinColumn({ name: 'id_direccion' })
  direccion!: DireccionEnvio;

  @Field()
  @CreateDateColumn()
  fecha_pedido!: Date;

  @Field()
  @Column({ length: 20, default: 'Envio' })
  tipo_entrega!: string; // Envio | Recoleccion

  @Field(() => Sucursal, { nullable: true })
  @ManyToOne(() => Sucursal, { eager: true, nullable: true })
  @JoinColumn({ name: 'id_sucursal_origen' })
  sucursal_origen!: Sucursal;

  @Field()
  @Column({ length: 20, default: 'Pendiente' })
  estado_pedido!: string; // Pendiente | Confirmado | Enviado | Entregado | Cancelado

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  total!: number;
}