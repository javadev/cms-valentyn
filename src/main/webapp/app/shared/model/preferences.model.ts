import { IUser } from 'app/core/user/user.model';

export interface IPreferences {
  id?: number;
  weeklyGoal?: number;
  user?: IUser;
}

export class Preferences implements IPreferences {
  constructor(public id?: number, public weeklyGoal?: number, public user?: IUser) {}
}
