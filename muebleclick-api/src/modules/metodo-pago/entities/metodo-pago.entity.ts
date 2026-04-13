import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity('metodo_pago')
export class MetodoPago {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id_metodo!: number;

  @Field()
  @Column({ length: 30 })
  tipo_pago!: string; // Efectivo | Transferencia | Debito | Credito

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  detalles_pago!: string;

  @Field({ nullable: true })
  @Column({ length: 20, nullable: true })
  estado_pago!: string;
}