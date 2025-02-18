import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpUserDto } from './dto/SignUpUser.dto';
import { Response } from 'express';
import { LoginUserDto } from './dto/loginUser.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AccessAuthGuard } from '../common/guards/access-auth.guard';
import { RefreshAuthGuard } from '../common/guards/refresh-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully signed up and tokens returned',
  })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  async singup(@Body() signUpUser: SignUpUserDto, @Res() res: Response) {
    const { user, tokens } = await this.authService.signUp(signUpUser);
    this.authService.putRefreshTokenToCookie(
      'refreshToken',
      tokens.refreshToken,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      res,
    );
    return res
      .status(201)
      .json({ userId: user.id, accessToken: tokens.accessToken });
  }

  @Post('login')
  @ApiOperation({ summary: 'Log in a user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in and access token returned',
  })
  @ApiResponse({ status: 400, description: 'Invalid login credentials' })
  async login(@Body() loginUser: LoginUserDto, @Res() res: Response) {
    const tokens = await this.authService.login(loginUser);
    this.authService.putRefreshTokenToCookie(
      'refreshToken',
      tokens.refreshToken,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      res,
    );

    return res.status(200).json({ accessToken: tokens.accessToken });
  }

  @UseGuards(AccessAuthGuard)
  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Log out a user' })
  @ApiResponse({ status: 200, description: 'User successfully logged out' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(@Res() res: Response) {
    this.authService.clearCookie('refreshToken', res);
    return res.sendStatus(200);
  }

  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh tokens' })
  @ApiResponse({ status: 200, description: 'New access token returned' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async refreshTokens(@CurrentUser() user: any, @Res() res: Response) {
    const newTokens = await this.authService.refreshTokens(user.userId);

    return res.status(200).json({ accessToken: newTokens });
  }
}
