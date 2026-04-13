import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsInt, IsPositive } from 'class-validator';
import { CreateRolInput } from './create-rol.input';

@InputType()
export class UpdateRolInput extends PartialType(CreateRolInput) {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_rol!: number;
}