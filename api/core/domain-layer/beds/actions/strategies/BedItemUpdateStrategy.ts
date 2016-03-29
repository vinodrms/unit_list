import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../utils/AppContext';
import {SessionContext} from '../../../../utils/SessionContext';
import {IBedItemActionStrategy} from '../IBedItemActionStrategy';
import {BedDO} from '../../../../data-layer/common/data-objects/bed/BedDO';
import {BedMetaRepoDO, BedItemMetaRepoDO} from '../../../../data-layer/beds/repositories/IBedRepository';

export class BedItemUpdateStrategy implements IBedItemActionStrategy {
	private _bedMeta: BedMetaRepoDO;
	private _loadedBed: BedDO;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext, private _bedDO: BedDO) {
		this._bedMeta = this.buildBedMetaRepoDO()
	}

	public save(resolve: { (result: BedDO): void }, reject: { (err: ThError): void }) {
		var bedRepo = this._appContext.getRepositoryFactory().getBedRepository();
		bedRepo.getBedById(this._bedMeta, this._bedDO.id)
			.then((loadedBed: BedDO) => {
				this._loadedBed = loadedBed;

				var bedRepo = this._appContext.getRepositoryFactory().getBedRepository();
				var itemMeta = this.buildBedItemMetaRepoDO();

				return bedRepo.updateBed(this._bedMeta, itemMeta, this._bedDO);
			})
			.then((result: BedDO) => {
				resolve(result);
			})
			.catch((error: any) => {
				var thError = new ThError(ThStatusCode.BedItemUpdateStrategyErrorUpdating, error);
				if (thError.isNativeError()) {
					ThLogger.getInstance().logError(ThLogLevel.Error, "error updating bed item", this._bedDO, thError);
				}
				reject(thError);
			});
	}
	private buildBedMetaRepoDO(): BedMetaRepoDO {
		return {
			hotelId: this._sessionContext.sessionDO.hotel.id
		};
	}
	private buildBedItemMetaRepoDO(): BedItemMetaRepoDO {
		return {
			id: this._loadedBed.id,
			versionId: this._loadedBed.versionId
		};
	}
}