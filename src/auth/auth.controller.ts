import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from './guard/auth.guard';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDoctorDto: LoginUserDto) {
    return this.authService.login(loginDoctorDto);
  }

  @Get('checkToken')
  @UseGuards(JwtAuthGuard)
  checkToken(@GetUser() user: User) {
    return this.authService.checkToken(user);
  }
}
