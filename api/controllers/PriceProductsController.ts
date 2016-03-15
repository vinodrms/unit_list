import {BaseController} from './base/BaseController';
import {ThStatusCode} from '../core/utils/th-responses/ThResponse';
import {AppContext} from '../core/utils/AppContext';
import {SessionContext} from '../core/utils/SessionContext';
import {LazyLoadMetaResponseRepoDO} from '../core/data-layer/common/repo-data-objects/LazyLoadRepoDO';
import {PriceProductMetaRepoDO, PriceProductSearchResultRepoDO} from '../core/data-layer/price-products/repositories/IPriceProductRepository';
import {PriceProductDO} from '../core/data-layer/price-products/data-objects/PriceProductDO';
import {SavePriceProductItem} from '../core/domain-layer/price-products/SavePriceProductItem';
import {DeletePriceProductItem} from '../core/domain-layer/price-products/DeletePriceProductItem';
import {DraftPriceProductItem} from '../core/domain-layer/price-products/DraftPriceProductItem';
import {ArchivePriceProductItem} from '../core/domain-layer/price-products/ArchivePriceProductItem';

export class PriceProductsController extends BaseController {
	public getPriceProductById(req: Express.Request, res: Express.Response) {
		if (!this.precheckGETParameters(req, res, ['id'])) { return };

		var appContext: AppContext = req.appContext;
		var sessionContext: SessionContext = req.sessionContext;

		var priceProductId = req.query.id;
		var ppMeta = this.getPriceProductMetaRepoDOFrom(sessionContext);

		var priceProductRepo = appContext.getRepositoryFactory().getPriceProductRepository();
		priceProductRepo.getPriceProductById(ppMeta, priceProductId).then((priceProduct: PriceProductDO) => {
			this.returnSuccesfulResponse(req, res, { priceProduct: priceProduct });
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.PriceProductsControllerErrorGettingPriceProduct);
		});
	}
	public savePriceProductItem(req: Express.Request, res: Express.Response) {
		var savePpItem = new SavePriceProductItem(req.appContext, req.sessionContext);
		savePpItem.save(req.body.priceProduct).then((updatedPriceProduct: PriceProductDO) => {
			this.returnSuccesfulResponse(req, res, { priceProduct: updatedPriceProduct });
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.PriceProductsControllerErrorSavingPriceProduct);
		});
	}
	public archivePriceProductItem(req: Express.Request, res: Express.Response) {
		var archivePpItem = new ArchivePriceProductItem(req.appContext, req.sessionContext);
		archivePpItem.archive(req.body.priceProduct).then((archivedPriceProduct: PriceProductDO) => {
			this.returnSuccesfulResponse(req, res, { priceProduct: archivedPriceProduct });
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.PriceProductsControllerErrorArchivingProduct);
		});
	}
	public deletePriceProductItem(req: Express.Request, res: Express.Response) {
		var deletePpItem = new DeletePriceProductItem(req.appContext, req.sessionContext);
		deletePpItem.delete(req.body.priceProduct).then((deletedPriceProduct: PriceProductDO) => {
			this.returnSuccesfulResponse(req, res, { priceProduct: deletedPriceProduct });
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.PriceProductsControllerErrorDeletingPriceProduct);
		});
	}
	public draftPriceProductItem(req: Express.Request, res: Express.Response) {
		var draftPpItem = new DraftPriceProductItem(req.appContext, req.sessionContext);
		draftPpItem.draft(req.body.priceProduct).then((draftPriceProduct: PriceProductDO) => {
			this.returnSuccesfulResponse(req, res, { priceProduct: draftPriceProduct });
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.PriceProductsControllerErrorMarkingPriceProductAsDraft);
		});
	}

	public getPriceProductListCount(req: Express.Request, res: Express.Response) {
		var appContext: AppContext = req.appContext;
		var sessionContext: SessionContext = req.sessionContext;

		var ppMeta = this.getPriceProductMetaRepoDOFrom(sessionContext);
		var priceProductRepo = appContext.getRepositoryFactory().getPriceProductRepository();
		priceProductRepo.getPriceProductListCount(ppMeta, req.body.searchCriteria).then((lazyLoadMeta: LazyLoadMetaResponseRepoDO) => {
			this.returnSuccesfulResponse(req, res, lazyLoadMeta);
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.PriceProductsControllerErrorGettingCount);
		});
	}
	public getPriceProductList(req: Express.Request, res: Express.Response) {
		var appContext: AppContext = req.appContext;
		var sessionContext: SessionContext = req.sessionContext;

		var ppMeta = this.getPriceProductMetaRepoDOFrom(sessionContext);
		var priceProductRepo = appContext.getRepositoryFactory().getPriceProductRepository();
		priceProductRepo.getPriceProductList(ppMeta, req.body.searchCriteria, req.body.lazyLoad).then((ppSearchResult: PriceProductSearchResultRepoDO) => {
			this.returnSuccesfulResponse(req, res, ppSearchResult);
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.PriceProductsControllerErrorGettingList);
		});
	}

	private getPriceProductMetaRepoDOFrom(sessionContext: SessionContext): PriceProductMetaRepoDO {
		return { hotelId: sessionContext.sessionDO.hotel.id };
	}
}

var ppController = new PriceProductsController();
module.exports = {
	getPriceProductById: ppController.getPriceProductById.bind(ppController),
	savePriceProductItem: ppController.savePriceProductItem.bind(ppController),
	archivePriceProductItem: ppController.archivePriceProductItem.bind(ppController),
	deletePriceProductItem: ppController.deletePriceProductItem.bind(ppController),
	draftPriceProductItem: ppController.draftPriceProductItem.bind(ppController),
	getPriceProductListCount: ppController.getPriceProductListCount.bind(ppController),
	getPriceProductList: ppController.getPriceProductList.bind(ppController)
}