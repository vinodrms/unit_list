import {ThLogger, ThLogLevel} from '../../../../../utils/logging/ThLogger';
import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../../utils/AppContext';
import {SessionContext} from '../../../../../utils/SessionContext';
import {IYieldFilterValueActionStrategy} from '../IYieldFilterValueActionStrategy';
import {YieldFilterValueDO} from '../../../../../data-layer/common/data-objects/yield-filter/YieldFilterValueDO';
import {YieldFilterConfigurationDO} from '../../../../../data-layer/hotel-configurations/data-objects/yield-filter/YieldFilterConfigurationDO';
import {HotelConfigurationMetaRepoDO} from '../../../../../data-layer/hotel-configurations/repositories/mongo/AMongoHotelConfigurationRepository';
import {YieldFilterMetaRepoDO} from '../../../../../data-layer/hotel-configurations/repositories/IYieldFilterConfigurationRepository';

export class YieldFilterValueUpdateStrategy implements IYieldFilterValueActionStrategy {
    private _configurationMeta: HotelConfigurationMetaRepoDO;
    private _loadedYieldFilterConfiguration: YieldFilterConfigurationDO;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext, private _filterMeta: YieldFilterMetaRepoDO, private _yieldFilterValueDO: YieldFilterValueDO) {
        this._configurationMeta = this.buildHotelConfigurationMetaRepoDO();
    }
    save(resolve: { (result: YieldFilterConfigurationDO): void }, reject: { (err: ThError): void }) {
        var yieldFilterConfigRepo = this._appContext.getRepositoryFactory().getYieldFilterConfigurationsRepository();
        yieldFilterConfigRepo.updateYieldFilterValue(this._configurationMeta, this._filterMeta, { filterValueId: this._yieldFilterValueDO.id }, this._yieldFilterValueDO)
            .then((updatedYieldFilterConfiguration: YieldFilterConfigurationDO) => {
                resolve(updatedYieldFilterConfiguration);
            }).catch((error: any) => {
                reject(error);
            });
    }

    private buildHotelConfigurationMetaRepoDO(): HotelConfigurationMetaRepoDO {
        return {
            hotelId: this._sessionContext.sessionDO.hotel.id
        }
    }
}