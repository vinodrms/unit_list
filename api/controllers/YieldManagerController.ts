import { BaseController } from './base/BaseController';
import { ThStatusCode } from '../core/utils/th-responses/ThResponse';
import { PriceProductYielding } from '../core/domain-layer/yield-manager/price-product-yielding/PriceProductYielding';
import { PriceProductDO } from '../core/data-layer/price-products/data-objects/PriceProductDO';
import { PriceProductReader } from '../core/domain-layer/yield-manager/price-product-reader/PriceProductReader';
import { PriceProductYieldResult } from '../core/domain-layer/yield-manager/price-product-reader/utils/PriceProductYieldItem';
import { KeyMetricReader } from '../core/domain-layer/yield-manager/key-metrics/KeyMetricReader';
import { KeyMetricsResult } from '../core/domain-layer/yield-manager/key-metrics/utils/KeyMetricsResult';
import { DynamicPriceYielding } from "../core/domain-layer/yield-manager/dynamic-price-yielding/DynamicPriceYielding";

export class YieldManagerController extends BaseController {
	public yieldPriceProducts(req: Express.Request, res: Express.Response) {
		var ppYM = new PriceProductYielding(req.appContext, req.sessionContext);
		ppYM.yield(req.body.yieldData).then((priceProductList: PriceProductDO[]) => {
			priceProductList.forEach((priceProduct: PriceProductDO) => { priceProduct.prepareForClient() });
			this.returnSuccesfulResponse(req, res, { priceProductList: priceProductList });
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.YieldManagerControllerErrorClosing);
		});
	}

	public openDynamicPrice(req: Express.Request, res: Express.Response) {
		var dpYielding = new DynamicPriceYielding(req.appContext, req.sessionContext);
		dpYielding.open(req.body.yieldData).then((priceProduct: PriceProductDO) => {
			priceProduct.prepareForClient();
			this.returnSuccesfulResponse(req, res, { priceProduct: priceProduct });
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.YieldManagerControllerErrorOpeningDynamicPrice);
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

	public getKeyMetrics(req: Express.Request, res: Express.Response) {
		var keyMetricReader = new KeyMetricReader(req.appContext, req.sessionContext);
		keyMetricReader.getKeyMetrics(req.body.yieldParams).then((keyMetricsResult: KeyMetricsResult) => {
			this.returnSuccesfulResponse(req, res, { keyMetricsResult: keyMetricsResult });
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.YieldManagerControllerErrorGettingKeyMetrics);
		});
	}
}

var ymController = new YieldManagerController();
module.exports = {
	yieldPriceProducts: ymController.yieldPriceProducts.bind(ymController),
	openDynamicPrice: ymController.openDynamicPrice.bind(ymController),
	getPriceProductYieldItems: ymController.getPriceProductYieldItems.bind(ymController),
	getKeyMetrics: ymController.getKeyMetrics.bind(ymController)
}