import {BaseDO} from '../../../common/base/BaseDO';
import {ThTranslation} from '../../../../utils/localization/ThTranslation';
import {IPriceableEntity} from '../price/IPriceableEntity';

export interface IInvoiceItemMeta extends BaseDO, IPriceableEntity {
    getNumberOfItems(): number;
    getDisplayName(thTranslation: ThTranslation): string;
    setMovable(movable: boolean);
    isMovable(): boolean;
}