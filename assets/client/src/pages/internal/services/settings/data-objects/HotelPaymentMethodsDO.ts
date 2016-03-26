import {BaseDO} from '../../../../../common/base/BaseDO';
import {PaymentMethodDO} from '../../common/data-objects/payment-method/PaymentMethodDO';

export class HotelPaymentMethodsDO extends BaseDO {
	paymentMethodList: PaymentMethodDO[];

	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.paymentMethodList = [];
		this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "paymentMethodList"), (amenityObject: Object) => {
			var paymentMethodDO = new PaymentMethodDO();
			paymentMethodDO.buildFromObject(amenityObject);
			this.paymentMethodList.push(paymentMethodDO);
		});
	}
}