import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

@InputType()
export class CreateUsuarioInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  nombre!: string;

  @Field()
  @IsEmail()
  correo!: string;

  @Field()
  @IsString()
  @MinLength(6)
  password!: string;

  @Field(() => Int)
  @IsInt()
  @IsPositive()
  role_id!: number;
}