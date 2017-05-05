import {BaseDO} from '../../../common/base/BaseDO';
import {ThTranslation} from '../../../../utils/localization/ThTranslation';

export interface IInvoiceItemMeta extends BaseDO {
    getNumberOfItems(): number;
    getDisplayName(thTranslation: ThTranslation): string;
    isDerivedFromBooking(): boolean;
    getUnitPrice(): number;
    getVatId(): string;
}