import { Module } from '@nestjs/common';
import { RouterModule, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { CoreModule } from '@weishour/core';
import { ValidationProvider } from '@weishour/core/providers';
import { routes } from '@wsbm/routes';
import { AuthModule } from '@wsbm/app/auth/auth.module';
import { FilesModule } from '@wsbm/app/files/files.module';
import { UsersModule } from '@wsbm/app/users/users.module';
import { MenusModule } from '@wsbm/app/menus/menus.module';
import { LabelGroupsModule } from '@wsbm/app/label-groups/label-groups.module';
import { LabelsModule } from '@wsbm/app/labels/labels.module';
import { SiteModule } from '@wsbm/app/site/site.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    RouterModule.register(routes),
    CoreModule,
    AuthModule,
    FilesModule,
    UsersModule,
    MenusModule,
    LabelGroupsModule,
    LabelsModule,
    SiteModule,
  ],
  controllers: [AppController],
  providers: [ValidationProvider, AppService, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  }],
})
export class AppModule {}
