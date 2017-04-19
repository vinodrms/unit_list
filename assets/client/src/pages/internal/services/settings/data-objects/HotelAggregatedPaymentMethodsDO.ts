import { BaseDO } from '../../../../../common/base/BaseDO';
import { AggregatedPaymentMethodDO } from '../../common/data-objects/payment-method/AggregatedPaymentMethodDO';

export class HotelAggregatedPaymentMethodsDO extends BaseDO {
	paymentMethodList: AggregatedPaymentMethodDO[];

	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.paymentMethodList = [];
		this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "paymentMethodList"), (paymentMethodObject: Object) => {
			var paymentMethodDO = new AggregatedPaymentMethodDO();
			paymentMethodDO.buildFromObject(paymentMethodObject);
			this.paymentMethodList.push(paymentMethodDO);
		});
	}
}