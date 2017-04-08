import { HotelPaymentMethodsDO } from '../../../../../../../services/settings/data-objects/HotelPaymentMethodsDO';
import { PaymentMethodDO } from '../../../../../../../services/common/data-objects/payment-method/PaymentMethodDO';
import { ThUtils } from "../../../../../../../../../common/utils/ThUtils";
import { PaymentMethodInstanceDO } from "../../../../../../../services/common/data-objects/payment-method/PaymentMethodInstanceDO";
import { AggregatedPaymentMethodDO } from "../../../../../../../services/common/data-objects/payment-method/AggregatedPaymentMethodDO";
import { TransactionFeeType, TransactionFeeDO } from "../../../../../../../services/common/data-objects/payment-method/TransactionFeeDO";
import { ThValidators } from "../../../../../../../../../common/utils/form-utils/ThValidators";
import { PercentageValidator } from "../../../../../../../../../common/utils/form-utils/validators/PercentageValidator";
import { PriceValidator } from "../../../../../../../../../common/utils/form-utils/validators/PriceValidator";
import { AThValidator } from "../../../../../../../../../common/utils/form-utils/validators/AThValidator";
import { ThDataValidators } from "../../../../../../../../../common/utils/form-utils/utils/ThDataValidators";

export class PaymentMethodVM {
	aggregatedPaymentMethod: AggregatedPaymentMethodDO;
	_isSelected: boolean;

	public get iconUrl(): string {
		return this.aggregatedPaymentMethod.paymentMethod.iconUrl;
	}

	public get name(): string {
		return this.aggregatedPaymentMethod.paymentMethod.name;
	}

	public get transactionFeeAmount(): number {
		return this.aggregatedPaymentMethod.transactionFee.printableAmount;
	}

	public set transactionFeeAmount(amount: number) {
		if (this.transactionFeeType == TransactionFeeType.Percentage && amount != null) {
			amount = amount / 100;
		}
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

		if (!isSelected) {
			this.transactionFeeType = TransactionFeeType.Fixed;
			this.transactionFeeAmount = 0;
		}
	}

	public get hasFixedTransactionFee(): boolean {
		return this.aggregatedPaymentMethod.transactionFee.type === TransactionFeeType.Fixed;
	}

	public set hasFixedTransactionFee(hasFixedTransactionFee: boolean) {
		this.aggregatedPaymentMethod.transactionFee.type = hasFixedTransactionFee ? TransactionFeeType.Fixed : TransactionFeeType.Percentage;
	}

	public trasactionFeeIsValid(): boolean {
		if (this.hasFixedTransactionFee) {
			return ThDataValidators.isValidPrice(this.transactionFeeAmount);
		}
		else {
			return ThDataValidators.isValidPercentage(this.transactionFeeAmount);
		}
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
			if (paymentSupportedByHotel) {
				let paymentMethodInstance = _.find(supportedPaymentMethodInstanceList, (pmInstance: PaymentMethodInstanceDO) => {
					return pmInstance.paymentMethodId == paymentMethod.id;
				});
				paymMethodVM.aggregatedPaymentMethod.transactionFee = paymentMethodInstance.transactionFee;
			}
			else {
				paymMethodVM.aggregatedPaymentMethod.transactionFee = TransactionFeeDO.getDefaultTransactionFee();
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

	public allSelectedPaymentMethodsHaveValidTransactionFees(): boolean {
		let valid = true;

		_.forEach(this._paymentMethodList, (paymentVM: PaymentMethodVM) => {
			if (!paymentVM.trasactionFeeIsValid()) {
				valid = false;
			}
		});

		return valid;
	}
}