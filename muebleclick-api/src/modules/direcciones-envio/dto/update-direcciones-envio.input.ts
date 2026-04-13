import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsInt, IsPositive } from 'class-validator';
import { CreateDireccionEnvioInput } from './create-direcciones-envio.input';

@InputType()
export class UpdateDireccionEnvioInput extends PartialType(CreateDireccionEnvioInput) {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_direccion!: number;
}