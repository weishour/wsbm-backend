declare const module: any;

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {
  AllExceptionsFilter,
  HttpExceptionFilter,
  QueryFailedExceptionFilter,
} from '@weishour/core/filters';
import { LoggingInterceptor, TransformInterceptor } from '@weishour/core/interceptors';
import { WsConfigService, WsLoggerService } from '@weishour/core/services';
import { ColorUtil, TimeUtil } from '@weishour/core/utils';
import { AppModule } from '@wsbm/app/app.module';
import { AuthModule } from '@wsbm/app/auth/auth.module';
import { FilesModule } from '@wsbm/app/files/files.module';
import { UsersModule } from '@wsbm/app/users/users.module';
import { MenusModule } from '@wsbm/app/menus/menus.module';
import { LabelGroupsModule } from '@wsbm/app/label-groups/label-groups.module';
import { LabelsModule } from '@wsbm/app/labels/labels.module';
import { SiteModule } from '@wsbm/app/site/site.module';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  const wsConfigService = app.get(WsConfigService);
  const colorUtil = app.get(ColorUtil);
  const timeUtil = app.get(TimeUtil);
  const wsLoggerService = app.resolve(WsLoggerService);

  const port = wsConfigService.get<number>('PORT');

  // 全局前缀
  app.setGlobalPrefix('api');

  // 设置HTTP标头
  app.use(helmet());

  // 全局中间件
  app.use(cookieParser());
  // app.use(csurf()); // 跨站点请求伪造

  // 全局拦截器
  app.useGlobalInterceptors(
    new LoggingInterceptor(colorUtil, await wsLoggerService),
    new TransformInterceptor(timeUtil),
  );

  // 全局过滤器
  app.useGlobalFilters(
    new AllExceptionsFilter(timeUtil, await wsLoggerService),
    new HttpExceptionFilter(timeUtil, await wsLoggerService),
    new QueryFailedExceptionFilter(timeUtil, await wsLoggerService),
  );

  // 唯守书签文档
  const wsbmOptions = new DocumentBuilder()
    .setTitle('唯守书签接口')
    .setDescription('唯守书签服务端API文档')
    .setVersion('1.0')
    .build();

  const wsbmDocument = SwaggerModule.createDocument(app, wsbmOptions, {
    include: [
      AuthModule,
      FilesModule,
      UsersModule,
      MenusModule,
      LabelGroupsModule,
      LabelsModule,
      SiteModule,
    ],
  });

  SwaggerModule.setup('docs/wsbm', app, wsbmDocument);

  // 开始监听关闭挂钩
  app.enableShutdownHooks();

  await app.listen(port);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
