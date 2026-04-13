import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsPositive } from 'class-validator';

// Los movimientos no se editan — solo se crean
// Este DTO existe por convención pero no se expone en el resolver
@InputType()
export class UpdateMovimientoInventarioInput {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_movimiento!: number;
}