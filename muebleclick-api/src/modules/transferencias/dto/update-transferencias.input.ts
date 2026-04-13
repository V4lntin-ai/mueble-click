import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

@InputType()
export class UpdateTransferenciaInput {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_transferencia!: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  estado!: string; // En_transito | Completada | Cancelada
}