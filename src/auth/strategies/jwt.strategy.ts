import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWTPayloadDto } from '../dto/jwt-payload.dto';
import { User } from '../entities/user.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    // Config para el constructor del padre
    super({
      // key secreta de JWT
      secretOrKey: configService.get('JWT_SECRET'),
      // donde va a enviar el token el cliente
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(jwtPayload: JWTPayloadDto): Promise<User> {
    const { user_id } = jwtPayload;

    const user = await this.authService.findUserById(user_id);

    // Si no se encuentra ningun usuario con id recibido en token
    if (!user) {
      throw new UnauthorizedException(`Token not valid`);
    }

    // Retorna el usuario, este va a estar disponible
    // en la req para todos mis endpoints
    return user;
  }
}
