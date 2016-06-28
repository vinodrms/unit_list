import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../utils/AppContext';
import {SessionContext} from '../../../../utils/SessionContext';
import {ThDateUtils} from '../../../../utils/th-dates/ThDateUtils';
import {ThDateDO} from '../../../../utils/th-dates/data-objects/ThDateDO';
import {IAllotmentItemActionStrategy} from '../IAllotmentItemActionStrategy';
import {AllotmentDO, AllotmentStatus} from '../../../../data-layer/allotments/data-objects/AllotmentDO';
import {AllotmentMetaRepoDO} from '../../../../data-layer/allotments/repositories/IAllotmentRepository';
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
				this.populateAllotmentExpiryUtcTimestamp();

				var allotmentRepo = this._appContext.getRepositoryFactory().getAllotmentRepository();
				return allotmentRepo.addAllotment(this._allRepoMeta, this._allotmentDO);
			})
			.then((addedAllotment: AllotmentDO) => {
				resolve(addedAllotment);
			}).catch((error: any) => {
				reject(error);
			});
	}
	private populateAllotmentExpiryUtcTimestamp() {
		var expiryDate: ThDateDO = this._thDateUtils.addDaysToThDateDO(this._allotmentDO.openInterval.getEnd().buildPrototype(), 1);
		this._allotmentDO.expiryUtcTimestamp = expiryDate.getUtcTimestamp();
	}
}