import {ThLogger, ThLogLevel} from '../../utils/logging/ThLogger';
import {ThError} from '../../utils/th-responses/ThError';
import {ThStatusCode} from '../../utils/th-responses/ThResponse';
import {AppContext} from '../../utils/AppContext';
import {SessionContext} from '../../utils/SessionContext';
import {IValidationStructure} from '../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../utils/th-validation/structure/ObjectValidationStructure';
import {PrimitiveValidationStructure} from '../../utils/th-validation/structure/PrimitiveValidationStructure';
import {StringValidationRule} from '../../utils/th-validation/rules/StringValidationRule';
import {AllotmentDO, AllotmentStatus} from '../../data-layer/allotment/data-objects/AllotmentDO';
import {ValidationResultParser} from '../common/ValidationResultParser';

export class ArchiveAllotmentItemDO {
	id: string;
	public static getValidationStructure(): IValidationStructure {
		return new ObjectValidationStructure([
			{
				key: "id",
				validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
			}
		])
	}
}

export class ArchiveAllotmentItem {
	private _inputDO: ArchiveAllotmentItemDO;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
	}

	public archive(allotmentDO: ArchiveAllotmentItemDO): Promise<AllotmentDO> {
		this._inputDO = allotmentDO;
		return new Promise<AllotmentDO>((resolve: { (result: AllotmentDO): void }, reject: { (err: ThError): void }) => {
			try {
				this.archiveCore(resolve, reject);
			} catch (error) {
				var thError = new ThError(ThStatusCode.ArchiveAllotmentItemError, error);
				ThLogger.getInstance().logError(ThLogLevel.Error, "error archiving allotment", this._inputDO, thError);
				reject(thError);
			}
		});
	}
	private archiveCore(resolve: { (result: AllotmentDO): void }, reject: { (err: ThError): void }) {
		var validationResult = ArchiveAllotmentItemDO.getValidationStructure().validateStructure(this._inputDO);
		if (!validationResult.isValid()) {
			var parser = new ValidationResultParser(validationResult, this._inputDO);
			parser.logAndReject("Error validating data for archive allotment", reject);
			return false;
		}

		var allotmentRepo = this._appContext.getRepositoryFactory().getAllotmentRepository();
		allotmentRepo.getAllotmentById({ hotelId: this._sessionContext.sessionDO.hotel.id }, this._inputDO.id)
			.then((loadedAllotment: AllotmentDO) => {
				if (loadedAllotment.status !== AllotmentStatus.Active) {
					var thError = new ThError(ThStatusCode.ArchiveAllotmentItemNotActiveAllotment, null);
					ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Error archiving allotment: not active allotment", this._inputDO, thError);
					throw thError;
				}
				return allotmentRepo.updateAllotmentStatus({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
					id: loadedAllotment.id,
					versionId: loadedAllotment.versionId
				}, AllotmentStatus.Archived);
			}).then((updatedAllotment: AllotmentDO) => {
				resolve(updatedAllotment);
			}).catch((err: any) => {
				reject(err);
			});
	}
}