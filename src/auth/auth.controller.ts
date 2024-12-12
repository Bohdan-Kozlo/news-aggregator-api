import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpUserDto } from './dto/SignUpUser.dto';
import { Response } from 'express';
import { LoginUserDto } from './dto/loginUser.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AccessAuthGuard } from '../common/guards/access-auth.guard';
import { RefreshAuthGuard } from '../common/guards/refresh-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async singup(@Body() signUpUser: SignUpUserDto, @Res() res: Response) {
    const { user, tokens } = await this.authService.signUp(signUpUser);
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    return res
      .status(201)
      .json({ userId: user.id, refreshToken: tokens.refreshToken });
  }

  @Post('login')
  async login(@Body() loginUser: LoginUserDto, @Res() res: Response) {
    const tokens = await this.authService.login(loginUser);
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return res.status(200).json({ accessToken: tokens.accessToken });
  }

  @UseGuards(AccessAuthGuard)
  @Post('logout')
  async logout(@Res() res: Response, @CurrentUser() user: any) {
    res.clearCookie('refreshToken');
    await this.authService.logout(user.userId);
    return res.sendStatus(200);
  }

  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  async refreshTokens(@CurrentUser() user: any, @Res() res: Response) {
    const newTokens = await this.authService.refreshTokens(user.userId);
    res.cookie('refreshToken', newTokens.refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return res.status(200).json({ accessToken: newTokens.accessToken });
  }
}
