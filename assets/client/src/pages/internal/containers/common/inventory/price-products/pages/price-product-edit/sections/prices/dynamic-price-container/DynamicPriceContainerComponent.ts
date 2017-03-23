import { Component, Input } from '@angular/core';
import { BaseComponent } from "../../../../../../../../../../../common/base/BaseComponent";
import { AppContext } from "../../../../../../../../../../../common/utils/AppContext";
import { DynamicPriceVMContainer } from "../utils/DynamicPriceVMContainer";
import { PriceVM } from "../utils/PriceVM";
import { DynamicPriceVM } from "../utils/DynamicPriceVM";
import { PriceExceptionModalService } from "../price-exception-modal/services/PriceExceptionModalService";
import { ModalDialogRef } from "../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef";
import { PriceProductPriceType } from "../../../../../../../../../services/price-products/data-objects/price/IPriceProductPrice";
import { ISOWeekDay, ISOWeekDayUtils } from "../../../../../../../../../services/common/data-objects/th-dates/ISOWeekDay";
import { CurrencyDO } from "../../../../../../../../../services/common/data-objects/currency/CurrencyDO";
import { DynamicPriceModalService } from "./dynamic-price-modal/services/DynamicPriceModalService";

@Component({
	selector: 'dynamic-price-container',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/price-products/pages/price-product-edit/sections/prices/dynamic-price-container/template/dynamic-price-container.html',
	providers: [PriceExceptionModalService, DynamicPriceModalService]
})
export class DynamicPriceContainerComponent extends BaseComponent {
	private _dynamicPriceVMContainer: DynamicPriceVMContainer;
	private _isoWeekDayUtils: ISOWeekDayUtils;
	private _ccy: CurrencyDO;

	isLoading: boolean = true;
	didSubmit: boolean = false;
	readonly: boolean = false;

	private _selectedDynamicPriceIndex: number;
	
	constructor(private _appContext: AppContext,
				private _priceExceptionModal: PriceExceptionModalService,
				private _dynamicPriceModal: DynamicPriceModalService) {
		super();

		this._isoWeekDayUtils = new ISOWeekDayUtils();
		this._ccy = new CurrencyDO();
	}

	public get ccy():CurrencyDO {
		return this._ccy;
	}

	public initializeFrom(ccy: CurrencyDO, dynamicPriceVMContainer: DynamicPriceVMContainer) {
		this._ccy = ccy;
		this._dynamicPriceVMContainer = dynamicPriceVMContainer;
		
		this._selectedDynamicPriceIndex = 0;

		
		this.isLoading = false;
	}

	public changeDynamicPrice(index: number) {
		this.dynamicPriceVMList[this._selectedDynamicPriceIndex].selected = false;
		this.dynamicPriceVMList[index].selected = true;
		this._selectedDynamicPriceIndex = index;
    }

	public get dynamicPriceVMList(): DynamicPriceVM[] {
		return this._dynamicPriceVMContainer.dynamicPriceVMList;
	}

	public get selectedDynamicPriceVM(): DynamicPriceVM {
		return this.dynamicPriceVMList[this._selectedDynamicPriceIndex];
	}
	
	public get priceType(): PriceProductPriceType {
		return this._dynamicPriceVMContainer.priceType;
	}

	public getNoRoomsLabel(noOfRooms: number): string {
		if (noOfRooms === 1) {
			return this._appContext.thTranslation.translate("%noOfRooms% Room", { noOfRooms: noOfRooms });
		}
		return this._appContext.thTranslation.translate("%noOfRooms% Rooms", { noOfRooms: noOfRooms });
	}

	public getWeekDayName(iSOWeekDay: ISOWeekDay): string {
		return this._isoWeekDayUtils.getISOWeekDayVM(iSOWeekDay).name;
	}

	public displayError() {
		return this.didSubmit || this.readonly;
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

	public openEditDynamicPriceModal(dynamicPriceVM: DynamicPriceVM) {
		let dynamicPriceCopy = dynamicPriceVM.buildPrototype();
		this._dynamicPriceModal.openEditDynamicPriceModal(dynamicPriceCopy, this.readonly)
			.then((modalDialogInstance: ModalDialogRef<DynamicPriceVM>) => {
				modalDialogInstance.resultObservable.subscribe((updatedDynamicPrice: DynamicPriceVM) => {
					this.didChangeDynamicPriceNameAndDetails(updatedDynamicPrice);
				})
			}).catch((e: any) => { });
	}

	public didChangeDynamicPriceNameAndDetails(updatedDynamicPrice: DynamicPriceVM) {

	}

	public openNewDynamicPriceModal() {
		this._dynamicPriceModal.openNewDynamicPriceModal()
			.then((modalDialogInstance: ModalDialogRef<DynamicPriceVM>) => {
				modalDialogInstance.resultObservable.subscribe((newDynamicPrice: DynamicPriceVM) => {
					this.didChangeDynamicPriceNameAndDetails(newDynamicPrice);
				})
			}).catch((e: any) => { });
	}

	public didAddDynamicPrice(newDynamicPrice: DynamicPriceVM) {
		
	}
}