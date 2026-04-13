import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsInt, IsPositive } from 'class-validator';
import { CreateCuponInput } from './create-cupones.input';

@InputType()
export class UpdateCuponInput extends PartialType(CreateCuponInput) {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_cupon!: number;
}