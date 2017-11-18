import _ = require('underscore');
import { APaginatedTransactionalMongoPatch } from "../../utils/APaginatedTransactionalMongoPatch";
import { MongoRepository } from "../../../../../../data-layer/common/base/MongoRepository";
import { MongoPatchType } from "../MongoPatchType";
import { ThError } from "../../../../../../utils/th-responses/ThError";
import { InvoiceDO, InvoiceAccountingType } from '../../../../../../data-layer/invoices/data-objects/InvoiceDO';
import { InvoicePaymentStatus } from '../../../../../../data-layer/invoices-legacy/data-objects/InvoiceDO';
import { InvoicePayerDO } from '../../../../../../data-layer/invoices/data-objects/payer/InvoicePayerDO';
import { SettingType } from "../../../../../../data-layer/settings/data-objects/common/SettingMetadataDO";
import { CurrencyDO } from "../../../../../../data-layer/common/data-objects/currency/CurrencyDO";
import { CurrencyCodes } from "./P1_data-sets/CurrencyCodes";
import { CurrencySettingDO } from "../../../../../../data-layer/settings/data-objects/currency/CurrencySettingDO";

export class P15_AddDecimalsNoInCurrencies extends APaginatedTransactionalMongoPatch {

    protected getMongoRepository(): MongoRepository {
        return this.settingsRepository;
    }

    public getPatchType(): MongoPatchType {
        return MongoPatchType.AddDecimalsNoInCurrencies;
    }

    protected updateDocumentInMemory(setting) {
        if (setting.metadata.type == SettingType.CurrencyCodes) {
            var currencySetting: CurrencySettingDO = (new CurrencyCodes()).getCurrencySettingDO();
            setting["value"] = currencySetting.value;
        }

    }
}
