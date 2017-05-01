import {BaseDO} from '../../../../../../common/base/BaseDO';
import {ThTranslation} from '../../../../../../common/utils/localization/ThTranslation';

export interface IInvoiceItemMeta extends BaseDO {
    getNumberOfItems(): number;
    getDisplayName(thTranslation: ThTranslation): string;
    isMovableByDefault(): boolean;
    isDerivedFromBooking(): boolean;
    getUnitPrice(): number;
    getVatId(): string;
}