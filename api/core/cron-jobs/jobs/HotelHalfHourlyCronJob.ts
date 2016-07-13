import {AppContext} from '../../utils/AppContext';
import {AHalfHourlyCronJob} from '../utils/cron/AHalfHourlyCronJob';
import {ICronJobExecutor} from '../utils/cron/executor/ICronJobExecutor';
import {BulkCronJobExecutor} from '../utils/cron/executor/BulkCronJobExecutor';
import {JobExecutorDO} from '../utils/cron/executor/JobExecutorDO';
import {HotelIterator} from '../utils/hotel-iterator/HotelIterator';
import {HotelDO} from '../../data-layer/hotel/data-objects/HotelDO';
import {ThTimestampDO} from '../../utils/th-dates/data-objects/ThTimestampDO';
import {ThAuditLogger} from '../../utils/logging/ThAuditLogger';
import {AllotmentArchiverCronJobExecutor} from './allotment/AllotmentArchiverCronJobExecutor';
import {BookingStatusChangerCronJobExecutor} from './booking/BookingStatusChangerCronJobExecutor';

import util = require('util');

export class HotelHalfHourlyCronJob extends AHalfHourlyCronJob {
	private _appContext: AppContext;

	protected executeCore(appContext: AppContext) {
		ThAuditLogger.getInstance().log({
			message: "*Half Hourly* process triggered succesfully"
		});

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
		var thTimestamp = ThTimestampDO.buildThTimestampForTimezone(hotel.timezone);
		var executorDO: JobExecutorDO = {
			appContext: this._appContext,
			hotel: hotel,
			thTimestamp: thTimestamp
		}

		if (thTimestamp.isStartOfDay()) {
			var dailyExecutor = this.getDaylyCronJobExecutor(executorDO);
			dailyExecutor.execute();

			ThAuditLogger.getInstance().log({
				message: util.format("*Midnight process* triggered succesfully for hotel *%s*", hotel.contactDetails.name)
			});
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
			new BookingStatusChangerCronJobExecutor(executorDO)
		]);
	}
}