import {HotelBasicAuthentication} from '../core/domain-layer/hotel-account/HotelBasicAuthentication';
import {IHotelAuthentication} from '../core/domain-layer/hotel-account/IHotelAuthentication';

module.exports = function(req: Express.Request, res: Express.Response, next: any) {
	req.basicHotelAuthentication = new HotelBasicAuthentication(req.appContext);
	return next();
};