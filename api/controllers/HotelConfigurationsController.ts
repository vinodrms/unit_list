import {BaseController} from './base/BaseController';
import {ThStatusCode} from '../core/utils/th-responses/ThResponse';
import {AppContext} from '../core/utils/AppContext';
import {SessionContext} from '../core/utils/SessionContext';
import {LazyLoadMetaResponseRepoDO} from '../core/data-layer/common/repo-data-objects/LazyLoadRepoDO';
import {HotelConfigurationMetaRepoDO} from '../core/data-layer/hotel-configurations/repositories/mongo/AMongoHotelConfigurationRepository';
import {YieldFilterConfigurationDO} from '../core/data-layer/hotel-configurations/data-objects/yield-filter/YieldFilterConfigurationDO';
import {SaveYieldFilterValue} from '../core/domain-layer/hotel-configurations/yield-filter/SaveYieldFilterValue';
import {YieldFilterValueDO} from '../core/data-layer/common/data-objects/yield-filter/YieldFilterValueDO';

class HotelConfigurationsController extends BaseController {
	
    public getYieldFilterConfiguration(req: any, res: any) {
		
		var appContext: AppContext = req.appContext;
		var sessionContext: SessionContext = req.sessionContext;
        
        var configMeta = this.getHotelConfigurationMetaRepoDOFrom(sessionContext);
        var yieldFilterRepo = appContext.getRepositoryFactory().getYieldFilterConfigurationsRepository();
        yieldFilterRepo.getYieldFilterConfiguration(configMeta).then((foundYieldFilterConfig: YieldFilterConfigurationDO) => {
            this.returnSuccesfulResponse(req, res, { yieldFilterConfig: foundYieldFilterConfig });
        }).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.HotelConfigurationControlllerErrorGettingYieldFilterConfig);
		});
	}

    public saveYieldFilterValue(req: any, res: any) {
		
		var appContext: AppContext = req.appContext;
		var sessionContext: SessionContext = req.sessionContext;
        
        var saveYieldFilterValue = new SaveYieldFilterValue(appContext, sessionContext);
		saveYieldFilterValue.save(req.body.yieldFilterValue).then((yieldFilterValue: YieldFilterValueDO) => {
			this.returnSuccesfulResponse(req, res, { yieldFilterValue: yieldFilterValue });
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.HotelConfigurationControlllerErrorSavingYieldFilterValue);
		});
	}
    
    private getHotelConfigurationMetaRepoDOFrom(sessionContext: SessionContext): HotelConfigurationMetaRepoDO {
		return { hotelId: sessionContext.sessionDO.hotel.id };
	}
}

var hotelConfigurationsController = new HotelConfigurationsController();
module.exports = {
    getYieldFilterConfiguration: hotelConfigurationsController.getYieldFilterConfiguration.bind(hotelConfigurationsController),
    saveYieldFilterValue: hotelConfigurationsController.saveYieldFilterValue.bind(hotelConfigurationsController)
}