import { Request } from 'express';
import { CurrentUser } from '../types/types';

export interface RequestWithUser extends Request {
  user: CurrentUser;
}
