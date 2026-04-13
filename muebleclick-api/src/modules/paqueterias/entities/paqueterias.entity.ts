import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity('paqueterias')
export class Paqueteria {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id_paqueteria!: number;

  @Field()
  @Column({ length: 100 })
  nombre!: string;

  @Field({ nullable: true })
  @Column({ length: 20, nullable: true })
  telefono!: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  url_tracking!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  tiempo_promedio_entrega_days!: number;
}