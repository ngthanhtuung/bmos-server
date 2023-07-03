import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SharedModule } from 'src/shared/shared.module';
import { CustomerModule } from '../customer/customer.module';
import { AccountModule } from '../account/account.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from './constants';
import { LocalStrategy } from './local-auth/local.strategy';
import { JwtStrategy } from './jwt-auth/jwt.strategy';
import { StaffModule } from '../staff/staff.module';

@Module({
  imports: [
    SharedModule,
    AccountModule,
    CustomerModule,
    StaffModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.accessTokenSecret,
      signOptions: { expiresIn: '3d' },
    })
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule { }
