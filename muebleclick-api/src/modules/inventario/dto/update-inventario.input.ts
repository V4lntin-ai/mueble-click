import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsInt, IsPositive } from 'class-validator';
import { CreateInventarioInput } from './create-inventario.input';

@InputType()
export class UpdateInventarioInput extends PartialType(CreateInventarioInput) {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_inventario!: number;
}