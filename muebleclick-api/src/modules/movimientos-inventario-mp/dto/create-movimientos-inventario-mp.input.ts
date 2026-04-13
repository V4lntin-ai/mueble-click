import { InputType, Field, Int, Float } from '@nestjs/graphql';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

@InputType()
export class CreateMovimientoInventarioMPInput {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_sucursal!: number;

  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_materia!: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  tipo!: string; // entrada | salida | ajuste | consumo

  @Field(() => Float)
  @IsNumber()
  @Min(0.001)
  cantidad!: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  referencia_tipo?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @IsPositive()
  referencia_id?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  nota?: string;
}