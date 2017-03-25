import { Component, Input, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../../../../../../../../common/base/BaseComponent';
import { AppContext, ThError } from '../../../../../../../../../../common/utils/AppContext';
import { ModalDialogRef } from '../../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import { IPriceProductEditSection } from '../utils/IPriceProductEditSection';
import { PriceProductVM } from '../../../../../../../../services/price-products/view-models/PriceProductVM';
import { PriceProductPriceType } from '../../../../../../../../services/price-products/data-objects/price/IPriceProductPrice';
import { PriceProductPriceDO } from '../../../../../../../../services/price-products/data-objects/price/PriceProductPriceDO';
import { RoomCategoriesStatsService } from '../../../../../../../../services/room-categories/RoomCategoriesStatsService';
import { RoomCategoryDO } from '../../../../../../../../services/room-categories/data-objects/RoomCategoryDO';
import { RoomCategoryStatsDO } from '../../../../../../../../services/room-categories/data-objects/RoomCategoryStatsDO';
import { CurrencyDO } from '../../../../../../../../services/common/data-objects/currency/CurrencyDO';
import { ISOWeekDayUtils, ISOWeekDayVM, ISOWeekDay } from '../../../../../../../../services/common/data-objects/th-dates/ISOWeekDay';
import { PriceExceptionDO } from '../../../../../../../../services/price-products/data-objects/price/price-exceptions/PriceExceptionDO';
import { PriceExceptionModalService } from './price-exception-modal/services/PriceExceptionModalService';
import { DynamicPriceVM } from './utils/DynamicPriceVM';
import { PriceVM } from './utils/PriceVM';
import { DynamicPriceVMContainer } from "./utils/DynamicPriceVMContainer";
import { DynamicPriceModalService } from "./dynamic-price-modal/services/DynamicPriceModalService";
import { PricingContainer } from "./utils/PricingContainer";

@Component({
	selector: 'price-product-edit-prices-section',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/price-products/pages/price-product-edit/sections/prices/template/price-product-edit-prices-section.html',
	providers: [RoomCategoriesStatsService, PriceExceptionModalService, DynamicPriceModalService]
})
export class PriceProductEditPricesSectionComponent extends BaseComponent implements IPriceProductEditSection {
	private static MAX_NO_OF_DYNAMIC_PRICES = 15;

	private _readonly: boolean;
  	
	@Input() didSubmit: boolean;
	
	private _currentRoomCategoryStatsList: RoomCategoryStatsDO[];
	private _isoWeekDayUtils: ISOWeekDayUtils;
	private _isPricePerNumberOfPersons: boolean;

	isLoading: boolean = true;
	ccy: CurrencyDO;
	pricingContainer: PricingContainer;

	constructor(private _appContext: AppContext,
		private _roomCategoriesStatsService: RoomCategoriesStatsService,
		private _priceExceptionModal: PriceExceptionModalService,
		private _dynamicPriceModal: DynamicPriceModalService) {
		
		super();
		this._isoWeekDayUtils = new ISOWeekDayUtils();
		this.ccy = new CurrencyDO();

		this.pricingContainer = new PricingContainer(this._appContext);
	}

	public get readonly(): boolean {
		let isReadonly = this._readonly;

		_.forEach(this.dynamicPriceVMList, (dynamicPriceVM: DynamicPriceVM) => {
			if(dynamicPriceVM.editOnPricesAndExceptionsIsAllowed(this._readonly)) {
				isReadonly = false;
			}
		});

		return isReadonly;
	}
	public set readonly(readonly: boolean) {
		this._readonly = readonly;
	}

	public isValid(): boolean {
		return this.dynamicPriceVMContainer.isValid();
	}
	
	public initializeFrom(priceProductVM: PriceProductVM) {
		this.ccy = priceProductVM.ccy;
		
		this._isPricePerNumberOfPersons = true;
		this._currentRoomCategoryStatsList = [];

		if (priceProductVM.priceProduct.price && priceProductVM.priceProduct.price.type != null) {
			this.pricingContainer.updateCurrentPriceFrom(priceProductVM);

			this._isPricePerNumberOfPersons = (priceProductVM.priceProduct.price.type === PriceProductPriceType.PricePerPerson);
		}
		this.updatePricesForRoomCategories(priceProductVM.roomCategoryList);
	}

	public updatePricesForRoomCategories(roomCategoryList: RoomCategoryDO[]) {
		if (this._appContext.thUtils.isUndefinedOrNull(roomCategoryList) || (_.isArray(roomCategoryList) && roomCategoryList.length == 0)) {
			this.currentRoomCategoryStatsList = [];
			return;
		}
		
		this.isLoading = true;
		this._roomCategoriesStatsService.getRoomCategoryStatsForRoomCategoryList(roomCategoryList).subscribe((roomCategoryStatsList: RoomCategoryStatsDO[]) => {
			this.currentRoomCategoryStatsList = roomCategoryStatsList;
			this.isLoading = false;
		}, (err: ThError) => {
			this._appContext.toaster.error(err.message);
		});
	}

	public get isPricePerNumberOfPersons(): boolean {
		return this._isPricePerNumberOfPersons;
	}
	public set isPricePerNumberOfPersons(isPricePerNumberOfPersons: boolean) {
		if (this.readonly) {
			return;
		}
		this._isPricePerNumberOfPersons = isPricePerNumberOfPersons;

		this.selectDynamicPrice(0);
	}

	public get priceType(): PriceProductPriceType {
		if (this._isPricePerNumberOfPersons) {
			return PriceProductPriceType.PricePerPerson;
		}
		return PriceProductPriceType.SinglePrice;
	}

	public get currentRoomCategoryStatsList(): RoomCategoryStatsDO[] {
		return this._currentRoomCategoryStatsList;
	}
	public set currentRoomCategoryStatsList(currentRoomCategoryStatsList: RoomCategoryStatsDO[]) {
		this._currentRoomCategoryStatsList = currentRoomCategoryStatsList;
		this.pricingContainer.updateFromRoomCategoryStatsList(currentRoomCategoryStatsList);
	}

	public updateDataOn(priceProductVM: PriceProductVM) {
		if (!priceProductVM.priceProduct.price) {
			priceProductVM.priceProduct.price = new PriceProductPriceDO();
		}
		this.dynamicPriceVMContainer.updatePricesOn(priceProductVM);
	}

	public displayError() {
		return this.didSubmit || this.readonly;
	}
	
	public get dynamicPriceVMContainer(): DynamicPriceVMContainer {
		return this.pricingContainer.getSelectedPricingContainer(this._isPricePerNumberOfPersons);
	}

	public get dynamicPriceVMList(): DynamicPriceVM[] {
		return this.dynamicPriceVMContainer.dynamicPriceVMList;
	}

	public set dynamicPriceVMList(dynamicPriceVMList: DynamicPriceVM[]) {
		this.dynamicPriceVMContainer.dynamicPriceVMList = dynamicPriceVMList;
	}

	public selectDynamicPrice(index: number) {
		this.dynamicPriceVMContainer.selectDynamicPrice(index);
    }

	public get selectedDynamicPriceVM(): DynamicPriceVM {
		return this.dynamicPriceVMContainer.selectedDynamicPriceVM;
	}
	
	public getWeekDayName(iSOWeekDay: ISOWeekDay): string {
		return this._isoWeekDayUtils.getISOWeekDayVM(iSOWeekDay).name;
	}

	public getNoRoomsLabel(noOfRooms: number): string {
		if (noOfRooms === 1) {
			return this._appContext.thTranslation.translate("%noOfRooms% Room", { noOfRooms: noOfRooms });
		}
		return this._appContext.thTranslation.translate("%noOfRooms% Rooms", { noOfRooms: noOfRooms });
	}

	public removeException(priceVM: PriceVM, exception: PriceExceptionDO) {
		priceVM.deleteExceptionOn(exception.dayFromWeek);
	}

	public openPriceExceptionModal(priceVM: PriceVM) {
		let priceCopy = priceVM.buildPrototype();
		this._priceExceptionModal.openPriceExceptionModal(priceCopy, this.readonly)
			.then((modalDialogInstance: ModalDialogRef<PriceVM>) => {
				modalDialogInstance.resultObservable.subscribe((updatedPrice: PriceVM) => {
					this.didChangeExceptionsOn(updatedPrice);
				})
			}).catch((e: any) => { });
	}

	private didChangeExceptionsOn(priceVM: PriceVM) {
		let foundPrice = this.selectedDynamicPriceVM.getPriceVMForRoomCategoryId(priceVM.price.getRoomCategoryId());
		if (this._appContext.thUtils.isUndefinedOrNull(foundPrice)) { return; }
		foundPrice.priceExceptionsByWeekday = {};
		_.forEach(priceVM.exceptionList, e => {
			foundPrice.priceExceptionsByWeekday[e.dayFromWeek] = e.price;
		});
		foundPrice.indexExceptions();
	}

	public openEditDynamicPriceModal(dynamicPriceVM: DynamicPriceVM, dynamicPriceVMIndex: number) {
		let dynamicPriceCopy = dynamicPriceVM.buildPrototype();
		this._dynamicPriceModal.openEditDynamicPriceModal(dynamicPriceCopy, this.readonly)
			.then((modalDialogInstance: ModalDialogRef<DynamicPriceVM>) => {
				modalDialogInstance.resultObservable.subscribe((updatedDynamicPrice: DynamicPriceVM) => {
					if(this._appContext.thUtils.isUndefinedOrNull(updatedDynamicPrice)) {
						this.didRemoveDynamicPrice(dynamicPriceVMIndex);
						return;
					}
					this.didChangeDynamicPriceNameAndDetails(dynamicPriceVMIndex, updatedDynamicPrice);
				})
			}).catch((e: any) => { });
	}

	public didChangeDynamicPriceNameAndDetails(dynamicPriceVMIndex: number, updatedDynamicPrice: DynamicPriceVM) {
		this.pricingContainer.updateNameAndDescriptionOnDynamicPrice(dynamicPriceVMIndex, updatedDynamicPrice);
	}

	public didRemoveDynamicPrice(indexToRemove: number) {
		if(this.pricingContainer.hasAtLeastADynamicPriceConfigured()) {
			this._appContext.toaster.error(this._appContext.thTranslation.translate("The price product must have at least a dynamic daily rate configured."));
			return;
		}
		this.pricingContainer.removeDynamicPrice(indexToRemove);
		
		this.selectDynamicPrice(indexToRemove == 0? 0 : indexToRemove - 1);
	}

	public openNewDynamicPriceModal() {
		this._dynamicPriceModal.openNewDynamicPriceModal(this.dynamicPriceVMContainer.priceType)
			.then((modalDialogInstance: ModalDialogRef<DynamicPriceVM>) => {
				modalDialogInstance.resultObservable.subscribe((newDynamicPrice: DynamicPriceVM) => {
					this.didAddDynamicPrice(newDynamicPrice);
				})
			}).catch((e: any) => { });
	}

	public didAddDynamicPrice(newDynamicPrice: DynamicPriceVM) {
		if(this.dynamicPriceVMContainer.dynamicPriceVMList.length == PriceProductEditPricesSectionComponent.MAX_NO_OF_DYNAMIC_PRICES) {
			this._appContext.toaster.error(this._appContext.thTranslation.translate("The maximum number of dynamic prices on this price product has been reached."));
			return;
		}

		this.pricingContainer.addDynamicPrice(newDynamicPrice);
		this.selectDynamicPrice(this.dynamicPriceVMList.length - 1);
	}
}