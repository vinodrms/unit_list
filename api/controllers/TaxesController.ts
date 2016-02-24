import {BaseController} from './base/BaseController';
import {ThStatusCode} from '../core/utils/th-responses/ThResponse';
import {AppContext} from '../core/utils/AppContext';
import {SessionContext} from '../core/utils/SessionContext';
import {TaxResponseRepoDO} from '../core/data-layer/taxes/repositories/ITaxRepository';
import {HotelSaveTaxItem} from '../core/domain-layer/taxes/HotelSaveTaxItem';
import {HotelDeleteTaxItem} from '../core/domain-layer/taxes/HotelDeleteTaxItem';
import {TaxDO} from '../core/data-layer/taxes/data-objects/TaxDO';

class TaxesController extends BaseController {
	public getTaxes(req: Express.Request, res: Express.Response) {
		var appContext: AppContext = req.appContext;
		var sessionContext: SessionContext = req.sessionContext;
		var taxRepo = appContext.getRepositoryFactory().getTaxRepository();
		taxRepo.getTaxList({ hotelId: sessionContext.sessionDO.hotel.id }).then((taxes: TaxResponseRepoDO) => {
			this.returnSuccesfulResponse(req, res, { taxes: taxes });
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.TaxControllerErrorGettingTaxes);
		});
	}

	public saveTaxItem(req: Express.Request, res: Express.Response) {
		var saveTaxItem = new HotelSaveTaxItem(req.appContext, req.sessionContext);
		saveTaxItem.save(req.body.tax).then((updatedTax: TaxDO) => {
			this.returnSuccesfulResponse(req, res, { tax: updatedTax });
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.TaxControllerErrorSavingTax);
		});
	}

	public deleteTaxItem(req: Express.Request, res: Express.Response) {
		var deleteTaxItem = new HotelDeleteTaxItem(req.appContext, req.sessionContext);
		deleteTaxItem.delete(req.body.tax).then((deletedTax: TaxDO) => {
			this.returnSuccesfulResponse(req, res, { tax: deletedTax });
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.TaxControllerErrorDeletingTax);
		});
	}
}

var taxesController = new TaxesController();
module.exports = {
	getTaxes: taxesController.getTaxes.bind(taxesController),
	saveTaxItem: taxesController.saveTaxItem.bind(taxesController),
	deleteTaxItem: taxesController.deleteTaxItem.bind(taxesController)
}