import {BaseController} from './base/BaseController';
import {ThStatusCode} from '../core/utils/th-responses/ThResponse';
import {AppContext} from '../core/utils/AppContext';
import {SessionContext} from '../core/utils/SessionContext';
import {LazyLoadMetaResponseRepoDO} from '../core/data-layer/common/repo-data-objects/LazyLoadRepoDO';
import {AddOnProductMetaRepoDO, AddOnProductSearchResultRepoDO} from '../core/data-layer/add-on-products/repositories/IAddOnProductRepository';
import {AddOnProductDO} from '../core/data-layer/add-on-products/data-objects/AddOnProductDO';
import {SaveAddOnProductItem} from '../core/domain-layer/add-on-products/SaveAddOnProductItem';
import {DeleteAddOnProductItem} from '../core/domain-layer/add-on-products/DeleteAddOnProductItem';

export class AddOnProductsController extends BaseController {
	public getAddOnProductById(req: Express.Request, res: Express.Response) {
		if (!this.precheckGETParameters(req, res, ['id'])) { return };

		var appContext: AppContext = req.appContext;
		var sessionContext: SessionContext = req.sessionContext;

		var addOnProductId = req.query.id;
		var aopMeta = this.getAddOnProductMetaRepoDOFrom(sessionContext);

		var addOnProductRepo = appContext.getRepositoryFactory().getAddOnProductRepository();
		addOnProductRepo.getAddOnProductById(aopMeta, addOnProductId).then((addOnProduct: AddOnProductDO) => {
			this.returnSuccesfulResponse(req, res, { addOnProduct: addOnProduct });
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.AddOnProductsControllerErrorGettingAddOnProduct);
		});
	}

	public saveAddOnProductItem(req: Express.Request, res: Express.Response) {
		var saveAopItem = new SaveAddOnProductItem(req.appContext, req.sessionContext);
		saveAopItem.save(req.body.addOnProduct).then((updatedAddOnProduct: AddOnProductDO) => {
			this.returnSuccesfulResponse(req, res, { addOnProduct: updatedAddOnProduct });
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.AddOnProductsControllerErrorSavingAddOnProduct);
		});
	}

	public deleteAddOnProductItem(req: Express.Request, res: Express.Response) {
		var deleteAopItem = new DeleteAddOnProductItem(req.appContext, req.sessionContext);
		deleteAopItem.delete(req.body.addOnProduct).then((deletedAddOnProduct: AddOnProductDO) => {
			this.returnSuccesfulResponse(req, res, { addOnProduct: deletedAddOnProduct });
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.AddOnProductsControllerErrorDeletingAddOnProduct);
		});
	}

	public getAddOnProductCategoryIdList(req: Express.Request, res: Express.Response) {
		var appContext: AppContext = req.appContext;
		var sessionContext: SessionContext = req.sessionContext;

		var aopMeta = this.getAddOnProductMetaRepoDOFrom(sessionContext);
		var addOnProductRepo = appContext.getRepositoryFactory().getAddOnProductRepository();

		addOnProductRepo.getAddOnProductCategoryIdList(aopMeta).then((categoryIdList: string[]) => {
			this.returnSuccesfulResponse(req, res, { categoryIdList: categoryIdList });
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.AddOnProductsControllerErrorGettingCategoryIdList);
		});
	}

	public getAddOnProductListCount(req: Express.Request, res: Express.Response) {
		var appContext: AppContext = req.appContext;
		var sessionContext: SessionContext = req.sessionContext;

		var aopMeta = this.getAddOnProductMetaRepoDOFrom(sessionContext);
		var addOnProductRepo = appContext.getRepositoryFactory().getAddOnProductRepository();
		addOnProductRepo.getAddOnProductListCount(aopMeta, req.body.searchCriteria).then((lazyLoadMeta: LazyLoadMetaResponseRepoDO) => {
			this.returnSuccesfulResponse(req, res, lazyLoadMeta);
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.AddOnProductsControllerErrorGettingCount);
		});
	}

	public getAddOnProductList(req: Express.Request, res: Express.Response) {
		var appContext: AppContext = req.appContext;
		var sessionContext: SessionContext = req.sessionContext;

		var aopMeta = this.getAddOnProductMetaRepoDOFrom(sessionContext);
		var addOnProductRepo = appContext.getRepositoryFactory().getAddOnProductRepository();
		addOnProductRepo.getAddOnProductList(aopMeta, req.body.searchCriteria, req.body.lazyLoad).then((aopSearchResult: AddOnProductSearchResultRepoDO) => {
			this.returnSuccesfulResponse(req, res, aopSearchResult);
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.AddOnProductsControllerErrorGettingList);
		});
	}

	private getAddOnProductMetaRepoDOFrom(sessionContext: SessionContext): AddOnProductMetaRepoDO {
		return { hotelId: sessionContext.sessionDO.hotel.id };
	}
}

var aopController = new AddOnProductsController();
module.exports = {
	getAddOnProductById: aopController.getAddOnProductById.bind(aopController),
	saveAddOnProductItem: aopController.saveAddOnProductItem.bind(aopController),
	deleteAddOnProductItem: aopController.deleteAddOnProductItem.bind(aopController),
	getAddOnProductCategoryIdList: aopController.getAddOnProductCategoryIdList.bind(aopController),
	getAddOnProductListCount: aopController.getAddOnProductListCount.bind(aopController),
	getAddOnProductList: aopController.getAddOnProductList.bind(aopController)
}