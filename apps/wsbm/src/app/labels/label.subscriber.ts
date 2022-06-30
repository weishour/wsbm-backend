import { DataSource, EntitySubscriberInterface, EventSubscriber, RemoveEvent } from 'typeorm';
import { FilesService } from '@wsbm/app/files/files.service';
import { LabelEntity } from './label.entity';

@EventSubscriber()
export class LabelSubscriber implements EntitySubscriberInterface<LabelEntity> {
  constructor(dataSource: DataSource, private filesService: FilesService) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return LabelEntity;
  }

  /**
   * 在实体移除之前调用
   */
  beforeRemove(event: RemoveEvent<LabelEntity>) {
    this.filesService.removeByName(event.entity.iconName);
  }
}
