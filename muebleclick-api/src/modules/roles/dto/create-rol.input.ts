import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

@InputType()
export class CreateRolInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  nombre!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  descripcion?: string;
}