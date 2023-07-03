import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { RoleProfile } from './role.profile';

@Module({
  providers: [RoleService, RoleProfile],
  controllers: [RoleController]
})
export class RoleModule {}
