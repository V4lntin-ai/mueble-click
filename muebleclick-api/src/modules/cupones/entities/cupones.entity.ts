import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity('cupones')
export class Cupon {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id_cupon!: number;

  @Field()
  @Column({ length: 20, unique: true })
  codigo!: string;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 5, scale: 2 })
  descuento_porcentaje!: number;

  @Field()
  @Column({ type: 'date' })
  fecha_expiracion!: string;

  @Field()
  @Column({ default: true })
  activo!: boolean;
}