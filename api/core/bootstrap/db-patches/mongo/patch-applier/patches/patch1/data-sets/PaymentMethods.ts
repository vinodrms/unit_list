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
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
        {
            name: "Visa",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
        {
            name: "American Express",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
        {
            name: "Euro/Mastercard",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        }
        ,
        {
            name: "Diners Club",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        }
        ,
        {
            name: "JCB",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
        {
            name: "Maestro",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
        {
            name: "Discover",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        }
    ];
}