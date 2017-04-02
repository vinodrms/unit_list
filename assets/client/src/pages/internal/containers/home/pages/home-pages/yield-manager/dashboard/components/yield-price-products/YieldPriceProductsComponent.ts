import { Component, Input, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import { ThDateDO } from '../../../../../../../../services/common/data-objects/th-dates/ThDateDO';
import { AppContext, ThError } from '../../../../../../../../../../common/utils/AppContext';
import { ColorFilterVM } from '../../../../../../../../services/yield-manager/dashboard/filter/view-models/ColorFilterVM';
import { TextFilterVM } from '../../../../../../../../services/yield-manager/dashboard/filter/view-models/TextFilterVM';
import { FilterVMCollection } from '../../../../../../../../services/yield-manager/dashboard/filter/utils/FilterVMCollection';
import { YieldManagerDashboardFilterService } from '../../../../../../../../services/yield-manager/dashboard/filter/YieldManagerDashboardFilterService';
import { PriceProductYieldResultVM } from '../../../../../../../../services/yield-manager/dashboard/price-products//view-models/PriceProductYieldResultVM';
import { PriceProductYieldItemVM } from '../../../../../../../../services/yield-manager/dashboard/price-products/view-models/PriceProductYieldItemVM';
import { IYieldManagerDashboardPriceProducts } from '../../YieldManagerDashboardComponent'
import { YieldManagerDashboardPriceProductsService } from '../../../../../../../../services/yield-manager/dashboard/price-products/YieldManagerDashboardPriceProductsService';
import { PriceProductYieldParam, PriceProductYieldAction } from '../../../../../../../../services/yield-manager/dashboard/common/PriceProductYieldParam';
import { IYieldStateModel } from './components/price-product-state/IYieldStateModel';
import { YieldActionsPanelComponent } from './components/yield-actions-panel/YieldActionsPanelComponent';
import { IActionPaneYieldParams } from './components/yield-actions-panel/YieldActionsPanelComponent';
import { ThDateIntervalDO } from '../../../../../../../../services/common/data-objects/th-dates/ThDateIntervalDO';
import { YieldFilterType } from '../../../../../../../../services/common/data-objects/yield-filter/YieldFilterDO';
import { IFilterSelection } from '../../common/interfaces/IFilterSelection';
import { IFilterVM } from '../../../../../../../../services/yield-manager/dashboard/filter/view-models/IFilterVM';
import { YieldItemStateType } from "../../../../../../../../services/yield-manager/dashboard/price-products/data-objects/YieldItemStateDO";
import { DynamicPriceYieldItemDO } from "../../../../../../../../services/yield-manager/dashboard/price-products/data-objects/DynamicPriceYieldItemDO";
import { HotelAggregatedInfo } from "../../../../../../../../services/hotel/utils/HotelAggregatedInfo";
import { HotelAggregatorService } from "../../../../../../../../services/hotel/HotelAggregatorService";
import { YieldDynamicPriceModalService } from "./yield-dynamic-price-modal/services/YieldDynamicPriceModalService";
import { ModalDialogRef } from "../../../../../../../../../../common/utils/modals/utils/ModalDialogRef";
import { PriceProductDO } from "../../../../../../../../services/price-products/data-objects/PriceProductDO";

@Component({
	selector: 'yield-price-products',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/yield-manager/dashboard/components/yield-price-products/template/yield-price-products.html',
	providers: [YieldDynamicPriceModalService]
})
export class YieldPriceProductsComponent {
	@ViewChild(YieldActionsPanelComponent) actionsPanelComponent: YieldActionsPanelComponent;

	private _yieldManager: IYieldManagerDashboardPriceProducts;
	public priceProductResults: PriceProductYieldResultVM;
	public yieldColorFilterCollection: FilterVMCollection<ColorFilterVM>;
	public yieldTextFilterCollection: FilterVMCollection<TextFilterVM>;
	public filteredPriceProduct: PriceProductYieldItemVM[] = [];
	private referenceDate: ThDateDO;
	private selectedFilters: IFilterSelection;
	private selectAllItemsFlag: boolean;
	private itemsSelectionState = null;
	private isYielding: boolean = false;
	private ccyNativeSymbol = '';
	private expandedPriceProductIds: { [id: string]: boolean };

	constructor(
		private _appContext: AppContext,
		private _yieldPriceProductsService: YieldManagerDashboardPriceProductsService,
		private _filterService: YieldManagerDashboardFilterService,
		private _hotelAggregatorService: HotelAggregatorService,
		private _yieldDynamicPriceModal: YieldDynamicPriceModalService
	) {
		this.selectAllItemsFlag = false;
		this.selectedFilters = {
			colorFilter: null,
			textFilter: null,
			searchText: null
		}
		this.expandedPriceProductIds = {};
	}

	public refreshTable(date: ThDateDO, noDays: number) {
		if (this.priceProductResults) {
			this._yieldPriceProductsService.refresh({ referenceDate: date, noDays: noDays });
		}
		else {
			Observable.combineLatest(
				this._yieldPriceProductsService.getPriceProducts({ referenceDate: date, noDays: noDays }),
				this._filterService.getColorFilterCollections(),
				this._filterService.getTextFilterCollections(),
				this._hotelAggregatorService.getHotelAggregatedInfo()
			).subscribe((results: [PriceProductYieldResultVM, FilterVMCollection<ColorFilterVM>[], FilterVMCollection<TextFilterVM>[], HotelAggregatedInfo]) => {
				this.priceProductResults = results[0];
				this.yieldColorFilterCollection = results[1][0];
				this.yieldTextFilterCollection = results[2][0];
				this.ccyNativeSymbol = results[3].ccy.nativeSymbol;

				this.initializeItemSelectionStateDictionary();
				this.updateFilteredPriceProducts();
			});
			this._yieldPriceProductsService.getPriceProducts({ referenceDate: date, noDays: noDays }).subscribe((results: PriceProductYieldResultVM) => {
				this.priceProductResults = results;
				this.initializeItemSelectionStateDictionary();
				this.updateFilteredPriceProducts();
			}, (e) => {
				console.log(e);
			});
		}
	}

	private initializeItemSelectionStateDictionary() {
		if (!this.itemsSelectionState) {
			this.itemsSelectionState = {};
			this.setItemSelectionStateToAll(false);
		}
	}

	private setItemSelectionStateToAll(selected: boolean) {
		this.selectAllItemsFlag = selected;
		this.priceProductResults.priceProductYieldItemVM.forEach(item => {
			this.itemsSelectionState[item.id] = false;
		});
		this.filteredPriceProduct.forEach(item => {
			if (!item.lastRoomAvailability) {
				this.itemsSelectionState[item.id] = selected;
			}
			else {
				this.itemsSelectionState[item.id] = false;
			}
		});
	}

	public updateFilteredPriceProducts() {
		var filteredByColor: PriceProductYieldItemVM[] = [];
		var filteredByText: PriceProductYieldItemVM[] = [];
		var filteredBySearch: PriceProductYieldItemVM[] = [];

		var sortedPriceProducts = this.sortPriceProducts(this.priceProductResults.priceProductYieldItemVM);
		filteredByColor = this.selectByFilter(this.selectedFilters.colorFilter, this.priceProductResults.priceProductYieldItemVM);
		filteredByText = this.selectByFilter(this.selectedFilters.textFilter, this.priceProductResults.priceProductYieldItemVM);
		filteredBySearch = this.selectBySearchText(this.selectedFilters.searchText, this.priceProductResults.priceProductYieldItemVM);

		var partialFilter = this.intersectFilteredPriceProducts(filteredByColor, filteredByText);
		var partialFilter = this.intersectFilteredPriceProducts(partialFilter, filteredBySearch);
		this.filteredPriceProduct = partialFilter;

		this.actionsPanelComponent.filterStatsInfo = {
			found: this.filteredPriceProduct.length,
			total: this.priceProductResults.priceProductYieldItemVM.length
		}
	}

	// First group by color filter, then by text label filter
	private sortPriceProducts(ppList: PriceProductYieldItemVM[]): PriceProductYieldItemVM[] {
		var colorFilterId = this.yieldColorFilterCollection.filterVMList[0].filterId;
		var textFilterId = this.yieldTextFilterCollection.filterVMList[0].filterId;
		var textFilterCount = this.yieldTextFilterCollection.filterVMList.length;

		var filterOrderMap = {};
		filterOrderMap[colorFilterId] = {};
		filterOrderMap[textFilterId] = {};

		var count = 1;
		this.yieldColorFilterCollection.filterVMList.forEach(cf => {
			filterOrderMap[colorFilterId][cf.valueId] = textFilterCount * count;
			count++;
		});

		var nullKey = null;
		filterOrderMap[colorFilterId][nullKey] = textFilterCount * (count + 1);

		count = 0;
		this.yieldTextFilterCollection.filterVMList.forEach(tf => {
			filterOrderMap[textFilterId][tf.valueId] = count;
			count++;
		});
		filterOrderMap[textFilterId][nullKey] = ++count;

		ppList.sort((a: PriceProductYieldItemVM, b: PriceProductYieldItemVM) => {
			var aColorValueId = a.colorFilterList.length > 0 ? a.colorFilterList[0].valueId : null;
			var aTextValueId = a.textFilterList.length > 0 ? a.textFilterList[0].valueId : null;
			var bColorValueId = b.colorFilterList.length > 0 ? b.colorFilterList[0].valueId : null;
			var bTextValueId = b.textFilterList.length > 0 ? b.textFilterList[0].valueId : null;

			var aPriority = filterOrderMap[colorFilterId][aColorValueId] + filterOrderMap[textFilterId][aTextValueId];
			var bPriority = filterOrderMap[colorFilterId][bColorValueId] + filterOrderMap[textFilterId][bTextValueId];
			return aPriority - bPriority;
		});
		return ppList;
	}

	private selectByFilter(filter: IFilterVM, priceProductYieldItemVM: PriceProductYieldItemVM[]): PriceProductYieldItemVM[] {
		var results = [];
		if (filter == null) {
			results = priceProductYieldItemVM;
		}
		else {
			results = _.filter(priceProductYieldItemVM, (item: PriceProductYieldItemVM) => {
				var ppFilter: IFilterVM = this.getFilterFromPriceProductByType(filter.filterType, item);
				if (ppFilter && ppFilter.filterId == filter.filterId && ppFilter.valueId == filter.valueId) {
					return true;
				}
				return false;
			});
		}
		return results;
	}

	private selectBySearchText(searchText: string, priceProductYieldItemVMList: PriceProductYieldItemVM[]): PriceProductYieldItemVM[] {
		var results = [];
		if (this._appContext.thUtils.isUndefinedOrNull(searchText) || searchText == "") {
			results = priceProductYieldItemVMList;
		}
		else {
			results = _.filter(priceProductYieldItemVMList, (item: PriceProductYieldItemVM) => {
				if (item.name.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) != -1) {
					return true;
				}
				return false;
			});
		}
		return results;
	}

	private intersectFilteredPriceProducts(priceProductList1: PriceProductYieldItemVM[], priceProductList2: PriceProductYieldItemVM[]) {
		var overlapDictionary = {};
		var intersectionList: PriceProductYieldItemVM[] = [];

		priceProductList1.forEach(element => {
			overlapDictionary[element.id] = 1;
		});

		priceProductList2.forEach(element => {
			if (overlapDictionary[element.id]) {
				intersectionList.push(element);
			}
		});

		return intersectionList;
	}

	private getFilterFromPriceProductByType(filterType: YieldFilterType, priceProductYieldItemVM: PriceProductYieldItemVM): IFilterVM {
		if (filterType == YieldFilterType.Color) {
			if ((priceProductYieldItemVM.colorFilterList.length > 0)) {
				return priceProductYieldItemVM.colorFilterList[0];
			}
		}
		else if (filterType == YieldFilterType.Text) {
			if ((priceProductYieldItemVM.textFilterList.length > 0)) {
				return priceProductYieldItemVM.textFilterList[0];
			}
		}
		return null;
	}

	public getPriceProductRowClasses(priceProduct: PriceProductYieldItemVM) {
		return this.getSelectedRowClasses(priceProduct, (className: string) => {
			return className + '-alpha-1';
		});
	}

	public getPriceProductFilterClasses(priceProduct: PriceProductYieldItemVM) {
		var color_class = this.getPriceProductColorFilterClass(priceProduct, (className: string) => {
			return className;
		});

		var results = {};
		results[color_class] = true;
		results['white-color'] = true;

		return results;
	}

	private getSelectedRowClasses(priceProduct: PriceProductYieldItemVM, classTransformer: (className: string) => string) {
		var color_class = this.getPriceProductColorFilterClass(priceProduct, classTransformer);

		var results = {};
		results[color_class] = this.itemsSelectionState[priceProduct.priceProductYieldItemDO.priceProductId];
		return results;
	}

	private getPriceProductColorFilterClass(priceProduct: PriceProductYieldItemVM, classTransformer: (className: string) => string) {
		var color_class = 'default-row-select-color';
		if (priceProduct.colorFilterList.length > 0) {
			color_class = classTransformer(priceProduct.colorFilterList[0].cssClass);
		}

		return color_class;
	}

	public getPriceProductTextFilterInitial(priceProduct: PriceProductYieldItemVM): string {
		var filterInitial = this.getPriceProductTextFilter(priceProduct).substr(0, 2);
		return filterInitial;
	}

	public getPriceProductTextFilter(priceProduct: PriceProductYieldItemVM): string {
		var filterInitial = "";
		if (priceProduct.textFilterList.length > 0) {
			filterInitial = priceProduct.textFilterList[0].displayName;
		}
		return filterInitial;
	}

	public getDateLabel(date: ThDateDO) {
		return date.getLongDayDisplayString(this._appContext.thTranslation).charAt(0) + " "
			+ date.getDayString() + "." + date.getMonthString();
	}

	public get yieldManager(): IYieldManagerDashboardPriceProducts {
		return this._yieldManager;
	}

	public set yieldManager(yieldManager: IYieldManagerDashboardPriceProducts) {
		this._yieldManager = yieldManager;
	}

	public getYieldStateModel(priceProductResults: PriceProductYieldResultVM, priceProduct: PriceProductYieldItemVM, dayIndex: number): IYieldStateModel {
		return {
			priceProduct: priceProduct,
			date: priceProductResults.dateList[dayIndex],
			stateIndex: dayIndex
		}
	}

	public handleStateChange() {
		this._yieldManager.refresh();
	}

	public applyAction(params: IActionPaneYieldParams) {
		var yieldParams: PriceProductYieldParam;
		var selectedPriceProducts = this.getSelectedPriceProductIds();
		yieldParams = {
			priceProductIdList: selectedPriceProducts,
			action: params.action,
			forever: params.forever,
			interval: params.interval
		}

		this.yieldPriceProducts(yieldParams);
	}

	private getSelectedPriceProductIds() {
		var list = [];
		this.priceProductResults.priceProductYieldItemVM.forEach(item => {
			if (this.itemsSelectionState[item.id]) {
				list.push(item.priceProductYieldItemDO.priceProductId);
			}
		});
		return list;
	}

	public yieldPriceProducts(yieldParams: PriceProductYieldParam) {
		if (this.isYielding) { return; }
		this.isYielding = true;
		this._yieldPriceProductsService.yieldPriceProducts(yieldParams).subscribe(() => {
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

	public applyFilters(filters: IFilterSelection) {
		this.setItemSelectionStateToAll(false);
		this.selectedFilters = filters;
		this.updateFilteredPriceProducts();
	}


	private isExpanded(priceProduct: PriceProductYieldItemVM): boolean {
		return this.expandedPriceProductIds[priceProduct.id] === true;
	}
	private toggleExpanded(priceProduct: PriceProductYieldItemVM) {
		if (!priceProduct.hasMoreThanOneDynamicPrice()) { return; }
		if (this.isExpanded(priceProduct)) {
			delete this.expandedPriceProductIds[priceProduct.id];
		} else {
			this.expandedPriceProductIds[priceProduct.id] = true;
		}
	}

	private stateIsOpen(state: YieldItemStateType): boolean {
		return state === YieldItemStateType.Open;
	}
	private getTitleForDynamicPriceInput(priceProductItem: PriceProductYieldItemVM, dynamicPrice: DynamicPriceYieldItemDO, dayIndex: number): string {
		let date = this.priceProductResults.dateList[dayIndex];
		if (dynamicPrice.openList[dayIndex] === YieldItemStateType.Open) {
			return this._appContext.thTranslation.translate("%dynamicPrice% is open on %date%. It will be the price used for incoming bookings with %priceProduct% on this day.", {
				dynamicPrice: dynamicPrice.name,
				date: date.toString(),
				priceProduct: priceProductItem.name
			});
		}
		return this._appContext.thTranslation.translate("Click here to open %dynamicPrice% on %date%.", {
			dynamicPrice: dynamicPrice.name,
			date: date.toString()
		});
	}
	private openDynamicPrice(priceProductItem: PriceProductYieldItemVM, dynamicPrice: DynamicPriceYieldItemDO, dayIndex: number) {
		if (dynamicPrice.openList[dayIndex] === YieldItemStateType.Open) {
			return;
		}
		let date = this.priceProductResults.dateList[dayIndex];
		var interval = ThDateIntervalDO.buildThDateIntervalDO(date, date);
		this._yieldPriceProductsService.openDynamicPrice({
			priceProductId: priceProductItem.priceProductYieldItemDO.priceProductId,
			dynamicPriceId: dynamicPrice.dynamicPriceId,
			interval: interval
		}).subscribe(() => {
			var eventDescription = "Opened a Dynamic Price for day " + date.toString();
			this._appContext.analytics.logEvent("yield-manager", "yield-single-dynamic-price", eventDescription);
			_.forEach(priceProductItem.dynamicPriceList, (item: DynamicPriceYieldItemDO) => {
				if (item.dynamicPriceId === dynamicPrice.dynamicPriceId) {
					item.openList[dayIndex] = 0;
				} else {
					item.openList[dayIndex] = 1;
				}
			});
		}, (error: ThError) => {
			this._appContext.toaster.error(error.message);
			this.handleStateChange();
		});
	}
	private openDynamicPriceYieldModal(priceProductItem: PriceProductYieldItemVM, dynamicPrice: DynamicPriceYieldItemDO) {
		let date = this.priceProductResults.dateList[0];
		this._yieldDynamicPriceModal.openDynamicPriceYieldModal(priceProductItem, dynamicPrice, date)
			.then((modalDialogInstance: ModalDialogRef<PriceProductDO>) => {
				modalDialogInstance.resultObservable.subscribe((updatedPriceProduct: PriceProductDO) => {
					this.handleStateChange();
				});
			}).catch((e: any) => { });
	}
}