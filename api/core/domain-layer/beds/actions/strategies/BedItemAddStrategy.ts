import {ThError} from '../../../../utils/th-responses/ThError';
import {AppContext} from '../../../../utils/AppContext';
import {SessionContext} from '../../../../utils/SessionContext';
import {IBedItemActionStrategy} from '../IBedItemActionStrategy';
import {BedDO} from '../../../../data-layer/common/data-objects/bed/BedDO';
import {BedMetaRepoDO} from '../../../../data-layer/beds/repositories/IBedRepository';

export class BedItemAddStrategy implements IBedItemActionStrategy {
	constructor(private _appContext: AppContext, private _sessionContext: SessionContext, private _bedDO: BedDO) {
	}

	public save(resolve: { (result: BedDO): void }, reject: { (err: ThError): void }) {
		var bedRepo = this._appContext.getRepositoryFactory().getBedRepository();
		var bedMeta = this.buildBedMetaRepoDO();
		bedRepo.addBed(bedMeta, this._bedDO).then((result: BedDO) => {
			resolve(result);
		}).catch((err: any) => {
			reject(err);
		});
	}
	private buildBedMetaRepoDO(): BedMetaRepoDO {
		return {
			hotelId: this._sessionContext.sessionDO.hotel.id
		};
	}
}