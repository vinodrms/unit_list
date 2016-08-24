import {Component, OnInit, Input } from '@angular/core';
import {ThDateDO} from '../../../../../../../../services/common/data-objects/th-dates/ThDateDO';
import {AppContext, ThError} from '../../../../../../../../../../common/utils/AppContext';
import {CustomScroll} from '../../../../../../../../../../common/utils/directives/CustomScroll';

import {PriceProductYieldResultVM} from '../../../../../../../../services/yield-manager/dashboard/price-products//view-models/PriceProductYieldResultVM';
import {PriceProductYieldItemVM} from '../../../../../../../../services/yield-manager/dashboard/price-products/view-models/PriceProductYieldItemVM';

import {TranslationPipe} from '../../../../../../../../../../common/utils/localization/TranslationPipe'

import {IYieldManagerDashboardPriceProducts} from '../../YieldManagerDashboardComponent'
import {YieldManagerDashboardPriceProductsService} from '../../../../../../../../services/yield-manager/dashboard/price-products/YieldManagerDashboardPriceProductsService';
import {PriceProductYieldParam, PriceProductYieldAction} from '../../../../../../../../services/yield-manager/dashboard/common/PriceProductYieldParam';

import {PriceProductStateComponent} from './components/price-product-state/PriceProductStateComponent';
import {IYieldStateModel} from './components/price-product-state/IYieldStateModel';

import {YieldActionsPanelComponent} from './components/yield-actions-panel/YieldActionsPanelComponent';
import {IActionPaneYieldParams} from './components/yield-actions-panel/YieldActionsPanelComponent';

import {ThDateIntervalDO} from '../../../../../../../../services/common/data-objects/th-dates/ThDateIntervalDO';
import {YieldFilterType} from '../../../../../../../../services/common/data-objects/yield-filter/YieldFilterDO';

import {IFilterSelection} from '../../common/interfaces/IFilterSelection';
import {IFilterVM} from '../../../../../../../../services/yield-manager/dashboard/filter/view-models/IFilterVM';

declare var _:any;

@Component({
	selector: 'yield-price-products',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/yield-manager/dashboard/components/yield-price-products/template/yield-price-products.html',
	directives: [YieldActionsPanelComponent, PriceProductStateComponent, CustomScroll],
	pipes: [TranslationPipe]
})
export class YieldPriceProductsComponent implements OnInit {
	private _yieldManager: IYieldManagerDashboardPriceProducts;
	public priceProductResults: PriceProductYieldResultVM;
	public filteredPriceProduct: PriceProductYieldItemVM[];
	private referenceDate: ThDateDO;
	private selectedFilters:IFilterSelection;
	private selectAllItemsFlag: boolean;
	private itemsSelectionState = null;
	private isYielding: boolean = false;

	constructor(
		private _priceProductsService: YieldManagerDashboardPriceProductsService,
		private _appContext: AppContext
	) {
		this.selectAllItemsFlag = false;
		this.selectedFilters = {
			colorFilter : null,
			textFilter : null,
			searchText : null
		}
	}

	ngOnInit() {
	}

	public refreshTable(date:ThDateDO, noDays:number){
		if (this.priceProductResults){
			this._priceProductsService.refresh({ referenceDate: date, noDays: noDays });
		}
		else {
			this._priceProductsService.getPriceProducts({ referenceDate: date, noDays: noDays }).subscribe((results: PriceProductYieldResultVM) => {
				this.priceProductResults = results;
				this.initializeItemSelectionStateDictionary();
				this.updateFilteredPriceProducts();
			}, (e) => {
				console.log(e);
			});
		}
	}

	private initializeItemSelectionStateDictionary(){
		if (!this.itemsSelectionState){
			this.itemsSelectionState = {};
			this.setItemSelectionStateToAll(false);
		}
	}

	private setItemSelectionStateToAll(selected: boolean){
		this.priceProductResults.priceProductYieldItemVM.forEach(item => {
			this.itemsSelectionState[item.id] = selected;
		});
	}

	public updateFilteredPriceProducts(){
		var filteredByColor: PriceProductYieldItemVM[] = [];
		var filteredByText: PriceProductYieldItemVM[] = [];
		var filteredBySearch: PriceProductYieldItemVM[] = [];

		filteredByColor = this.selectByFilter(this.selectedFilters.colorFilter, this.priceProductResults.priceProductYieldItemVM);
		filteredByText = this.selectByFilter(this.selectedFilters.textFilter, this.priceProductResults.priceProductYieldItemVM);
		filteredBySearch = this.selectBySearchText(this.selectedFilters.searchText, this.priceProductResults.priceProductYieldItemVM);

		var partialFilter = this.intersectFilteredPriceProducts(filteredByColor, filteredByText);
		var partialFilter = this.intersectFilteredPriceProducts(partialFilter, filteredBySearch);
		this.filteredPriceProduct = partialFilter;
	}

	private selectByFilter(filter:IFilterVM, priceProductYieldItemVM: PriceProductYieldItemVM[]):PriceProductYieldItemVM[]{
		var results = [];
		if (filter == null){
			results = priceProductYieldItemVM;
		}
		else{
			results = _.filter(priceProductYieldItemVM, (item: PriceProductYieldItemVM) => {
				var ppFilter:IFilterVM = this.getFilterFromPriceProductByType(filter.filterType, item);
				if (ppFilter && ppFilter.filterId == filter.filterId && ppFilter.valueId == filter.valueId){
					return true;
				}
				return false;
			});
		}
		return results;
	}

	private selectBySearchText(searchText: string, priceProductYieldItemVM: PriceProductYieldItemVM[]):PriceProductYieldItemVM[]{
		var results = [];
		if (this._appContext.thUtils.isUndefinedOrNull(searchText) || searchText == ""){
			results = priceProductYieldItemVM;
		}
		else{
			results = _.filter(priceProductYieldItemVM, (item: PriceProductYieldItemVM) => {
				if (item.name.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) != -1){
					return true;
				}
				return false;
			});
		}
		return results;
	}

	private intersectFilteredPriceProducts(priceProductList1: PriceProductYieldItemVM[], priceProductList2: PriceProductYieldItemVM[]){
		var overlapDictionary = {};
		var intersectionList: PriceProductYieldItemVM[] = [];

		priceProductList1.forEach(element => {
			overlapDictionary[element.id] = 1;
		});

		priceProductList2.forEach(element => {
			if (overlapDictionary[element.id]){
				intersectionList.push(element);
			}
		});

		return intersectionList;
	}

	private getFilterFromPriceProductByType(filterType: YieldFilterType, priceProductYieldItemVM: PriceProductYieldItemVM):IFilterVM{
		if (filterType == YieldFilterType.Color){
			if ((priceProductYieldItemVM.colorFilterList.length > 0)){
				return priceProductYieldItemVM.colorFilterList[0];
			}
		}
		else if (filterType == YieldFilterType.Text){
			if ((priceProductYieldItemVM.textFilterList.length > 0)){
				return priceProductYieldItemVM.textFilterList[0];
			}
		}
		return null;
	}

	public getPriceProductRowClasses(priceProduct:PriceProductYieldItemVM){
		return this.getSelectedRowClasses(priceProduct, (className: string) => {
			return className + '-alpha-1';
		});
	}

	public getSelectedIndicatorClasses(priceProduct:PriceProductYieldItemVM){
		return this.getSelectedRowClasses(priceProduct, (className: string)=>{
			return className;
		});
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
		// this._priceProductsService.refresh({referenceDate: this.referenceDate, noDays: 21});
		this._yieldManager.refresh();
	}

	public applyAction(params:IActionPaneYieldParams){
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
		if(this.isYielding) { return; }
		this.isYielding = true;
		this._priceProductsService.yieldPriceProducts(yieldParams).subscribe(() => {
			this.isYielding = false;
			this.logAnalyticsEvent(yieldParams);
			this.handleStateChange();
		}, (e: ThError) => {
			this.isYielding = false;
			this._appContext.toaster.error(e.message);
		})
	}
	private logAnalyticsEvent(yieldParams: PriceProductYieldParam) {
		var eventDescription = "Yielded " + yieldParams.priceProductIdList.length +
			" Price Products for " + yieldParams.interval.toString() + " with: " + PriceProductYieldAction[yieldParams.action];
		this._appContext.analytics.logEvent("yield-manager", "yield-price-products", eventDescription);
	}

	// public toogleCheckPriceProduct(priceProduct: PriceProductYieldItemVM){
	// 	// alert(this.priceProductSelectionDictionary[priceProduct.priceProductYieldItemDO.priceProductId]);
	// }

	public applyFilters(filters: IFilterSelection){
		this.setItemSelectionStateToAll(false);
		this.selectedFilters = filters;
		this.updateFilteredPriceProducts();
	}
}