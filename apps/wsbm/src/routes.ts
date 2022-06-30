import { Routes } from '@nestjs/core/router';
import { AuthModule } from '@wsbm/app/auth/auth.module';
import { FilesModule } from '@wsbm/app/files/files.module';
import { UsersModule } from '@wsbm/app/users/users.module';
import { MenusModule } from '@wsbm/app/menus/menus.module';
import { LabelGroupsModule } from '@wsbm/app/label-groups/label-groups.module';
import { LabelsModule } from '@wsbm/app/labels/labels.module';
import { SiteModule } from '@wsbm/app/site/site.module';

export const routes: Routes = [
  {
    path: '/auth',
    module: AuthModule,
  },
  {
    path: '/users',
    module: UsersModule,
  },
  {
    path: '/menus',
    module: MenusModule,
  },
  {
    path: '/site',
    module: SiteModule,
  },
  {
    path: '/files',
    module: FilesModule,
  },
  {
    path: '/labels',
    module: LabelsModule,
  },
  {
    path: '/label-groups',
    module: LabelGroupsModule,
  },
];
