import {BaseController} from './base/BaseController';
import {ThStatusCode} from '../core/utils/th-responses/ThResponse';
import {AppContext} from '../core/utils/AppContext';
import {SessionContext} from '../core/utils/SessionContext';
import {SaveBedItem} from '../core/domain-layer/beds/SaveBedItem';
import {BedMetaRepoDO} from '../core/data-layer/beds/repositories/IBedRepository';
import {DeleteBedItem} from '../core/domain-layer/beds/DeleteBedItem';
import {BedDO} from '../core/data-layer/common/data-objects/bed/BedDO';

class BedsController extends BaseController {
	
    public getBedById(req: Express.Request, res: Express.Response) {
		if (!this.precheckGETParameters(req, res, ['id'])) { return };

		var appContext: AppContext = req.appContext;
		var sessionContext: SessionContext = req.sessionContext;

		var bedId = req.query.id;
		var bedMeta = this.getBedMetaRepoDOFrom(sessionContext);

		var bedRepo = appContext.getRepositoryFactory().getBedRepository();
		bedRepo.getBedById(bedMeta, bedId).then((bed: BedDO) => {
			this.returnSuccesfulResponse(req, res, { bed: bed });
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.BedControllerErrorGettingBedById);
		});
	}
    
    public getBedList(req: Express.Request, res: Express.Response) {
		var appContext: AppContext = req.appContext;
		var sessionContext: SessionContext = req.sessionContext;
        
        var bedMeta = this.getBedMetaRepoDOFrom(sessionContext);
        
		var bedRepo = appContext.getRepositoryFactory().getBedRepository();
		bedRepo.getBedList(bedMeta).then((beds: BedDO[]) => {
			this.returnSuccesfulResponse(req, res, { beds: beds });
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.BedControllerErrorGettingBeds);
		});
	}

	public saveBedItem(req: Express.Request, res: Express.Response) {
		var saveBedItem = new SaveBedItem(req.appContext, req.sessionContext);
		saveBedItem.save(req.body.bed).then((updatedBed: BedDO) => {
			this.returnSuccesfulResponse(req, res, { bed: updatedBed });
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.BedControllerErrorSavingBed);
		});
	}

	public deleteBedItem(req: Express.Request, res: Express.Response) {
		var deleteBedItem = new DeleteBedItem(req.appContext, req.sessionContext);
		deleteBedItem.delete(req.body.bed).then((deletedBed: BedDO) => {
			this.returnSuccesfulResponse(req, res, { bed: deletedBed });
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.BedControllerErrorDeletingBed);
		});
	}
    
    private getBedMetaRepoDOFrom(sessionContext: SessionContext): BedMetaRepoDO {
		return { hotelId: sessionContext.sessionDO.hotel.id };
	}
}

var bedsController = new BedsController();
module.exports = {
    getBedById: bedsController.getBedById.bind(bedsController),
	getBedList: bedsController.getBedList.bind(bedsController),
	saveBedItem: bedsController.saveBedItem.bind(bedsController),
	deleteBedItem: bedsController.deleteBedItem.bind(bedsController)
}