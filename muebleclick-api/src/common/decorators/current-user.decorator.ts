import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Usuario } from '../../modules/usuarios/entities/usuario.entity';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): Usuario => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);