import {AppContext} from '../../utils/AppContext';
import {AHalfHourlyCronJob} from '../utils/cron/AHalfHourlyCronJob';
import {ICronJobExecutor} from '../utils/cron/executor/ICronJobExecutor';
import {BulkCronJobExecutor} from '../utils/cron/executor/BulkCronJobExecutor';
import {JobExecutorDO} from '../utils/cron/executor/JobExecutorDO';
import {HotelIterator} from '../utils/hotel-iterator/HotelIterator';
import {HotelDO} from '../../data-layer/hotel/data-objects/HotelDO';
import {ThTimestamp} from '../../utils/th-dates/ThTimestamp';

import {AllotmentArchiverCronJobExecutor} from './allotment/AllotmentArchiverCronJobExecutor';

export class HotelHalfHourlyCronJob extends AHalfHourlyCronJob {
	private _appContext: AppContext;

	protected executeCore(appContext: AppContext) {
		this._appContext = appContext;
		var hotelIterator = new HotelIterator(this._appContext);
		hotelIterator.runForEachHotel((hotel: HotelDO) => {
			this.executeForHotel(hotel);
		});
	}
	private executeForHotel(hotel: HotelDO) {
		if (!hotel.configurationCompleted) {
			return;
		}
		var thTimestamp = new ThTimestamp(hotel.timezone);
		var executorDO: JobExecutorDO = {
			appContext: this._appContext,
			hotel: hotel,
			thTimestamp: thTimestamp
		}

		if (thTimestamp.isStartOfDay()) {
			var dailyExecutor = this.getDaylyCronJobExecutor(executorDO);
			dailyExecutor.execute();
		}

		var halfHourlyExecutor = this.getHalfHourlyCronJobExecutor(executorDO);
		halfHourlyExecutor.execute();
	}

	private getDaylyCronJobExecutor(executorDO: JobExecutorDO): BulkCronJobExecutor {
		return new BulkCronJobExecutor([
			new AllotmentArchiverCronJobExecutor(executorDO)
		]);
	}
	private getHalfHourlyCronJobExecutor(executorDO: JobExecutorDO): BulkCronJobExecutor {
		return new BulkCronJobExecutor([
		]);
	}
}