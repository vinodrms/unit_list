import {BaseDO} from '../../../../../../../common/base/BaseDO';
import {ThDateDO} from '../../../../common/data-objects/th-dates/ThDateDO';
import {ArrivalItemInfoDO} from './ArrivalItemInfoDO';

export class ArrivalsInfoDO extends BaseDO {
    arrivalInfoList: ArrivalItemInfoDO[];
    referenceDate: ThDateDO;

    protected getPrimitivePropertyKeys(): string[] {
        return [];
    }
    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.arrivalInfoList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "arrivalInfoList"), (arrivalItemObject: Object) => {
            var arrivalItemInfoDO = new ArrivalItemInfoDO();
            arrivalItemInfoDO.buildFromObject(arrivalItemObject);
            this.arrivalInfoList.push(arrivalItemInfoDO);
        });

        this.referenceDate = new ThDateDO();
        this.referenceDate.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "referenceDate"));
    }
}