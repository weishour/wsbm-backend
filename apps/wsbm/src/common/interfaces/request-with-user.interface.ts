import { Request } from 'express';
import { UserEntity } from '@wsbm/app/users/user.entity';

export interface RequestWithUser extends Request {
  user: UserEntity;
}
