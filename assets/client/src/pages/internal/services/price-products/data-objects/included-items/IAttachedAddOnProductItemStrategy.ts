import {BaseDO} from '../../../../../../common/base/BaseDO';
import {ThTranslation} from '../../../../../../common/utils/localization/ThTranslation';

export enum AttachedAddOnProductItemStrategyType {
    OneItemPerDay,
    OneItemForEachAdultOrChild,
    OneItemPerDayForEachAdultOrChild,
    FixedNumber
}

export interface IAttachedAddOnProductItemStrategy extends BaseDO {
    getValueDisplayString(thTranslation: ThTranslation): string;
    getStrategyType(): AttachedAddOnProductItemStrategyType;
    equals(otherStrategy: IAttachedAddOnProductItemStrategy): boolean;
}