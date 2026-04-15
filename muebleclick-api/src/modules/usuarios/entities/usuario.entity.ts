import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Rol } from '../../roles/entities/rol.entity';

@ObjectType()
@Entity('usuarios')
export class Usuario {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id_usuario!: number;

  @Field()
  @Column({ length: 100 })
  nombre!: string;

  @Field()
  @Column({ unique: true, length: 100 })
  correo!: string;

  // Sin @Field — nunca se expone en GraphQL
  @Column({ length: 255 })
  password!: string;

  @Field(() => Rol)
  @ManyToOne(() => Rol, { eager: true })
  @JoinColumn({ name: 'role_id' })
  rol!: Rol;

  @Field()
  @CreateDateColumn()
  fecha_registro?: Date;

  @Field()
  @Column({ default: true })
  activo?: boolean;

  // Sin @Field — datos internos de sesión
  @Column({ type: 'text', nullable: true })
  refresh_token!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  last_logout? : Date | null;

  @Column({ type: 'text', nullable: true })
  reset_token!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  reset_token_expires?: Date | null;
}