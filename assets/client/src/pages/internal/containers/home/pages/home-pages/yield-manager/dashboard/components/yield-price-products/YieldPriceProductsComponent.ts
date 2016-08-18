import {Component, OnInit, Input } from '@angular/core';
import {ThDateDO} from '../../../../../../../../services/common/data-objects/th-dates/ThDateDO';
import {AppContext} from '../../../../../../../../../../common/utils/AppContext';
import {CustomScroll} from '../../../../../../../../../../common/utils/directives/CustomScroll';

import {PriceProductYieldResultVM} from '../../../../../../../../services/yield-manager/dashboard/price-products//view-models/PriceProductYieldResultVM';
import {PriceProductYieldItemVM} from '../../../../../../../../services/yield-manager/dashboard/price-products/view-models/PriceProductYieldItemVM';

import {TranslationPipe} from '../../../../../../../../../../common/utils/localization/TranslationPipe'

import {IYieldManagerDashboardPriceProducts} from '../../YieldManagerDashboardComponent'
import {YieldManagerDashboardPriceProductsService} from '../../../../../../../../services/yield-manager/dashboard/price-products/YieldManagerDashboardPriceProductsService';

import {PriceProductStateComponent} from './components/price-product-state/PriceProductStateComponent';
import {IYieldStateModel} from './components/price-product-state/IYieldStateModel';

@Component({
	selector: 'yield-price-products',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/yield-manager/dashboard/components/yield-price-products/template/yield-price-products.html',
	directives: [PriceProductStateComponent, CustomScroll],
	pipes: [TranslationPipe]
})
export class YieldPriceProductsComponent implements OnInit {
	private _yieldManager: IYieldManagerDashboardPriceProducts;
	public priceProductResults: PriceProductYieldResultVM;
	private referenceDate: ThDateDO;

	constructor(
		private _priceProductsService: YieldManagerDashboardPriceProductsService,
		private _appContext: AppContext
	) { }

	ngOnInit() { 
		this.referenceDate = ThDateDO.buildThDateDO(2016, 7, 1);
		this._priceProductsService.getPriceProducts({ referenceDate: this.referenceDate, noDays: 21 }).subscribe((results: PriceProductYieldResultVM) => {
			this.priceProductResults = results;
		}, (e) => {
			console.log(e);
		});
	}

	public getDateLabel(date: ThDateDO) {
		return date.getShortDisplayString(this._appContext.thTranslation);
	}	

	public get yieldManager(): IYieldManagerDashboardPriceProducts {
		return this._yieldManager;
	}

	@Input()
	public set yieldManager(yieldManager: IYieldManagerDashboardPriceProducts) {
		this._yieldManager = yieldManager;
	}

	public getYieldStateModel(priceProductResults: PriceProductYieldResultVM, priceProduct: PriceProductYieldItemVM, dayIndex: number):IYieldStateModel{
		return {
			priceProduct : priceProduct,
			date: priceProductResults.dateList[dayIndex],
			stateIndex: dayIndex
		}
	}

	public handleStateChange(){
		this._priceProductsService.refresh({referenceDate: this.referenceDate, noDays: 21});
	}
}