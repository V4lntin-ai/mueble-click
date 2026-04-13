import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsBoolean, IsInt, IsOptional, IsPositive } from 'class-validator';
import { CreateEmpleadoInput } from './create-empleado.input';

@InputType()
export class UpdateEmpleadoInput extends PartialType(CreateEmpleadoInput) {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_usuario!: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}