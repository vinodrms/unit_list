import {BaseDO} from '../../../common/base/BaseDO';
import {ThTranslation} from '../../../../utils/localization/ThTranslation';

export interface IInvoiceItemMeta extends BaseDO {
    getPriceForItem(): number;
    getNumberOfItems(): number;
    getDisplayName(thTranslation: ThTranslation): string;
}