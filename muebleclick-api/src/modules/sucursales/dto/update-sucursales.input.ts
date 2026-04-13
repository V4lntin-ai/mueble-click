import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsInt, IsPositive } from 'class-validator';
import { CreateSucursalInput } from './create-sucursales.input';

@InputType()
export class UpdateSucursalInput extends PartialType(CreateSucursalInput) {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_sucursal!: number;
}