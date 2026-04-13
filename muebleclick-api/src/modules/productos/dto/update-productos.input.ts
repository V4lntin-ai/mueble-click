import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsInt, IsPositive } from 'class-validator';
import { CreateProductoInput } from './create-productos.input';

@InputType()
export class UpdateProductoInput extends PartialType(CreateProductoInput) {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_producto!: number;
}