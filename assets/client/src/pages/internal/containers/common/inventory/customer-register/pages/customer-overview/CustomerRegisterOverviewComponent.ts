import {Component, Input, Output, EventEmitter} from '@angular/core';
import {BaseComponent} from '../../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../../common/utils/localization/TranslationPipe';
import {PercentagePipe} from '../../../../../../../../common/utils/pipes/PercentagePipe';
import {CustomerVM} from '../../../../../../services/customers/view-models/CustomerVM';

@Component({
	selector: 'customer-register-overview',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/customer-register/pages/customer-overview/template/customer-register-overview.html',
	pipes: [TranslationPipe, PercentagePipe]
})

export class CustomerRegisterOverviewComponent extends BaseComponent {
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

	constructor() {
		super();
	}
}