import { ThPeriodDO } from './ThPeriodDO';
import { ThDateDO } from '../../../../utils/th-dates/data-objects/ThDateDO';

export interface IThDateToThPeriodConverter {
    convert(date: ThDateDO): ThPeriodDO;
}