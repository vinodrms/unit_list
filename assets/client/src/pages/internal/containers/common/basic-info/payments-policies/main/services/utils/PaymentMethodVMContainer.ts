import { HotelPaymentMethodsDO } from '../../../../../../../services/settings/data-objects/HotelPaymentMethodsDO';
import { PaymentMethodDO } from '../../../../../../../services/common/data-objects/payment-method/PaymentMethodDO';
import { ThUtils } from "../../../../../../../../../common/utils/ThUtils";
import { PaymentMethodInstanceDO } from "../../../../../../../services/common/data-objects/payment-method/PaymentMethodInstanceDO";
import { AggregatedPaymentMethodDO } from "../../../../../../../services/common/data-objects/payment-method/AggregatedPaymentMethodDO";
import { TransactionFeeType } from "../../../../../../../services/common/data-objects/payment-method/TransactionFeeDO";

export class PaymentMethodVM {
	aggregatedPaymentMethod: AggregatedPaymentMethodDO;
	_isSelected: boolean;
	_hasTransactionFee: boolean;

	public get iconUrl(): string {
		return this.aggregatedPaymentMethod.paymentMethod.iconUrl;
	}

	public get name(): string {
		return this.aggregatedPaymentMethod.paymentMethod.name;
	}

	public get transactionFeeAmount(): number {
		return this.aggregatedPaymentMethod.transactionFee.amount;
	}

	public set transactionFeeAmount(amount: number) {
		this.aggregatedPaymentMethod.transactionFee.amount = amount;
	}

	public get transactionFeeType(): TransactionFeeType {
		return this.aggregatedPaymentMethod.transactionFee.type;
	}

	public set transactionFeeType(type: TransactionFeeType) {
		this.aggregatedPaymentMethod.transactionFee.type = type;
	}

	public get isSelected(): boolean {
		return this._isSelected;
	}

	public set isSelected(isSelected: boolean) {
		this._isSelected = isSelected;
	}
}

export class PaymentMethodVMContainer {
	private _thUtils: ThUtils;
	private _paymentMethodList: PaymentMethodVM[];

	constructor(allAvailablePaymentMethods: HotelPaymentMethodsDO, supportedPaymentMethodInstanceList: PaymentMethodInstanceDO[]) {
		this._thUtils = new ThUtils();
		this._paymentMethodList = [];
		
		let supportedPaymentMethodIdList = _.map(supportedPaymentMethodInstanceList, (paymentMethod: PaymentMethodInstanceDO) => {
			return paymentMethod.paymentMethodId;
		});
		
		allAvailablePaymentMethods.paymentMethodList.forEach((paymentMethod: PaymentMethodDO) => {
			var paymMethodVM: PaymentMethodVM = new PaymentMethodVM();
			paymMethodVM.aggregatedPaymentMethod = new AggregatedPaymentMethodDO();
			paymMethodVM.aggregatedPaymentMethod.paymentMethod = paymentMethod;

			let paymentSupportedByHotel = _.contains(supportedPaymentMethodIdList, paymentMethod.id);
			if(paymentSupportedByHotel) {
				let paymentMethodInstance = _.find(supportedPaymentMethodInstanceList, (pmInstance: PaymentMethodInstanceDO) => {
					return pmInstance.paymentMethodId == paymentMethod.id;
				});

				paymMethodVM.aggregatedPaymentMethod = new AggregatedPaymentMethodDO();
				paymMethodVM.aggregatedPaymentMethod.paymentMethod = paymentMethod;
				paymMethodVM.aggregatedPaymentMethod.transactionFee = paymentMethodInstance.transactionFee;
			}
			paymMethodVM.isSelected = paymentSupportedByHotel;
			
			this._paymentMethodList.push(paymMethodVM);
		});
	}

	public get paymentMethodList(): PaymentMethodVM[] {
		return this._paymentMethodList;
	}
	
	public set paymentMethodList(paymentMethodList: PaymentMethodVM[]) {
		this._paymentMethodList = paymentMethodList;
	}

	public getSelectedPaymentMethodList(): PaymentMethodInstanceDO[] {
		var filteredPM: PaymentMethodVM[] = _.filter(this._paymentMethodList, (paymMethodVM: PaymentMethodVM) => {
			return paymMethodVM.isSelected;
		});

		return _.map(filteredPM, (paymMethodVM: PaymentMethodVM) => {
			let paymentInstanceDO = new PaymentMethodInstanceDO();
			paymentInstanceDO.paymentMethodId = paymMethodVM.aggregatedPaymentMethod.paymentMethod.id;
			paymentInstanceDO.transactionFee = paymMethodVM.aggregatedPaymentMethod.transactionFee;
			return paymentInstanceDO;
		});
	}
}