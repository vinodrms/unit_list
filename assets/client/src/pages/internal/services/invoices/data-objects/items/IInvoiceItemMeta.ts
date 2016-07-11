import {BaseDO} from '../../../../../../common/base/BaseDO';
import {ThTranslation} from '../../../../../../common/utils/localization/ThTranslation';

export interface IInvoiceItemMeta extends BaseDO {
    getPriceForItem(): number;
    getNumberOfItems(): number;
    getDisplayName(thTranslation: ThTranslation): string;
}