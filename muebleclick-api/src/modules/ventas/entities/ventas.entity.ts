import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pedido } from '../../pedidos/entities/pedidos.entity';
import { Cliente } from '../../cliente/entities/cliente.entity';
import { MetodoPago } from '../../metodo-pago/entities/metodo-pago.entity';
import { Cupon } from '../../cupones/entities/cupones.entity';
import { Empleado } from '../../empleado/entities/empleado.entity';

@ObjectType()
@Entity('ventas')
export class Venta {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id_venta!: number;

  @Field(() => Pedido, { nullable: true })
  @OneToOne(() => Pedido, { eager: true, nullable: true })
  @JoinColumn({ name: 'id_pedido' })
  pedido!: Pedido;

  @Field(() => Cliente)
  @ManyToOne(() => Cliente, { eager: true })
  @JoinColumn({ name: 'id_cliente' })
  cliente!: Cliente;

  @Field(() => MetodoPago)
  @ManyToOne(() => MetodoPago, { eager: true })
  @JoinColumn({ name: 'id_metodo_pago' })
  metodo_pago!: MetodoPago;

  @Field(() => Cupon, { nullable: true })
  @ManyToOne(() => Cupon, { eager: true, nullable: true })
  @JoinColumn({ name: 'id_cupon' })
  cupon!: Cupon;

  @Field(() => Empleado, { nullable: true })
  @ManyToOne(() => Empleado, { eager: true, nullable: true })
  @JoinColumn({ name: 'id_vendedor' })
  vendedor!: Empleado;

  @Field()
  @CreateDateColumn()
  fecha_venta!: Date;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  sub_total!: number;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  descuento!: number;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  total_venta!: number;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  comision!: number;

  @Field()
  @Column({ length: 20, default: 'Completada' })
  estado_venta!: string; // Completada | Reembolsada | Cancelada
}