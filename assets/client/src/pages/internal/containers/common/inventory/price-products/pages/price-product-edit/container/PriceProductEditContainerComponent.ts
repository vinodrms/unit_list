import {Component, Input, Output, EventEmitter, AfterViewInit, ViewChild} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';
import {BaseComponent} from '../../../../../../../../../common/base/BaseComponent';
import {AppContext, ThError} from '../../../../../../../../../common/utils/AppContext';
import {LoadingComponent} from '../../../../../../../../../common/utils/components/LoadingComponent';
import {TranslationPipe} from '../../../../../../../../../common/utils/localization/TranslationPipe';
import {PriceProductVM} from '../../../../../../../services/price-products/view-models/PriceProductVM';
import {PriceProductStatus} from '../../../../../../../services/price-products/data-objects/PriceProductDO';
import {YieldFiltersService} from '../../../../../../../services/hotel-configurations/YieldFiltersService';
import {EagerAddOnProductsService} from '../../../../../../../services/add-on-products/EagerAddOnProductsService';
import {AddOnProductsDO} from '../../../../../../../services/add-on-products/data-objects/AddOnProductsDO';
import {HotelAggregatorService} from '../../../../../../../services/hotel/HotelAggregatorService';
import {HotelAggregatedInfo} from '../../../../../../../services/hotel/utils/HotelAggregatedInfo';
import {RoomCategoryDO} from '../../../../../../../services/room-categories/data-objects/RoomCategoryDO';
import {PriceProductEditSectionContainer} from './utils/PriceProductEditSectionContainer';
import {PriceProductEditTopSectionComponent} from '../sections/top-section/PriceProductEditTopSectionComponent';
import {PriceProductEditRoomCategoriesSectionComponent} from '../sections/room-categories/PriceProductEditRoomCategoriesSectionComponent';
import {PriceProductEditAddOnProductsSectionComponent} from '../sections/add-on-products/PriceProductEditAddOnProductsSectionComponent';
import {PriceProductEditTaxesSectionComponent} from '../sections/taxes/PriceProductEditTaxesSectionComponent';
import {PriceProductEditPricesSectionComponent} from '../sections/prices/PriceProductEditPricesSectionComponent';
import {PriceProductEditFiltersSectionComponent} from '../sections/filters/PriceProductEditFiltersSectionComponent';

@Component({
	selector: 'price-product-edit-container',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/price-products/pages/price-product-edit/container/template/price-product-edit-container.html',
	providers: [EagerAddOnProductsService],
	directives: [LoadingComponent,
		PriceProductEditTopSectionComponent, PriceProductEditRoomCategoriesSectionComponent,
		PriceProductEditAddOnProductsSectionComponent, PriceProductEditTaxesSectionComponent,
		PriceProductEditPricesSectionComponent, PriceProductEditFiltersSectionComponent],
	pipes: [TranslationPipe]
})

export class PriceProductEditContainerComponent extends BaseComponent implements AfterViewInit {
	@ViewChild(PriceProductEditTopSectionComponent) private _topSectionComponent: PriceProductEditTopSectionComponent;
	@ViewChild(PriceProductEditRoomCategoriesSectionComponent) private _roomCategoriesSectionComponent: PriceProductEditRoomCategoriesSectionComponent;
	@ViewChild(PriceProductEditAddOnProductsSectionComponent) private _addOnProductsSection: PriceProductEditAddOnProductsSectionComponent;
	@ViewChild(PriceProductEditTaxesSectionComponent) private _editTaxesSection: PriceProductEditTaxesSectionComponent;
	@ViewChild(PriceProductEditPricesSectionComponent) private _editPricesSection: PriceProductEditPricesSectionComponent;
	@ViewChild(PriceProductEditFiltersSectionComponent) private _editFiltersSection: PriceProductEditFiltersSectionComponent;

	private _didInit = false;
	isLoading: boolean = true;
	isSavingPriceProduct: boolean = false;
	didSubmit = false;

	private _priceProductVM: PriceProductVM;
	public get priceProductVM(): PriceProductVM {
		return this._priceProductVM;
	}
	@Input()
	public set priceProductVM(priceProductVM: PriceProductVM) {
		this._priceProductVM = priceProductVM;
		this.initializeDependentData();
	}

	@Output() onExit = new EventEmitter();
	public showViewScreen() {
		this.onExit.next(true);
	}

	private _editSectionContainer: PriceProductEditSectionContainer;
	private _dependentDataSubscription: Subscription;

	constructor(private _appContext: AppContext,
		private _yieldFiltersService: YieldFiltersService,
		private _eagerAddOnProductsService: EagerAddOnProductsService,
		private _hotelAggregatorService: HotelAggregatorService) {
		super();
	}
	ngAfterViewInit() {
		setTimeout(() => {
			this._didInit = true;
			this._editSectionContainer = new PriceProductEditSectionContainer(
				[
					this._topSectionComponent,
					this._roomCategoriesSectionComponent,
					this._addOnProductsSection,
					this._editTaxesSection,
					this._editPricesSection,
					this._editFiltersSection
				]
			);
			this.initializeDependentData();
		});
	}

	private initializeDependentData() {
		if (!this._didInit || !this._priceProductVM) {
			return;
		}
		this.isLoading = true;

		if (this._dependentDataSubscription) {
			this._dependentDataSubscription.unsubscribe();
		}
		this._dependentDataSubscription = Observable.combineLatest(
			this._eagerAddOnProductsService.getAddOnProductsById(this._priceProductVM.priceProduct.addOnProductIdList),
			this._hotelAggregatorService.getHotelAggregatedInfo()
		).subscribe((result: [AddOnProductsDO, HotelAggregatedInfo]) => {
			this._priceProductVM.addOnProductList = result[0].addOnProductList;
			this._priceProductVM.ccy = result[1].ccy;

			this._editSectionContainer.initializeFrom(this._priceProductVM);
			this._editSectionContainer.readonly = this.isReadOnly();
			this._editFiltersSection.readonly = this.yieldFiltersAreReadOnly();

			this.isLoading = false;
			this.didSubmit = false;
		}, (error: ThError) => {
			this.isLoading = false;
			this._appContext.toaster.error(this._appContext.thTranslation.translate(error.message));
		});
	}
	private isReadOnly(): boolean {
		return this._priceProductVM != null && this._priceProductVM.priceProduct.status !== PriceProductStatus.Draft;
	}
	private yieldFiltersAreReadOnly(): boolean {
		return this.isReadOnly() && this._priceProductVM.priceProduct.status !== PriceProductStatus.Active;
	}
	public handleRoomCategoryChange(roomCategoryList: RoomCategoryDO[]) {
		this._editPricesSection.updatePricesForRoomCategories(roomCategoryList);
	}

	public savePriceProduct() {
		this.didSubmit = true;
		if (!this._editSectionContainer.isValid()) {
			var errorMessage = this._appContext.thTranslation.translate("Please complete all the required fields");
			this._appContext.toaster.error(errorMessage);
			return;
		}
		this._editSectionContainer.updateDataOn(this._priceProductVM);
		// TODO: save on server
	}
}