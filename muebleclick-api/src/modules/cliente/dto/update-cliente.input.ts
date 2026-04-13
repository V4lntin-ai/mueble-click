import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsInt, IsOptional, IsPositive } from 'class-validator';
import { CreateClienteInput } from './create-cliente.input';

@InputType()
export class UpdateClienteInput extends PartialType(CreateClienteInput) {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_usuario!: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @IsPositive()
  puntos?: number;
}