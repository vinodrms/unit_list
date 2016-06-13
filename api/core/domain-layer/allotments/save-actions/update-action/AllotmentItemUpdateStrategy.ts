import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../utils/AppContext';
import {SessionContext} from '../../../../utils/SessionContext';
import {IAllotmentItemActionStrategy} from '../IAllotmentItemActionStrategy';
import {AllotmentDO} from '../../../../data-layer/allotments/data-objects/AllotmentDO';
import {AllotmentMetaRepoDO} from '../../../../data-layer/allotments/repositories/IAllotmentRepository';

export class AllotmentItemUpdateStrategy implements IAllotmentItemActionStrategy {
	constructor(private _appContext: AppContext, private _sessionContext: SessionContext,
		private _allRepoMeta: AllotmentMetaRepoDO, private _allotmentDO: AllotmentDO) {
	}
	public save(resolve: { (result: AllotmentDO): void }, reject: { (err: ThError): void }) {
		var allotmentRepo = this._appContext.getRepositoryFactory().getAllotmentRepository();
		allotmentRepo.getAllotmentById(this._allRepoMeta, this._allotmentDO.id)
			.then((loadedAllotment: AllotmentDO) => {
				return allotmentRepo.updateAllotment(this._allRepoMeta, {
					id: loadedAllotment.id,
					versionId: loadedAllotment.versionId
				}, this._allotmentDO);
			}).then((updatedAllotment: AllotmentDO) => {
				resolve(updatedAllotment);
			}).catch((err: any) => {
				reject(err);
			});
	}
}