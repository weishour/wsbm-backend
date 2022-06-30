import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  RemoveEvent,
  Repository,
} from 'typeorm';
import { FilesService } from '@wsbm/app/files/files.service';
import { LabelEntity } from '@wsbm/app/labels/label.entity';
import { LabelGroupEntity } from './label-group.entity';
import { InjectRepository } from '@nestjs/typeorm';

@EventSubscriber()
export class LabelGroupsSubscriber implements EntitySubscriberInterface<LabelGroupEntity> {
  constructor(
    dataSource: DataSource,
    @InjectRepository(LabelEntity) private labelRepository: Repository<LabelEntity>,
    private filesService: FilesService,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return LabelGroupEntity;
  }

  /**
   * 在实体移除之前调用
   */
  async beforeRemove(event: RemoveEvent<LabelGroupEntity>) {
    const labels = await this.labelRepository.find({
      select: { iconName: true },
      where: { group: event.entity },
    });

    const iconNames = labels.map(label => label.iconName);

    if (iconNames.length > 0) this.filesService.removeByName(iconNames);
  }
}
