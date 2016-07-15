import {BaseDO} from '../../../../../../../common/base/BaseDO';
import {ThDateDO} from '../../../../common/data-objects/th-dates/ThDateDO';
import {DepartureItemInfoDO} from './DepartureItemInfoDO';

export class DeparturesInfoDO extends BaseDO {
    departureInfoList: DepartureItemInfoDO[];
    referenceDate: ThDateDO;

    protected getPrimitivePropertyKeys(): string[] {
        return [];
    }
    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.departureInfoList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "departureInfoList"), (departureItemObject: Object) => {
            var departurelItemInfoDO = new DepartureItemInfoDO();
            departurelItemInfoDO.buildFromObject(departureItemObject);
            this.departureInfoList.push(departurelItemInfoDO);
        });

        this.referenceDate = new ThDateDO();
        this.referenceDate.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "referenceDate"));
    }
}