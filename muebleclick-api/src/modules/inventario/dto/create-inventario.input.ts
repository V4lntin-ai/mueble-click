import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsInt,
  IsOptional,
  IsPositive,
  Min,
} from 'class-validator';

@InputType()
export class CreateInventarioInput {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_sucursal!: number;

  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_producto!: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  cantidad?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  stock_min?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  stock_max?: number;
}