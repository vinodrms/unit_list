import {BaseDO} from '../../../common/base/BaseDO';
import {SettingMetadataDO} from '../common/SettingMetadataDO';
import {PaymentMethodDO} from '../../../common/data-objects/payment-method/PaymentMethodDO';

export class PaymentMethodSettingDO extends BaseDO {
    metadata: SettingMetadataDO;
    value: PaymentMethodDO[];
    protected getPrimitivePropertyKeys(): string[] {
        return [];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.metadata = new SettingMetadataDO();
        this.metadata.buildFromObject(object["metadata"]);

        this.value = [];
        this.forEachElementOf(object["value"], (paymentMethodObject: Object) => {
            var paymentMethodDO = new PaymentMethodDO();
            paymentMethodDO.buildFromObject(paymentMethodObject);
            this.value.push(paymentMethodDO);
        });
    }
}