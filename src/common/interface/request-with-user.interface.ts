import { Request } from 'express';
import { CurrentUser } from '../types/types';

export interface IRequestWithUser extends Request {
  user: CurrentUser;
}
