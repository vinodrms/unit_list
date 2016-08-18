import {Component, OnInit, Input } from '@angular/core';
import {ThDateDO} from '../../../../../../../../services/common/data-objects/th-dates/ThDateDO';
import {AppContext} from '../../../../../../../../../../common/utils/AppContext';
import {CustomScroll} from '../../../../../../../../../../common/utils/directives/CustomScroll';

import {PriceProductYieldResultVM} from '../../../../../../../../services/yield-manager/dashboard/price-products//view-models/PriceProductYieldResultVM';
import {PriceProductYieldItemVM} from '../../../../../../../../services/yield-manager/dashboard/price-products/view-models/PriceProductYieldItemVM';

import {TranslationPipe} from '../../../../../../../../../../common/utils/localization/TranslationPipe'

import {IYieldManagerDashboardPriceProducts} from '../../YieldManagerDashboardComponent'
import {YieldManagerDashboardPriceProductsService} from '../../../../../../../../services/yield-manager/dashboard/price-products/YieldManagerDashboardPriceProductsService';
import {PriceProductYieldParam} from '../../../../../../../../services/yield-manager/dashboard/common/PriceProductYieldParam';

import {PriceProductStateComponent} from './components/price-product-state/PriceProductStateComponent';
import {IYieldStateModel} from './components/price-product-state/IYieldStateModel';

import {YieldActionsPanelComponent} from './components/yield-actions-panel/YieldActionsPanelComponent';
import {IActionPaneYieldParams} from './components/yield-actions-panel/YieldActionsPanelComponent';

import {ThDateIntervalDO} from '../../../../../../../../services/common/data-objects/th-dates/ThDateIntervalDO';

@Component({
	selector: 'yield-price-products',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/yield-manager/dashboard/components/yield-price-products/template/yield-price-products.html',
	directives: [YieldActionsPanelComponent, PriceProductStateComponent, CustomScroll],
	pipes: [TranslationPipe]
})
export class YieldPriceProductsComponent implements OnInit {
	private _yieldManager: IYieldManagerDashboardPriceProducts;
	public priceProductResults: PriceProductYieldResultVM;
	private referenceDate: ThDateDO;
	private itemsSelectionState = null;

	constructor(
		private _priceProductsService: YieldManagerDashboardPriceProductsService,
		private _appContext: AppContext
	) { }

	ngOnInit() { 
		this.referenceDate = ThDateDO.buildThDateDO(2016, 7, 1);

		this._priceProductsService.getPriceProducts({ referenceDate: this.referenceDate, noDays: 21 }).subscribe((results: PriceProductYieldResultVM) => {
			this.priceProductResults = results;
			debugger;
			this.initializeItemSelectionStateDictionary()
		}, (e) => {
			console.log(e);
		});
	}

	private initializeItemSelectionStateDictionary(){
		if (!this.itemsSelectionState){
			this.itemsSelectionState = {};
			this.priceProductResults.priceProductYieldItemVM.forEach(item => {
				this.itemsSelectionState[item.id] = true;
			});
		}
	}

	public getPriceProductRowClasses(priceProduct:PriceProductYieldItemVM){
		return this.getSelectedRowClasses(priceProduct, (className: string) => {
			return className + '-alpha-1';
		});

		// var color_class = 'default-row-select-color';
		// if (priceProduct.colorFilterList.length > 0){
		// 	color_class = priceProduct.colorFilterList[0].cssClass + '-alpha-1';
		// }
		
		// var results = {};
		// results[color_class] = this.itemsSelectionState[priceProduct.priceProductYieldItemDO.priceProductId];
		// return results;
	}

	public getSelectedIndicatorClasses(priceProduct:PriceProductYieldItemVM){
		return this.getSelectedRowClasses(priceProduct, (className: string)=>{
			return className;
		});
		// var color_class = 'default-row-select-color';
		// if (priceProduct.colorFilterList.length > 0){
		// 	color_class = priceProduct.colorFilterList[0].cssClass + '-alpha-1';
		// }
		
		// var results = {};
		// results[color_class] = this.itemsSelectionState[priceProduct.priceProductYieldItemDO.priceProductId];
		// return results;
	}

	private getSelectedRowClasses(priceProduct:PriceProductYieldItemVM, classTransformer: (className:string) => string){
		var color_class = 'default-row-select-color';
		if (priceProduct.colorFilterList.length > 0){
			color_class = classTransformer(priceProduct.colorFilterList[0].cssClass);
		}
		
		var results = {};
		results[color_class] = this.itemsSelectionState[priceProduct.priceProductYieldItemDO.priceProductId];
		return results;
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

	public applyAction(params:IActionPaneYieldParams){
		debugger;
		var yieldParams: PriceProductYieldParam;
		var selectedPriceProducts = this.getSelectedPriceProductIds();
		yieldParams = {
			priceProductIdList : selectedPriceProducts,
			action: params.action,
			forever: params.forever,
			interval: params.interval
		}

		this.yieldPriceProducts(yieldParams);
	}

	private getSelectedPriceProductIds(){
		var list = [];
		this.priceProductResults.priceProductYieldItemVM.forEach(item => {
			if (this.itemsSelectionState[item.id]){
				list.push(item.priceProductYieldItemDO.priceProductId);
			}
		});
		return list;
	}

	public yieldPriceProducts(yieldParams: PriceProductYieldParam){
		this._priceProductsService.yieldPriceProducts(yieldParams).subscribe(() => {
			this.handleStateChange();
		}, (e) => {
			console.log(e);
		})
	}

	public toogleCheckPriceProduct(priceProduct:PriceProductYieldItemVM){
		// alert(this.priceProductSelectionDictionary[priceProduct.priceProductYieldItemDO.priceProductId]);
	}
}