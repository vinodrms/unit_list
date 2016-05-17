import {BaseDO} from '../../../common/base/BaseDO';
import {BedMetaDO} from './BedMetaDO';

export class BedConfigDO extends BaseDO {
    bedMetaList: BedMetaDO[];

    protected getPrimitivePropertyKeys(): string[] {
        return [];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.bedMetaList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "bedMetaList"), (bedMetaObject: Object) => {
            var bedMetaDO = new BedMetaDO();
            bedMetaDO.buildFromObject(bedMetaObject);
            this.bedMetaList.push(bedMetaDO);
        });
    }

    public equals(bedConfig: BedConfigDO): boolean {
        var counter = 0;
        _.forEach(this.bedMetaList, (bedMeta: BedMetaDO) => {
            var result = _.findWhere(bedConfig.bedMetaList, { bedId: bedMeta.bedId, noOfInstances: bedMeta.noOfInstances });
            if(!_.isUndefined(result)) {
                counter++;
            }
        });
        return counter === this.bedMetaList.length;
    }
}