import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {ThUtils} from '../../../utils/ThUtils';
import {CustomerDO, CustomerStatus} from '../../../data-layer/customers/data-objects/CustomerDO';
import {CustomerSearchResultRepoDO} from '../../../data-layer/customers/repositories/ICustomerRepository';
import {CustomersContainer} from './results/CustomersContainer';

import _ = require("underscore");

export class CustomerIdValidator {
    private _thUtils: ThUtils;
    private _customerIdList: string[];

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thUtils = new ThUtils();
    }

    public validateCustomerIdList(customerIdList: string[]): Promise<CustomersContainer> {
        this._customerIdList = customerIdList;
        return new Promise<CustomersContainer>((resolve: { (result: CustomersContainer): void }, reject: { (err: ThError): void }) => {
            this.validateCustomerIdListCore(resolve, reject);
        });
    }
    private validateCustomerIdListCore(resolve: { (result: CustomersContainer): void }, reject: { (err: ThError): void }) {
        if (this._customerIdList.length == 0) {
            resolve(new CustomersContainer([]));
            return;
        }

        var custRepo = this._appContext.getRepositoryFactory().getCustomerRepository();
        custRepo.getCustomerList({ hotelId: this._sessionContext.sessionDO.hotel.id }, { customerIdList: this._customerIdList, status: CustomerStatus.Active })
            .then((searchResult: CustomerSearchResultRepoDO) => {
                var validCustomerIdList: string[] = this.getIdList(searchResult.customerList);
                if (!this._thUtils.firstArrayIncludedInSecond(this._customerIdList, validCustomerIdList)) {
                    var thError = new ThError(ThStatusCode.CustomerIdValidatorInvalidId, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Invalid customer id list", this._customerIdList, thError);
                    throw thError;
                }
                resolve(new CustomersContainer(searchResult.customerList));
            }).catch((error: any) => {
                reject(error);
            });
    }
    private getIdList(customerList: CustomerDO[]): string[] {
        return _.map(customerList, (customerDO: CustomerDO) => {
            return customerDO.id;
        });
    }
}