import {HotelDO} from '../../../data-layer/hotel/data-objects/HotelDO';
import {UserDO, AccountStatus} from '../../../data-layer/hotel/data-objects/user/UserDO';

export enum HotelAuthenticationType {
	Basic,
	
}

export interface IHotelAuthentication {
	checkCredentials(email: string, password: string): Promise<{ user: UserDO, hotel: HotelDO }>;
}