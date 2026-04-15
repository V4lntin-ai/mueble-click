import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsuariosService } from '../../modules/usuarios/usuarios.service';

type JwtPayload = {
  sub: number;
  iat?: number;
};

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usuariosService: UsuariosService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'),
      secretOrKey: configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: JwtPayload) {
    const usuario = await this.usuariosService.findOne(payload.sub);

    if (!usuario || !usuario.activo) {
      throw new UnauthorizedException('Token inválido');
    }

    // Verificar que no haya hecho logout después de emitir el token
    const tokenIatMs = payload.iat ? payload.iat * 1000 : undefined;
    if (
      tokenIatMs &&
      usuario.last_logout &&
      new Date(tokenIatMs) < usuario.last_logout
    ) {
      throw new UnauthorizedException('Sesión cerrada — inicia sesión nuevamente');
    }

    return usuario;
  }
}

