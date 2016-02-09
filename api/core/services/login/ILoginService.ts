import {HotelDO} from '../../data-layer/hotel/data-objects/HotelDO';
import {UserDO} from '../../data-layer/hotel/data-objects/user/UserDO';

export enum LoginType {
	Basic
}

export interface ILoginService {
	logIn(loginType: LoginType, req: Express.Request): Promise<{ user: UserDO, hotel: HotelDO }>;
}