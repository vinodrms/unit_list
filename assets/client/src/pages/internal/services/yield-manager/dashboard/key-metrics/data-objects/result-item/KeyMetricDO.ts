import {BaseDO} from '../../../../../../../../common/base/BaseDO';
import {KeyMetricType} from './KeyMetricType';
import {KeyMetricValueType} from '../metric-value/KeyMetricValueType';
import {IKeyMetricValue} from '../metric-value/IKeyMetricValue';
import {InventoryKeyMetricDO} from '../metric-value/InventoryKeyMetricDO';
import {PercentageKeyMetricDO} from '../metric-value/PercentageKeyMetricDO';
import {PriceKeyMetricDO} from '../metric-value/PriceKeyMetricDO';

export class KeyMetricDO extends BaseDO {
    type: KeyMetricType;
    valueType: KeyMetricValueType;
    valueList: IKeyMetricValue[];

    protected getPrimitivePropertyKeys(): string[] {
        return ["type", "valueType"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.valueList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "valueList"), (keyMetricValueObject: Object) => {
            var metricValue: IKeyMetricValue = this.getKeyMetricValueInstance();
            metricValue.buildFromObject(keyMetricValueObject);
            this.valueList.push(metricValue);
        });
    }

    private getKeyMetricValueInstance(): IKeyMetricValue {
        switch (this.valueType) {
            case KeyMetricValueType.Inventory:
                return new InventoryKeyMetricDO();
            case KeyMetricValueType.Percentage:
                return new PercentageKeyMetricDO();
            case KeyMetricValueType.Price:
                return new PriceKeyMetricDO();
        }
    }
}