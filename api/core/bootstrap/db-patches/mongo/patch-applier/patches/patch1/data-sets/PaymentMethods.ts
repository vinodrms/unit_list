import {ABaseSetting} from './ABaseSetting';
import {SettingMetadataDO, SettingType} from '../../../../../../../data-layer/settings/data-objects/common/SettingMetadataDO';
import {PaymentMethodDO} from '../../../../../../../data-layer/common/data-objects/payment-method/PaymentMethodDO';
import {PaymentMethodSettingDO} from '../../../../../../../data-layer/settings/data-objects/payment-method/PaymentMethodSettingDO';

export class PaymentMethods extends ABaseSetting {
    constructor() {
        super(SettingType.PaymentMethods, "Payment Methods");
    }

    public getPaymentMethodSettingDO(): PaymentMethodSettingDO {
        var readPaymentMethods = this.dataSet;
        var toAddPM: PaymentMethodDO[] = [];
        readPaymentMethods.forEach((readPm: { name: string, iconUrl: string }) => {
            var pmDO = new PaymentMethodDO();
            pmDO.iconUrl = readPm.iconUrl;
            pmDO.name = readPm.name;
            pmDO.id = this._thUtils.generateUniqueID();
            toAddPM.push(pmDO);
        });
        var pmSettingDO = new PaymentMethodSettingDO();
        pmSettingDO.metadata = this.getSettingMetadata();
        pmSettingDO.value = toAddPM;
        return pmSettingDO;
    }

    private dataSet: { name: string, iconUrl: string }[] = [
        {
            name: "Cash",
            iconUrl: "fa-money"
        },
        {
            name: "Visa",
            iconUrl: "fa-cc-visa"
        },
        {
            name: "American Express",
            iconUrl: "fa-cc-amex"
        },
        {
            name: "Euro/Mastercard",
            iconUrl: "fa-cc-mastercard"
        }
        ,
        {
            name: "Diners Club",
            iconUrl: "fa-cc-diners-club"
        }
        ,
        {
            name: "JCB",
            iconUrl: "fa-cc-jcb"
        },
        {
            name: "Maestro",
            iconUrl: "fa-credit-card-alt"
        },
        {
            name: "Discover",
            iconUrl: "fa-cc-discover"
        }
    ];
}