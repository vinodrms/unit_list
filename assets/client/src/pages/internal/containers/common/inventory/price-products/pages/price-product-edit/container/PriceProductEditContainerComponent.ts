import { Component, Input, Output, EventEmitter, AfterViewInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';
import { BaseComponent } from '../../../../../../../../../common/base/BaseComponent';
import { AppContext, ThError } from '../../../../../../../../../common/utils/AppContext';
import { CustomScroll } from '../../../../../../../../../common/utils/directives/CustomScroll';
import { PriceProductVM } from '../../../../../../../services/price-products/view-models/PriceProductVM';
import { PriceProductDO, PriceProductStatus } from '../../../../../../../services/price-products/data-objects/PriceProductDO';
import { PriceProductsService } from '../../../../../../../services/price-products/PriceProductsService';
import { YieldFiltersService } from '../../../../../../../services/hotel-configurations/YieldFiltersService';
import { EagerAddOnProductsService } from '../../../../../../../services/add-on-products/EagerAddOnProductsService';
import { AddOnProductsDO } from '../../../../../../../services/add-on-products/data-objects/AddOnProductsDO';
import { HotelAggregatorService } from '../../../../../../../services/hotel/HotelAggregatorService';
import { HotelAggregatedInfo } from '../../../../../../../services/hotel/utils/HotelAggregatedInfo';
import { RoomCategoryDO } from '../../../../../../../services/room-categories/data-objects/RoomCategoryDO';
import { PriceProductEditSectionContainer } from './utils/PriceProductEditSectionContainer';
import { PriceProductEditTopSectionComponent } from '../sections/top-section/PriceProductEditTopSectionComponent';
import { PriceProductEditRoomCategoriesSectionComponent } from '../sections/room-categories/PriceProductEditRoomCategoriesSectionComponent';
import { PriceProductEditAddOnProductsSectionComponent } from '../sections/add-on-products/PriceProductEditAddOnProductsSectionComponent';
import { PriceProductEditTaxesSectionComponent } from '../sections/taxes/PriceProductEditTaxesSectionComponent';
import { PriceProductEditPricesSectionComponent } from '../sections/prices/PriceProductEditPricesSectionComponent';
import { PriceProductEditFiltersSectionComponent } from '../sections/filters/PriceProductEditFiltersSectionComponent';
import { PriceProductEditCancellationSectionComponent } from '../sections/cancellation/PriceProductEditCancellationSectionComponent';
import { PriceProductEditConstraintsSectionComponent } from '../sections/constraints/constraints-list/PriceProductEditConstraintsSectionComponent';
import { PriceProductEditDiscountsSectionComponent } from '../sections/discounts/PriceProductEditDiscountsSectionComponent';
import { PriceProductEditNotesSectionComponent } from '../sections/notes/PriceProductEditNotesSectionComponent';
import { AddOnProductCategoriesService } from '../../../../../../../services/settings/AddOnProductCategoriesService';
import { AddOnProductCategoriesDO } from '../../../../../../../services/settings/data-objects/AddOnProductCategoriesDO';
import { AddOnProductCategoryDO } from '../../../../../../../services/common/data-objects/add-on-product/AddOnProductCategoryDO';

@Component({
	selector: 'price-product-edit-container',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/price-products/pages/price-product-edit/container/template/price-product-edit-container.html',
	providers: [EagerAddOnProductsService]
})
export class PriceProductEditContainerComponent extends BaseComponent implements AfterViewInit {
	@ViewChild(PriceProductEditTopSectionComponent) private _topSectionComponent: PriceProductEditTopSectionComponent;
	@ViewChild(PriceProductEditRoomCategoriesSectionComponent) private _roomCategoriesSectionComponent: PriceProductEditRoomCategoriesSectionComponent;
	@ViewChild(PriceProductEditAddOnProductsSectionComponent) private _addOnProductsSection: PriceProductEditAddOnProductsSectionComponent;
	@ViewChild(PriceProductEditTaxesSectionComponent) private _editTaxesSection: PriceProductEditTaxesSectionComponent;
	@ViewChild(PriceProductEditPricesSectionComponent) private _editPricesSection: PriceProductEditPricesSectionComponent;
	@ViewChild(PriceProductEditFiltersSectionComponent) private _editFiltersSection: PriceProductEditFiltersSectionComponent;
	@ViewChild(PriceProductEditCancellationSectionComponent) private _editCancellationSection: PriceProductEditCancellationSectionComponent;
	@ViewChild(PriceProductEditConstraintsSectionComponent) private _editConstraintsSection: PriceProductEditConstraintsSectionComponent;
	@ViewChild(PriceProductEditDiscountsSectionComponent) private _editDiscountsSection: PriceProductEditDiscountsSectionComponent;
	@ViewChild(PriceProductEditNotesSectionComponent) private _editNotesSection: PriceProductEditNotesSectionComponent;

	private _didInit = false;
	isLoading: boolean = true;
	isSavingPriceProduct: boolean = false;
	saveAsDraft: boolean = true;
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
		private _hotelAggregatorService: HotelAggregatorService,
		private _priceProductsService: PriceProductsService,
		private _addOnProductCategoriesService: AddOnProductCategoriesService) {
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
					this._editFiltersSection,
					this._editCancellationSection,
					this._editConstraintsSection,
					this._editDiscountsSection,
					this._editNotesSection
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
			this._hotelAggregatorService.getHotelAggregatedInfo(),
			this._addOnProductCategoriesService.getAddOnProductCategoriesDO()
		).subscribe((result: [HotelAggregatedInfo, AddOnProductCategoriesDO]) => {
			this._priceProductVM.ccy = result[0].ccy;

			this._editSectionContainer.initializeFrom(this._priceProductVM, result[1]);
			this._editSectionContainer.readonly = this.isReadOnly();
			this._editFiltersSection.readonly = this.yieldFiltersAreReadOnly();
			this._editNotesSection.readonly = this.yieldFiltersAreReadOnly();
			this._editCancellationSection.cancellationHour = result[0].hotelDetails.hotel.operationHours.cancellationHour;

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

	public isNewOrDraftPriceProduct() {
		return this._priceProductVM != null &&
			(!this._priceProductVM.priceProduct.id ||
				this._priceProductVM.priceProduct.status === PriceProductStatus.Draft
			);
	}
	public canSavePriceProduct(): boolean {
		return this._priceProductVM != null &&
			(this._priceProductVM.priceProduct.status === PriceProductStatus.Draft ||
				this._priceProductVM.priceProduct.status === PriceProductStatus.Active
			);
	}

	public savePriceProduct() {
		this.didSubmit = true;
		if (!this._editSectionContainer.isValid() || !this.canSavePriceProduct()) {
			var errorMessage = this._appContext.thTranslation.translate("Please complete all the required fields");
			this._appContext.toaster.error(errorMessage);
			return;
		}
		this._editSectionContainer.updateDataOn(this._priceProductVM);
		this.updateStatusForNewPriceProductOn(this._priceProductVM);

		this.isSavingPriceProduct = true;
		this._priceProductsService.savePriceProductDO(this._priceProductVM.priceProduct)
			.subscribe((updatedPriceProduct: PriceProductDO) => {
				this.isSavingPriceProduct = false;
				this.showViewScreen();
			}, (error: ThError) => {
				this.isSavingPriceProduct = false;
				this._appContext.toaster.error(error.message);
			});
	}
	private updateStatusForNewPriceProductOn(priceProductVM: PriceProductVM) {
		if (!this.isNewOrDraftPriceProduct()) { return };
		if (this.saveAsDraft) {
			priceProductVM.priceProduct.status = PriceProductStatus.Draft;
			return;
		}
		priceProductVM.priceProduct.status = PriceProductStatus.Active;
	}
}