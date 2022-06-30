import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '@wsbm/app/auth/auth.service';
import { UserEntity } from '@wsbm/app/users/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(request: Request, username: string, password: string): Promise<Partial<UserEntity>> {
    const rememberMe: boolean = request.body['rememberMe'] || false;
    return await this.authService.verifyUser({ username, password, rememberMe });
  }
}
