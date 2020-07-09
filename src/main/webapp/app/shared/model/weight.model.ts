import { Moment } from 'moment';
import { IUser } from 'app/core/user/user.model';

export interface IWeight {
  id?: number;
  date?: Moment;
  weight?: number;
  user?: IUser;
}

export class Weight implements IWeight {
  constructor(public id?: number, public date?: Moment, public weight?: number, public user?: IUser) {}
}
