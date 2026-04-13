import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsPositive } from 'class-validator';

@InputType()
export class UpdateMovimientoInventarioMPInput {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_movimiento!: number;
}