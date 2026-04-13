import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsBoolean, IsInt, IsOptional, IsPositive } from 'class-validator';
import { CreatePropietarioInput } from './create-propietario.input';

@InputType()
export class UpdatePropietarioInput extends PartialType(CreatePropietarioInput) {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_usuario!: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  verificado?: boolean;
}