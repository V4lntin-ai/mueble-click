import { InputType, Field, Int, Float } from '@nestjs/graphql';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

@InputType()
export class CreateCompraProveedorInput {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_proveedor!: number;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  total!: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  factura_num?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  notas?: string;
}