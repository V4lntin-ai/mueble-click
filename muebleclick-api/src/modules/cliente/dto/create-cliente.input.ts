import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

@InputType()
export class CreateClienteInput {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_usuario!: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefono?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @IsPositive()
  id_municipio_default?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  direccion_principal?: string;
}