import {ThError} from '../../../../../utils/th-responses/ThError';
import {AppContext} from '../../../../../utils/AppContext';
import {SessionContext} from '../../../../../utils/SessionContext';
import {IYieldFilterValueActionStrategy} from '../IYieldFilterValueActionStrategy';
import {YieldFilterValueDO} from '../../../../../data-layer/common/data-objects/yield-filter/YieldFilterValueDO';
import {YieldFilterMetaRepoDO, YieldFilterValueMetaRepoDO} from '../../../../../data-layer/hotel-configurations/repositories/IYieldFilterConfigurationRepository';
import {HotelConfigurationMetaRepoDO} from '../../../../../data-layer/hotel-configurations/repositories/mongo/AMongoHotelConfigurationRepository';
import {YieldFilterConfigurationDO} from '../../../../../data-layer/hotel-configurations/data-objects/yield-filter/YieldFilterConfigurationDO';

export class YieldFilterValueAddStrategy implements IYieldFilterValueActionStrategy {
	private _configurationMeta: HotelConfigurationMetaRepoDO;
    
    constructor(private _appContext: AppContext, private _sessionContext: SessionContext, private _filterMeta: YieldFilterMetaRepoDO, private _yieldFilterValue: YieldFilterValueDO) {
        this._configurationMeta = this.buildHotelConfigurationMetaRepoDO();	
    }
    
	save(resolve: { (result: YieldFilterConfigurationDO): void }, reject: { (err: ThError): void }) {
		var configurationMeta = this.buildHotelConfigurationMetaRepoDO();
        var yieldFilterConfigRepo = this._appContext.getRepositoryFactory().getYieldFilterConfigurationsRepository();
		yieldFilterConfigRepo.addYieldFilterValue(configurationMeta, this._filterMeta, this._yieldFilterValue).then((result: YieldFilterConfigurationDO) => {
			resolve(result);
		}).catch((err: any) => {
			reject(err);
		});
	}
    
	private buildHotelConfigurationMetaRepoDO(): HotelConfigurationMetaRepoDO {
		return {
			hotelId: this._sessionContext.sessionDO.hotel.id
		}
	}
}