import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

@InputType()
export class CreateMuebleriaInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  nombre_negocio!: string;

  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_propietario!: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  razon_social?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  rfc?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  direccion_principal?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefono?: string;
}