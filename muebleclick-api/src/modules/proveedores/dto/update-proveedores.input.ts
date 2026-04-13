import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsInt, IsPositive } from 'class-validator';
import { CreateProveedorInput } from './create-proveedores.input';

@InputType()
export class UpdateProveedorInput extends PartialType(CreateProveedorInput) {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_proveedor!: number;
}