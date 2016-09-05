import {Component, Input, Output, EventEmitter} from '@angular/core';
import {BaseComponent} from '../../../../../../../../common/base/BaseComponent';
import {CustomerVM} from '../../../../../../services/customers/view-models/CustomerVM';
import {CustomScroll} from '../../../../../../../../common/utils/directives/CustomScroll';
import {ModalDialogRef} from '../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {HotelOperationsModalService} from '../../../../../home/pages/home-pages/hotel-operations/operations-modal/services/HotelOperationsModalService';
import {HotelOperationsResult} from '../../../../../home/pages/home-pages/hotel-operations/operations-modal/services/utils/HotelOperationsResult';

@Component({
	selector: 'customer-register-overview',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/customer-register/pages/customer-overview/template/customer-register-overview.html',
	providers: [HotelOperationsModalService]
})

export class CustomerRegisterOverviewComponent extends BaseComponent {
	@Input() showLinkToOperationalModal: boolean = false;

	private _customerVM: CustomerVM;
	public get customerVM(): CustomerVM {
		return this._customerVM;
	}
	@Input()
	public set customerVM(customerVM: CustomerVM) {
		this._customerVM = customerVM;
	}

	@Output() onEdit = new EventEmitter();
	public editCustomer() {
		this.onEdit.next(this._customerVM);
	}

	constructor(private _hotelOperationsModalService: HotelOperationsModalService) {
		super();
	}

	public openCustomerOperationsModal() {
		this._hotelOperationsModalService.openCustomerOperationsModal(this._customerVM.customer.id).then((modalDialogRef: ModalDialogRef<HotelOperationsResult>) => {
			modalDialogRef.resultObservable
				.subscribe((result: HotelOperationsResult) => {
				}, (err: any) => {
				});
		}).catch((err: any) => { });
	}
}