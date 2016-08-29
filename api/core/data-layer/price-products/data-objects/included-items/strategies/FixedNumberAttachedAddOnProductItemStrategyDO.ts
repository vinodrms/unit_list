import {BaseDO} from '../../../../common/base/BaseDO';
import {IAttachedAddOnProductItemStrategy, AttachedAddOnProductItemStrategyQueryDO} from '../IAttachedAddOnProductItemStrategy';

import _ = require('underscore');

export class FixedNumberAttachedAddOnProductItemStrategyDO extends BaseDO implements IAttachedAddOnProductItemStrategy {
    noOfItems: number;

    protected getPrimitivePropertyKeys(): string[] {
        return ["noOfItems"];
    }

    public getNumberOfItems(query: AttachedAddOnProductItemStrategyQueryDO): number {
        return this.noOfItems;
    }
    public isValid(): boolean {
        return _.isNumber(this.noOfItems) && this.isValidInteger(this.noOfItems);
    }
    private isValidInteger(n: number): boolean {
        return Number(n) === n && n % 1 === 0;
    }
}