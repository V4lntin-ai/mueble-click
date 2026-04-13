import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsInt, IsPositive } from 'class-validator';
import { CreateCompraProveedorInput } from './create-compras-proveedores.input';

@InputType()
export class UpdateCompraProveedorInput extends PartialType(CreateCompraProveedorInput) {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_compra!: number;
}