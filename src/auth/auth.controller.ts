import {
  applyDecorators,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';
import { LocalAuthGuard } from './strategy/local.strategy';
import { JwtPayload } from 'src/common/types/payload.type';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import {
  ApiLogin,
  ApiLogout,
  ApiRegister,
  ApiRotateToken,
  ApiSocialLogin,
} from './docs/swagger';
import { UserInfo } from '@/user/decorator/user-info.decorator';
import { SnSAuthGuard } from './guard/sns.guard';
import { UserService } from '@/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Public()
  @Post('register')
  @applyDecorators(...ApiRegister())
  registerLocal(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  /*로컬 로그인 서비스*/
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @applyDecorators(...ApiLogin())
  async loginLocal(@Request() req: { user: JwtPayload }) {
    return this.authService.login(req.user);
  }

  /*소셜 로그인 서비스*/
  @Public()
  @UseGuards(SnSAuthGuard)
  @Get('login/:social')
  @ApiSocialLogin()
  socialLogin() {
    return;
  }

  @Public()
  @UseGuards(SnSAuthGuard)
  @Get('/callback/:social')
  socialCallback(@Request() req: { user: JwtPayload }) {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('token/access')
  @ApiRotateToken()
  async rotate(
    @Body('refreshToken') refreshToken: string,
  ): Promise<{ accessToken: string }> {
    return this.authService.rotateAccessToken(refreshToken);
  }

  @Post('logout')
  @ApiLogout()
  @HttpCode(HttpStatus.OK)
  async logout(@UserInfo() userInfo: UserInfo) {
    return await this.authService.logout(userInfo.sub);
  }
}
