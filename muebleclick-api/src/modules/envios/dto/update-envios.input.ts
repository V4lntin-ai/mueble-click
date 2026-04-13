import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

@InputType()
export class UpdateEnvioInput {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_envio!: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  estado_envio!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  fecha_entrega_real?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  tracking_number?: string;
}