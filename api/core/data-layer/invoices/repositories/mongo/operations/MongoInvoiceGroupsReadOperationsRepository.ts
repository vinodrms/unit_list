import {MongoRepository, MongoErrorCodes, MongoSearchCriteria} from '../../../../common/base/MongoRepository';
import {MongoQueryBuilder} from '../../../../common/base/MongoQueryBuilder';

export class MongoInvoiceGroupsReadOperationsRepository extends MongoRepository {
    
    constructor(invoiceGroupsEntity: Sails.Model) {
        super(invoiceGroupsEntity);
        
    }
}