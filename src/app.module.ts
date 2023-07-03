import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AutoMapperModule } from './auto-mapper/auto-mapper.module';
import { SharedModule } from './shared/shared.module';
import * as Joi from '@hapi/joi';
import { RoleModule } from './main/role/role.module';
import { AccountModule } from './main/account/account.module';
import { CustomerModule } from './main/customer/customer.module';
import { AuthModule } from './main/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { StaffModule } from './main/staff/staff.module';
import { MailModule } from './main/mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      validationSchema: Joi.object({
        MYSQL_PORT: Joi.number().required(),
        PORT: Joi.number(),
      }),
    }),
    DatabaseModule,
    AutoMapperModule,
    SharedModule,
    AuthModule,
    AccountModule,
    CustomerModule,
    RoleModule,
    StaffModule,
    MailModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
