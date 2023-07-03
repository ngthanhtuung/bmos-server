import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './../auth.service';
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import Account from 'src/main/account/account.entity';
import ApiResponse from 'src/shared/res/apiReponse';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: AuthService
    ) {
        super({ passReqToCallback: true, usernameField: 'email', passwordField: 'password' })
    }
    async validate(
        req: Request,
        username: string,
        password: string
    ): Promise<Account> {
        const { role } = req.body as unknown as { role: string };
        const user = await this.authService.validateUser(username, password, role);
        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}