import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity('roles')
export class Rol {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id_rol!: number;

  @Field()
  @Column({ unique: true, length: 50 })
  nombre!: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  descripcion!: string;
}