import { BaseController } from './base/BaseController';
import { ThStatusCode } from '../core/utils/th-responses/ThResponse';
import { PriceProductYielding } from '../core/domain-layer/yield-manager/price-product-yielding/PriceProductYielding';
import { PriceProductDO } from '../core/data-layer/price-products/data-objects/PriceProductDO';
import { PriceProductReader } from '../core/domain-layer/yield-manager/price-product-reader/PriceProductReader';
import { PriceProductYieldResult } from '../core/domain-layer/yield-manager/price-product-reader/utils/PriceProductYieldItem';
import { KeyMetricReader } from '../core/domain-layer/yield-manager/key-metrics/KeyMetricReader';
import { KeyMetricsResult } from '../core/domain-layer/yield-manager/key-metrics/utils/KeyMetricsResult';
import { DynamicPriceYielding } from "../core/domain-layer/yield-manager/dynamic-price-yielding/DynamicPriceYielding";
import { KeyMetricsReaderInputBuilder } from "../core/domain-layer/yield-manager/key-metrics/utils/KeyMetricsReaderInputBuilder";
import { CommissionOption } from "../core/domain-layer/yield-manager/key-metrics/utils/KeyMetricsReaderInput";
import { KeyMetricOutputType } from "../core/domain-layer/yield-manager/key-metrics/utils/builder/MetricBuilderStrategyFactory";

export class YieldManagerController extends BaseController {
	public yieldPriceProducts(req: any, res: any) {
		var ppYM = new PriceProductYielding(req.appContext, req.sessionContext);
		ppYM.yield(req.body.yieldData).then((priceProductList: PriceProductDO[]) => {
			priceProductList.forEach((priceProduct: PriceProductDO) => { priceProduct.prepareForClient() });
			this.returnSuccesfulResponse(req, res, { priceProductList: priceProductList });
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.YieldManagerControllerErrorClosing);
		});
	}

	public openDynamicPrice(req: any, res: any) {
		var dpYielding = new DynamicPriceYielding(req.appContext, req.sessionContext);
		dpYielding.open(req.body.yieldData).then((priceProduct: PriceProductDO) => {
			priceProduct.prepareForClient();
			this.returnSuccesfulResponse(req, res, { priceProduct: priceProduct });
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.YieldManagerControllerErrorOpeningDynamicPrice);
		});
	}

	public getPriceProductYieldItems(req: any, res: any) {
		var ppReader = new PriceProductReader(req.appContext, req.sessionContext);
		ppReader.getYieldItems(req.body.yieldParams).then((yieldResult: PriceProductYieldResult) => {
			this.returnSuccesfulResponse(req, res, { yieldResult: yieldResult });
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.YieldManagerControllerErrorGettingYieldItems);
		});
	}

	public getKeyMetrics(req: any, res: any) {
		var keyMetricReader = new KeyMetricReader(req.appContext, req.sessionContext);
		keyMetricReader.getKeyMetrics(
			new KeyMetricsReaderInputBuilder()
				.setYieldManagerPeriodDO(req.body.yieldParams)
				.setCommissionOption(CommissionOption.INCLUDE_AND_BOTH_FOR_ROOM_REVENUE)
				.excludeVat(false)
				.build(),
			KeyMetricOutputType.YieldManager
		).then((keyMetricsResult: KeyMetricsResult) => {
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