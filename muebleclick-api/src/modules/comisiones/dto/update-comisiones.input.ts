import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsPositive } from 'class-validator';

@InputType()
export class UpdateComisionInput {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_comision!: number;
}