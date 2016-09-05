import {Component, OnInit} from '@angular/core';
import {AppContext} from '../../../../../../../../../../common/utils/AppContext';
import {BaseComponent} from '../../../../../../../../../../common/base/BaseComponent';
import {InventoryScreenStateType} from '../../../../../../../common/inventory/utils/state-manager/InventoryScreenStateType';
import {BookingCustomerRegisterStepService} from './services/BookingCustomerRegisterStepService';
import {CustomerDO} from '../../../../../../../../services/customers/data-objects/CustomerDO';
import {BookingControllerService} from '../utils/BookingControllerService';
import {IBookingCustomerRegisterController} from '../utils/IBookingCustomerRegister';

@Component({
	selector: 'new-booking-customer-register',
	templateUrl: '/client/src/pages/internal/containers/home/pages/utils/new-booking/component/subcomponents/booking-customer-register/template/new-booking-customer-register.html'
})
export class NewBookingCustomerRegisterComponent extends BaseComponent implements OnInit {
	private _customerRegisterCtrl: IBookingCustomerRegisterController;

	constructor(private _appContext: AppContext,
		private _custRegisterStep: BookingCustomerRegisterStepService,
		private _bookingControllerService: BookingControllerService) {
		super();
		this.updateCustRegisterStepPath(InventoryScreenStateType.View);
		this._customerRegisterCtrl = _bookingControllerService;
	}

	public ngOnInit() {
		this._appContext.analytics.logPageView("/operations/new-booking/customer-register");
	}

	public didChangeScreenStateType(screenStateType: InventoryScreenStateType) {
		this.updateCustRegisterStepPath(screenStateType);
	}
	private updateCustRegisterStepPath(screenStateType: InventoryScreenStateType) {
		if (screenStateType === InventoryScreenStateType.View) {
			this._custRegisterStep.customerRegisterPathList = [
				this._appContext.thTranslation.translate("Customer Register")
			];
        }
		else {
			this._custRegisterStep.customerRegisterPathList = [
				this._appContext.thTranslation.translate("Customer Register"),
				this._appContext.thTranslation.translate("Edit")
			];
		}
	}
	public didSelectCustomer(customer: CustomerDO) {
		this._customerRegisterCtrl.didSelectCustomer(customer);
	}
	public closeRegister() {
		this._customerRegisterCtrl.closeCustomerRegister();
	}
}