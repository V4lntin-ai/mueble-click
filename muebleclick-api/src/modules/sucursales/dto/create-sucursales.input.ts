import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

@InputType()
export class CreateSucursalInput {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_muebleria!: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  nombre_sucursal!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  calle_numero?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @IsPositive()
  id_municipio?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefono?: string;

  @Field({ nullable: true })
  @IsOptional()
  horario?: string; // JSON string desde el cliente

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}