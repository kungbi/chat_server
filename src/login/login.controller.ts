import { Controller, Get, Param } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginInput, LoginOutput } from './dtos/Login.dto';

@Controller('user')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Get(':username')
  login(@Param() params: LoginInput): LoginOutput {
    return this.loginService.login(params);
  }

  @Get('info/:username')
  getInfo(@Param() params: LoginInput): LoginOutput {
    return this.loginService.getInfo(params);
  }
}
