import {ThLogger, ThLogLevel} from '../../utils/logging/ThLogger';
import {ThError} from '../../utils/th-responses/ThError';
import {ThStatusCode} from '../../utils/th-responses/ThResponse';
import {AppContext} from '../../utils/AppContext';
import {SessionContext} from '../../utils/SessionContext';
import {SaveAllotmentItemDO} from './SaveAllotmentItemDO';
import {AllotmentMetaRepoDO} from '../../data-layer/allotment/repositories/IAllotmentRepository';
import {AllotmentDO} from '../../data-layer/allotment/data-objects/AllotmentDO';
import {AllotmentConstraintDO} from '../../data-layer/allotment/data-objects/constraint/AllotmentConstraintDO';
import {ValidationResultParser} from '../common/ValidationResultParser';
import {AllotmentItemActionFactory} from './save-actions/AllotmentItemActionFactory';

export class SaveAllotmentItem {
	public static MaxAllotmentIntervalInDays = 1825;

	private _inputDO: SaveAllotmentItemDO;
	private _allotmentDO: AllotmentDO;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
	}

	public save(allotmentDO: SaveAllotmentItemDO): Promise<AllotmentDO> {
		this._inputDO = allotmentDO;
		return new Promise<AllotmentDO>((resolve: { (result: AllotmentDO): void }, reject: { (err: ThError): void }) => {
			try {
				this.saveCore(resolve, reject);
			} catch (error) {
				var thError = new ThError(ThStatusCode.SaveAllotmentItemError, error);
				ThLogger.getInstance().logError(ThLogLevel.Error, "error saving allotment", this._inputDO, thError);
				reject(thError);
			}
		});
	}
	private saveCore(resolve: { (result: AllotmentDO): void }, reject: { (err: ThError): void }) {
		if (!this.submittedStructureIsValid(reject)) {
			return;
		}
		var allRepoMeta = this.buildAllotmentMetaRepoDO();
		var actionFactory = new AllotmentItemActionFactory(this._appContext, this._sessionContext);
		var actionStrategy = actionFactory.getActionStrategy(allRepoMeta, this._allotmentDO);
		actionStrategy.save(resolve, reject);
	}
	private submittedStructureIsValid(reject: { (err: ThError): void }): boolean {
		var validationResult = SaveAllotmentItemDO.getValidationStructure().validateStructure(this._inputDO);
		if (!validationResult.isValid()) {
			var parser = new ValidationResultParser(validationResult, this._inputDO);
			parser.logAndReject("Error validating data for save allotment", reject);
			return false;
		}
		var validConstraints = true;
		this._inputDO.constraints.constraintList.forEach((constraintDO: AllotmentConstraintDO) => {
			var structure = SaveAllotmentItemDO.getConstraintValidationStructure(constraintDO.type);
			if (!structure.validateStructure(constraintDO.constraint).isValid()) {
				validConstraints = false;
			}
		});
		if (!validConstraints) {
			var thError = new ThError(ThStatusCode.SaveAllotmentItemInvalidConstraints, null);
			ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Invalid submitted constraints for allotment", this._inputDO, thError);
			reject(thError);
			return false;
		}
		this._allotmentDO = this.buildAllotmentDO();

		if (!this._allotmentDO.openInterval.isValid()) {
			var thError = new ThError(ThStatusCode.SaveAllotmentItemInvalidInterval, null);
			ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Invalid interval on save allotment", this._inputDO, thError);
			reject(thError);
			return false;
		}
		if (this._allotmentDO.openInterval.getNumberOfDays() > SaveAllotmentItem.MaxAllotmentIntervalInDays) {
			var thError = new ThError(ThStatusCode.SaveAllotmentItemInvalidIntervalLength, null);
			ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Invalid interval on save allotment", this._inputDO, thError);
			reject(thError);
			return false;
		}

		if (!this._allotmentDO.availability.isValid()) {
			var thError = new ThError(ThStatusCode.SaveAllotmentItemInvalidAvailability, null);
			ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Invalid or missing availability options on save allotment", this._inputDO, thError);
			reject(thError);
			return false;
		}
		return true;
	}
	private buildAllotmentDO(): AllotmentDO {
		var allotment = new AllotmentDO();
		allotment.buildFromObject(this._inputDO);
		allotment.hotelId = this._sessionContext.sessionDO.hotel.id;
		return allotment;
	}
	private buildAllotmentMetaRepoDO(): AllotmentMetaRepoDO {
		return {
			hotelId: this._sessionContext.sessionDO.hotel.id
		}
	}
}