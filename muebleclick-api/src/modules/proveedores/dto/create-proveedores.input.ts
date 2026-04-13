import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

@InputType()
export class CreateProveedorInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  nombre!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  contacto_nombre?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  contacto_email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefono?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @IsPositive()
  id_municipio?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  direccion?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  rfc?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  cuenta_bancaria?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  @IsPositive()
  tiempo_entrega_dias?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  tipo_proveedor?: string;
}