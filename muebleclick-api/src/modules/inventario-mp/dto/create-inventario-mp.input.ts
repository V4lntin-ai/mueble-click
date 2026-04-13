import { InputType, Field, Int, Float } from '@nestjs/graphql';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  Min,
} from 'class-validator';

@InputType()
export class CreateInventarioMPInput {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_sucursal!: number;

  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_materia!: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  cantidad?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock_min?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock_max?: number;
}