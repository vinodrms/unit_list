import {BaseController} from './base/BaseController';
import {ThStatusCode} from '../core/utils/th-responses/ThResponse';
import {AppContext} from '../core/utils/AppContext';
import {SessionContext} from '../core/utils/SessionContext';
import {LazyLoadMetaResponseRepoDO} from '../core/data-layer/common/repo-data-objects/LazyLoadRepoDO';
import {CustomerDO} from '../core/data-layer/customers/data-objects/CustomerDO';
import {CustomerMetaRepoDO, CustomerSearchResultRepoDO} from '../core/data-layer/customers/repositories/ICustomerRepository';
import {SaveCustomerItem} from '../core/domain-layer/customers/SaveCustomerItem';

export class CustomersController extends BaseController {
	public getCustomerById(req: any, res: any) {
		if (!this.precheckGETParameters(req, res, ['id'])) { return };

		var appContext: AppContext = req.appContext;
		var sessionContext: SessionContext = req.sessionContext;

		var customerId = req.query.id;
		var custMeta = this.getCustomerMetaRepoDO(sessionContext);

		var custRepo = appContext.getRepositoryFactory().getCustomerRepository();
		custRepo.getCustomerById(custMeta, customerId).then((customer: CustomerDO) => {
			this.returnSuccesfulResponse(req, res, { customer: customer });
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.CustomersControllerErrorGettingCustomer);
		});
	}

	public saveCustomerItem(req: any, res: any) {
		var saveCustItem = new SaveCustomerItem(req.appContext, req.sessionContext);
		saveCustItem.save(req.body.customer).then((savedCustomer: CustomerDO) => {
			this.returnSuccesfulResponse(req, res, { customer: savedCustomer });
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.CustomersControllerErrorSavingCustomer);
		});
	}

	public getCustomerListCount(req: any, res: any) {
		var appContext: AppContext = req.appContext;
		var sessionContext: SessionContext = req.sessionContext;

		var custMeta = this.getCustomerMetaRepoDO(sessionContext);
		var custRepo = appContext.getRepositoryFactory().getCustomerRepository();
		custRepo.getCustomerListCount(custMeta, req.body.searchCriteria).then((lazyLoadMeta: LazyLoadMetaResponseRepoDO) => {
			this.returnSuccesfulResponse(req, res, lazyLoadMeta);
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.CustomersControllerErrorGettingCount);
		});
	}

	public getCustomerList(req: any, res: any) {
		var appContext: AppContext = req.appContext;
		var sessionContext: SessionContext = req.sessionContext;

		var custMeta = this.getCustomerMetaRepoDO(sessionContext);
		var custRepo = appContext.getRepositoryFactory().getCustomerRepository();
		custRepo.getCustomerList(custMeta, req.body.searchCriteria, req.body.lazyLoad).then((custSearchResult: CustomerSearchResultRepoDO) => {
			this.returnSuccesfulResponse(req, res, custSearchResult);
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.CustomersControllerErrorGettingList);
		});
	}

	private getCustomerMetaRepoDO(sessionContext: SessionContext): CustomerMetaRepoDO {
		return { hotelId: sessionContext.sessionDO.hotel.id };
	}
}

var customersController = new CustomersController();
module.exports = {
	getCustomerById: customersController.getCustomerById.bind(customersController),
	saveCustomerItem: customersController.saveCustomerItem.bind(customersController),
	getCustomerListCount: customersController.getCustomerListCount.bind(customersController),
	getCustomerList: customersController.getCustomerList.bind(customersController)
}