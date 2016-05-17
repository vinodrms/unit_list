import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {LazyLoadRepoDO} from '../../../data-layer/common/repo-data-objects/LazyLoadRepoDO';
import {HotelDO} from '../../../data-layer/hotel/data-objects/HotelDO';

export class HotelIterator {
	private static NumHotelsPerPage = 20;

	constructor(private _appContext: AppContext) {
	}

	public runForEachHotel(hotelCallback: { (hotel: HotelDO): void }) {
		var lazyLoad = new LazyLoadRepoDO();
		lazyLoad.pageNumber = 0;
		lazyLoad.pageSize = HotelIterator.NumHotelsPerPage;
		this.runForEachHotelCore(lazyLoad, hotelCallback);
	}
	private runForEachHotelCore(lazyLoad: LazyLoadRepoDO, hotelCallback: { (hotel: HotelDO): void }) {
		var hotelRepo = this._appContext.getRepositoryFactory().getHotelRepository();
		hotelRepo.getHotelList(lazyLoad).then((hotelList: HotelDO[]) => {
			hotelList.forEach((hotel: HotelDO) => {
				hotelCallback(hotel);
			});
			if (hotelList.length === HotelIterator.NumHotelsPerPage) {
				lazyLoad.pageNumber++;
				this.runForEachHotelCore(lazyLoad, hotelCallback);
			}
		}).catch((error: ThError) => {
			var thError = new ThError(ThStatusCode.HotelIteratorError, error);
			ThLogger.getInstance().logError(ThLogLevel.Error, "[Cron] Error getting hotel page", {}, thError);
		});
	}
}