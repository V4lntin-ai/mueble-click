import { InputType, Field, Int, Float } from '@nestjs/graphql';
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Max,
  Min,
} from 'class-validator';

@InputType()
export class CreateEmpleadoInput {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_usuario!: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @IsPositive()
  id_sucursal?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  puesto?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  fecha_ingreso?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  es_vendedor?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  codigo_vendedor?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  comision_pct?: number;
}