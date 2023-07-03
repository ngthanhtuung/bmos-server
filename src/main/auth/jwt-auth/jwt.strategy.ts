import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AccountService } from "src/main/account/account.service";
import { jwtConstants } from "../constants";
import { Injectable } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly accountService: AccountService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtConstants.accessTokenSecret,
        });
    }

    async validate(payload: any) {
        const user = await this.accountService.findUserByEmail(payload.email);
        if (user.refreshToken === null) return null;
        return user;
    }
}