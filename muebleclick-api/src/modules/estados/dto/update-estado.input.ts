import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsInt, IsPositive } from 'class-validator';
import { CreateEstadoInput } from './create-estado.input';

@InputType()
export class UpdateEstadoInput extends PartialType(CreateEstadoInput) {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_estado!: number;
}