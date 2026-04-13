import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsInt, IsPositive } from 'class-validator';
import { CreateInventarioMPInput } from './create-inventario-mp.input';

@InputType()
export class UpdateInventarioMPInput extends PartialType(CreateInventarioMPInput) {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_inventario_mp!: number;
}