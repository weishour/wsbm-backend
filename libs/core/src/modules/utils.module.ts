import { Module, Global } from '@nestjs/common';
import { ColorUtil, CommonUtil, CryptoUtil, FileUtil, TimeUtil, PinyinUtil } from '@weishour/core/utils';

@Global()
@Module({
  providers: [ColorUtil, CommonUtil, CryptoUtil, FileUtil, TimeUtil, PinyinUtil],
  exports: [ColorUtil, CommonUtil, CryptoUtil, FileUtil, TimeUtil, PinyinUtil],
})
export class UtilsModule {}
