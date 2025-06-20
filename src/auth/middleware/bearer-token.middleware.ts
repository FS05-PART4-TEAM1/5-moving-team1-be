import {
  Injectable,
  NestMiddleware,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { envVariableKeys } from 'src/common/const/env.const';

@Injectable()
export class BearerTokenMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async use(req: Request, _: Response, next: NextFunction) {
    /// Bearer $token
    /// Basic $token
    const authHeader = req.headers['authorization'];

    /// 1) Bearer 토큰이 없을 경우, 인증이 필요 없는 경우
    if (!authHeader) {
      next();
      return;
    }

    /// 2) Bearer 토큰이 있는 경우
    try {
      const token = this.validateBearerToken(authHeader);

      const decodedPayload = this.jwtService.decode(token);
      if (
        decodedPayload.type !== 'refresh' &&
        decodedPayload.type !== 'access'
      ) {
        throw new UnauthorizedException({
          message: '잘못된 토큰 타입입니다',
          errorCode: 'INVALID_TOKEN_TYPE',
        });
      }

      const isRefreshToken = decodedPayload.type === 'refresh';
      const secretKey = isRefreshToken
        ? envVariableKeys.refreshToken
        : envVariableKeys.accessToken;
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>(secretKey),
      });

      req.user = payload;
      next();
    } catch (e) {
      if (e instanceof Error && e.name === 'TokenExpiredError') {
        throw new UnauthorizedException({
          message: '토큰이 만료되었습니다',
          errorCode: 'TOKEN_EXPIRED',
        });
      }
      next();
    }
  }

  validateBearerToken(rawToken: string) {
    const basicSplit = rawToken.split(' ');

    if (basicSplit.length !== 2) {
      throw new BadRequestException('토큰 포맷이 잘못됐습니다!');
    }

    const [bearer, token] = basicSplit;

    if (bearer.toLowerCase() !== 'bearer') {
      throw new BadRequestException('토큰 포맷이 잘못됐습니다!');
    }

    return token;
  }
}
