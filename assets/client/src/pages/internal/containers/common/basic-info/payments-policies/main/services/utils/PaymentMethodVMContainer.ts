import {HotelPaymentMethodsDO} from '../../../../../../../services/settings/data-objects/HotelPaymentMethodsDO';
import {PaymentMethodDO} from '../../../../../../../services/common/data-objects/payment-method/PaymentMethodDO';

export class PaymentMethodVM {
	paymentMethod: PaymentMethodDO;
	isSelected: boolean;
	hasTransactionFee: boolean;
}

export class PaymentMethodVMContainer {
	private _paymentMethodList: PaymentMethodVM[];

	constructor(paymentMethods: HotelPaymentMethodsDO, availablePaymentMethodIdList: string[]) {
		this._paymentMethodList = [];
		paymentMethods.paymentMethodList.forEach((paymentMethod: PaymentMethodDO) => {
			var paymMethodVM: PaymentMethodVM = new PaymentMethodVM();
			paymMethodVM.paymentMethod = paymentMethod;
			paymMethodVM.isSelected = _.contains(availablePaymentMethodIdList, paymentMethod.id);
			this._paymentMethodList.push(paymMethodVM);
		});
	}

	public get paymentMethodList(): PaymentMethodVM[] {
		return this._paymentMethodList;
	}
	
	public set paymentMethodList(paymentMethodList: PaymentMethodVM[]) {
		this._paymentMethodList = paymentMethodList;
	}

	public getSelectedPaymentMethodIdList(): string[] {
		var filteredPM: PaymentMethodVM[] = _.filter(this._paymentMethodList, (paymMethodVM: PaymentMethodVM) => {
			return paymMethodVM.isSelected;
		})
		return _.map(filteredPM, (paymMethodVM: PaymentMethodVM) => {
			return paymMethodVM.paymentMethod.id;
		});
	}
}