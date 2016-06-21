import {IBusinessValidationRule} from './IBusinessValidationRule';
import {ThError} from '../../../utils/th-responses/ThError';

import _ = require('underscore');

export class BusinessValidationRuleContainer<T> implements IBusinessValidationRule<T> {
    constructor(private _businessValidationRuleList: IBusinessValidationRule<T>[]) {
    }

    public addBusinessValidationRule(businessValidationRule: IBusinessValidationRule<T>) {
        this._businessValidationRuleList.push(businessValidationRule);
    }

    public isValidOn(businessObject: T): Promise<T> {
        return new Promise<T>((resolve: { (result: T): void }, reject: { (err: ThError): void }) => {
            if (this._businessValidationRuleList.length === 0) {
                resolve(null);
                return;
            }

            var validationPromiseList: Promise<T>[] = [];
            _.forEach(this._businessValidationRuleList, (validationRule: IBusinessValidationRule<T>) => {
                validationPromiseList.push(validationRule.isValidOn(businessObject));
            });
            Promise.all(validationPromiseList).then((validationResultList: T[]) => {
                resolve(validationResultList[0]);
            }).catch((err: any) => {
                reject(err);
            });
        });
    }
}