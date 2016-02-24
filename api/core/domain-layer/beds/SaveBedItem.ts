import {ThLogger, ThLogLevel} from '../../utils/logging/ThLogger';
import {ThError} from '../../utils/th-responses/ThError';
import {ThStatusCode} from '../../utils/th-responses/ThResponse';
import {AppContext} from '../../utils/AppContext';
import {SessionContext} from '../../utils/SessionContext';
import {SaveBedItemDO} from './SaveBedItemDO';
import {ValidationResultParser} from '../common/ValidationResultParser';
import {BedDO} from '../../data-layer/common/data-objects/bed/BedDO';
import {BedItemActionFactory} from './actions/BedItemActionFactory';

export class SaveBedItem {
	private _bedItemDO: SaveBedItemDO;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
	}
	public save(bedItemDO: SaveBedItemDO): Promise<BedDO> {
		this._bedItemDO = bedItemDO;
		return new Promise<BedDO>((resolve: { (result: BedDO): void }, reject: { (err: ThError): void }) => {
			try {
				this.saveCore(resolve, reject);
			} catch (error) {
				var thError = new ThError(ThStatusCode.SaveBedItemError, error);
				ThLogger.getInstance().logError(ThLogLevel.Error, "error saving bed item", this._bedItemDO, thError);
				reject(thError);
			}
		});
	}
	private saveCore(resolve: { (result: BedDO): void }, reject: { (err: ThError): void }) {
		var validationResult = SaveBedItemDO.getValidationStructure().validateStructure(this._bedItemDO);
		if (!validationResult.isValid()) {
			var parser = new ValidationResultParser(validationResult, this._bedItemDO);
			parser.logAndReject("Error validating data for save bed item", reject);
			return;
		}
		var bedDO = this.buildBedDO();

		var actionFactory = new BedItemActionFactory(this._appContext, this._sessionContext);
		var actionStrategy = actionFactory.getActionStrategy(bedDO);
		actionStrategy.save(resolve, reject);
	}
	private buildBedDO(): BedDO {
		var bed = new BedDO();
		bed.buildFromObject(this._bedItemDO);
		bed.hotelId = this._sessionContext.sessionDO.hotel.id;
		return bed;
	}
}