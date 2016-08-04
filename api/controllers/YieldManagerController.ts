import {BaseController} from './base/BaseController';
import {ThStatusCode} from '../core/utils/th-responses/ThResponse';
import {PriceProductYielding} from '../core/domain-layer/yield-manager/price-product-yielding/PriceProductYielding';
import {PriceProductDO} from '../core/data-layer/price-products/data-objects/PriceProductDO';
import {PriceProductReader} from '../core/domain-layer/yield-manager/price-product-reader/PriceProductReader';
import {PriceProductYieldResult} from '../core/domain-layer/yield-manager/price-product-reader/utils/PriceProductYieldItem';

export class YieldManagerController extends BaseController {
	public closePriceProducts(req: Express.Request, res: Express.Response) {
		var ppYM = new PriceProductYielding(req.appContext, req.sessionContext);
		ppYM.close(req.body.yieldData).then((priceProductList: PriceProductDO[]) => {
			this.returnSuccesfulResponse(req, res, { priceProductList: priceProductList });
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.YieldManagerControllerErrorClosing);
		});
	}
	public openPriceProducts(req: Express.Request, res: Express.Response) {
		var ppYM = new PriceProductYielding(req.appContext, req.sessionContext);
		ppYM.open(req.body.yieldData).then((priceProductList: PriceProductDO[]) => {
			this.returnSuccesfulResponse(req, res, { priceProductList: priceProductList });
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.YieldManagerControllerErrorOpening);
		});
	}
	public getPriceProductYieldItems(req: Express.Request, res: Express.Response) {
		var ppReader = new PriceProductReader(req.appContext, req.sessionContext);
		ppReader.getYieldItems(req.body.yieldParams).then((yieldResult: PriceProductYieldResult) => {
			this.returnSuccesfulResponse(req, res, { yieldResult: yieldResult });
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.YieldManagerControllerErrorGettingYieldItems);
		});
	}
}

var ymController = new YieldManagerController();
module.exports = {
	closePriceProducts: ymController.closePriceProducts.bind(ymController),
	openPriceProducts: ymController.openPriceProducts.bind(ymController),
	getPriceProductYieldItems: ymController.getPriceProductYieldItems.bind(ymController),
}