import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../utils/AppContext';
import {SessionContext} from '../../../../utils/SessionContext';
import {ThDateUtils} from '../../../../utils/th-dates/ThDateUtils';
import {ThDateDO} from '../../../../utils/th-dates/data-objects/ThDateDO';
import {IAllotmentItemActionStrategy} from '../IAllotmentItemActionStrategy';
import {AllotmentDO, AllotmentStatus} from '../../../../data-layer/allotment/data-objects/AllotmentDO';
import {AllotmentMetaRepoDO} from '../../../../data-layer/allotment/repositories/IAllotmentRepository';
import {AllotmentInventoryForDateDO} from '../../../../data-layer/allotment/data-objects/inventory/AllotmentInventoryForDateDO';
import {AllotmentValidator} from '../../validators/AllotmentValidator';

export class AllotmentItemAddStrategy implements IAllotmentItemActionStrategy {
	private _thDateUtils: ThDateUtils;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext,
		private _allRepoMeta: AllotmentMetaRepoDO, private _allotmentDO: AllotmentDO) {
		this._thDateUtils = new ThDateUtils();
	}
	public save(resolve: { (result: AllotmentDO): void }, reject: { (err: ThError): void }) {
		this._allotmentDO.status = AllotmentStatus.Active;

		var allotmentValidator = new AllotmentValidator(this._appContext, this._sessionContext);
		allotmentValidator.validateAllotment(this._allotmentDO)
			.then((result: boolean) => {
				this.populateDefaultAllotmentInventory();

				var allotmentRepo = this._appContext.getRepositoryFactory().getAllotmentRepository();
				return allotmentRepo.addAllotment(this._allRepoMeta, this._allotmentDO);
			})
			.then((addedAllotment: AllotmentDO) => {
				resolve(addedAllotment);
			}).catch((error: any) => {
				reject(error);
			});
	}
	private populateDefaultAllotmentInventory() {
		var intervalStart = this._allotmentDO.openInterval.getStart();
		var intervalEnd = this._allotmentDO.openInterval.getEnd();

		this._allotmentDO.inventory.inventoryForDateList = [];
		var currentDate = intervalStart.buildPrototype();

		while (!intervalEnd.isBefore(currentDate)) {
			var allotmentForDate = new AllotmentInventoryForDateDO();
			allotmentForDate.thDate = currentDate;
			var allotmentAvailabilityForDay = this._allotmentDO.availability.getAllotmentAvailabilityForDay(currentDate.getISOWeekDay());
			allotmentForDate.availableCount = allotmentAvailabilityForDay.availableCount;
			this._allotmentDO.inventory.inventoryForDateList.push(allotmentForDate);

			var nextDate = currentDate.buildPrototype();
			nextDate = this._thDateUtils.addDaysToThDateDO(nextDate, 1);
			currentDate = nextDate;
		}
		
		var expiryDate: ThDateDO = this._thDateUtils.addDaysToThDateDO(this._allotmentDO.openInterval.getEnd().buildPrototype(), 1);
		this._allotmentDO.expiryUtcTimestamp = expiryDate.getUtcTimestamp();
	}
}