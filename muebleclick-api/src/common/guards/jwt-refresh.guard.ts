import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    // passport-jwt busca en body, pasamos el refresh_token al body
    const args = ctx.getArgs();
    req.body = { ...req.body, refresh_token: args.input?.refresh_token };
    return req;
  }
}

