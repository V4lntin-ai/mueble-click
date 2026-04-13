import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

@InputType()
export class UpdateOrdenProduccionInput {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_produccion!: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  estado!: string; // En_proceso | Completada | Cancelada

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  notas?: string;
}