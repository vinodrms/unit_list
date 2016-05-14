import {Component, Input} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {AppContext} from '../../../../../../../../../../common/utils/AppContext';
import {BaseComponent} from '../../../../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../../../../common/utils/localization/TranslationPipe';
import {ModalDialogRef} from '../../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {IAllotmentEditSection} from '../utils/IAllotmentEditSection';
import {AllotmentVM} from '../../../../../../../../services/allotments/view-models/AllotmentVM';
import {PriceProductDO} from '../../../../../../../../services/price-products/data-objects/PriceProductDO';
import {CustomerDO} from '../../../../../../../../services/customers/data-objects/CustomerDO';
import {RoomCategoryDO} from '../../../../../../../../services/room-categories/data-objects/RoomCategoryDO';
import {CustomerRegisterModalService} from '../../../../../customer-register/modal/services/CustomerRegisterModalService';
import {CustomerDetailsService} from './services/CustomerDetailsService';
import {CustomerIndexedDetails} from './services/utils/CustomerIndexedDetails';

@Component({
	selector: 'allotment-edit-top-section',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/allotments/pages/allotment-edit/sections/top-section/template/allotment-edit-top-section.html',
	providers: [CustomerRegisterModalService, CustomerDetailsService],
	pipes: [TranslationPipe]
})
export class AllotmentEditTopSectionComponent extends BaseComponent implements IAllotmentEditSection {
	@Input() didSubmit: boolean;
	readonly: boolean = true;

	selectedCustomerDO: CustomerDO;
	selectedPriceProductId: string;
	selectedRoomCategoryId: string;

	priceProductList: PriceProductDO[];
	roomCategoryList: RoomCategoryDO[];
	isNewAllotment: boolean = true;
	isLoadingDependentData: boolean = false;
	private _dependentDataSubscription: Subscription;
	private _custIndexedDetails: CustomerIndexedDetails;
	noAvailablePriceProductsError: boolean = false;

	constructor(private _appContext: AppContext, private _customerRegisterModalService: CustomerRegisterModalService,
		private _customerDetailsService: CustomerDetailsService) {
		super();
	}

	isValid(): boolean {
		return !this._appContext.thUtils.isUndefinedOrNull(this.selectedCustomerDO)
			&& !this._appContext.thUtils.isUndefinedOrNull(this.selectedPriceProductId)
			&& !this._appContext.thUtils.isUndefinedOrNull(this.selectedRoomCategoryId);
	}
	initializeFrom(allotmentVM: AllotmentVM) {
		this.isNewAllotment = allotmentVM.isNewAllotment();
		this.selectedCustomerDO = allotmentVM.customer;
		if (allotmentVM.priceProduct && allotmentVM.priceProduct.id) {
			this.selectedPriceProductId = allotmentVM.priceProduct.id;
		}
		else {
			this.selectedPriceProductId = null;
		}
		if (allotmentVM.roomCategory && allotmentVM.roomCategory.id) {
			this.selectedRoomCategoryId = allotmentVM.roomCategory.id;
		}
		else {
			this.selectedRoomCategoryId = null;
		}
		this.noAvailablePriceProductsError = false;
		if (!this.isNewAllotment) {
			this.priceProductList = [allotmentVM.priceProduct];
			this.roomCategoryList = [allotmentVM.roomCategory];
		}
		this.loadDependentDataIfNecessary();
	}
	private loadDependentDataIfNecessary() {
		if (!this.isNewAllotment || !this.selectedCustomerDO) {
			return;
		}
		this.isLoadingDependentData = true;
		if (this._dependentDataSubscription) {
			this._dependentDataSubscription.unsubscribe();
		}
		this._dependentDataSubscription = this._customerDetailsService.getCustomerIndexedDetails(this.selectedCustomerDO).subscribe((custIndexedDetails: CustomerIndexedDetails) => {
			this._custIndexedDetails = custIndexedDetails;
			this.setDefaultData();
			this.isLoadingDependentData = false;
		});
	}
	private setDefaultData() {
		if (this._custIndexedDetails.priceProductList.length == 0) {
			this.clearDependentData();
			this.noAvailablePriceProductsError = true;
			return;
		}
		this.noAvailablePriceProductsError = false;

		this.priceProductList = this._custIndexedDetails.priceProductList;
		this.selectedPriceProductId = this.priceProductList[0].id;

		this.roomCategoryList = this._custIndexedDetails.getRoomCategoryListById(this.priceProductList[0].roomCategoryIdList);
		this.selectedRoomCategoryId = this.roomCategoryList[0].id;
	}
	private clearDependentData() {
		this.selectedPriceProductId = null;
		this.priceProductList = [];
		this.selectedRoomCategoryId = null;
		this.roomCategoryList = [];
	}

	updateDataOn(allotmentVM: AllotmentVM) {
		if (!this.isValid()) {
			return;
		}
		allotmentVM.allotment.customerId = this.selectedCustomerDO.id;
		allotmentVM.allotment.priceProductId = this.selectedPriceProductId;
		allotmentVM.allotment.roomCategoryId = this.selectedRoomCategoryId;
	}
	public openCustomerSelectModal() {
		this._customerRegisterModalService.openCustomerRegisterModal(false).then((modalDialogInstance: ModalDialogRef<CustomerDO[]>) => {
			modalDialogInstance.resultObservable.subscribe((selectedCustomerList: CustomerDO[]) => {
				if (selectedCustomerList.length > 0) {
					this.selectedCustomerDO = selectedCustomerList[0];
					this.clearDependentData();
					this.loadDependentDataIfNecessary();
				}
			});
		}).catch((e: any) => { });
	}
	public didSelectPriceProductId(priceProductId: string) {
		if (!this._custIndexedDetails) { return }
		this.selectedPriceProductId = priceProductId;
		var selectedPriceProduct = this._custIndexedDetails.getPriceProductById(priceProductId);

		this.roomCategoryList = this._custIndexedDetails.getRoomCategoryListById(selectedPriceProduct.roomCategoryIdList);
		this.selectedRoomCategoryId = this.roomCategoryList[0].id;
	}
	public didSelectRoomCategoryId(roomCategoryId: string) {
		this.selectedRoomCategoryId = roomCategoryId;
	}
}