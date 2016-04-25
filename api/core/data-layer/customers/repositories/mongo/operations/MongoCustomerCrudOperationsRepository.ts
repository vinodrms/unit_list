import {ThLogger, ThLogLevel} from '../../../../../utils/logging/ThLogger';
import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {CustomerRepositoryHelper} from './helpers/CustomerRepositoryHelper';
import {MongoRepository} from '../../../../common/base/MongoRepository';
import {CustomerMetaRepoDO, CustomerItemMetaRepoDO} from '../../ICustomerRepository';
import {CustomerDO, CustomerStatus} from '../../../data-objects/CustomerDO';

export class MongoCustomerCrudOperationsRepository extends MongoRepository {
	private _helper: CustomerRepositoryHelper;

    constructor(customerEntity: Sails.Model) {
        super(customerEntity);
		this._helper = new CustomerRepositoryHelper();
    }

	public addCustomer(meta: CustomerMetaRepoDO, customer: CustomerDO): Promise<CustomerDO> {
		return new Promise<CustomerDO>((resolve: { (result: CustomerDO): void }, reject: { (err: ThError): void }) => {
			this.addCustomerCore(meta, customer, resolve, reject);
		});
	}
	private addCustomerCore(meta: CustomerMetaRepoDO, customer: CustomerDO, resolve: { (result: CustomerDO): void }, reject: { (err: ThError): void }) {
		customer.hotelId = meta.hotelId;
		customer.versionId = 0;
		customer.status = CustomerStatus.Active;
		this.createDocument(customer,
			(err: Error) => {
				var thError = new ThError(ThStatusCode.CustomerRepositoryErrorCreatingCustomer, err);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error adding customer", { meta: meta, customer: customer }, thError);
				reject(thError);
			},
			(createdCustomer: Object) => {
				resolve(this._helper.buildCustomerDOFrom(createdCustomer));
			}
		);
	}

	public getCustomerById(meta: CustomerMetaRepoDO, customerId: string): Promise<CustomerDO> {
		return new Promise<CustomerDO>((resolve: { (result: CustomerDO): void }, reject: { (err: ThError): void }) => {
			this.getCustomerByIdCore(meta, customerId, resolve, reject);
		});
	}
	private getCustomerByIdCore(meta: CustomerMetaRepoDO, customerId: string, resolve: { (result: CustomerDO): void }, reject: { (err: ThError): void }) {
		this.findOneDocument({ "hotelId": meta.hotelId, "id": customerId },
			() => {
				var thError = new ThError(ThStatusCode.CustomerRepositoryCustomerNotFound, null);
				ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Customer not found", { meta: meta, customerId: customerId }, thError);
				reject(thError);
			},
			(err: Error) => {
				var thError = new ThError(ThStatusCode.CustomerRepositoryErrorGettingCustomer, err);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting customer by id", { meta: meta, customerId: customerId }, thError);
				reject(thError);
			},
			(foundCustomer: Object) => {
				resolve(this._helper.buildCustomerDOFrom(foundCustomer));
			}
		);
	}

	public updateCustomer(meta: CustomerMetaRepoDO, itemMeta: CustomerItemMetaRepoDO, customer: CustomerDO): Promise<CustomerDO> {
		return this.findAndModifyCustomer(meta, itemMeta,
			{
				"type": customer.type,
				"customerDetails": customer.customerDetails,
				"fileAttachmentList": customer.fileAttachmentList,
				"priceProductDetails": customer.priceProductDetails,
				"notes": customer.notes
			});
	}

	private findAndModifyCustomer(meta: CustomerMetaRepoDO, itemMeta: CustomerItemMetaRepoDO, updateQuery: any): Promise<CustomerDO> {
		return new Promise<CustomerDO>((resolve: { (result: CustomerDO): void }, reject: { (err: ThError): void }) => {
			this.findAndModifyCustomerCore(meta, itemMeta, updateQuery, resolve, reject);
		});
	}
	private findAndModifyCustomerCore(meta: CustomerMetaRepoDO, itemMeta: CustomerItemMetaRepoDO, updateQuery: any, resolve: { (result: CustomerDO): void }, reject: { (err: ThError): void }) {
		updateQuery.$inc = { "versionId": 1 };
		var findQuery: Object = {
			"hotelId": meta.hotelId,
			"id": itemMeta.id,
			"versionId": itemMeta.versionId
		};
		this.findAndModifyDocument(findQuery, updateQuery,
			() => {
				var thError = new ThError(ThStatusCode.CustomerRepositoryProblemUpdatingCustomer, null);
				ThLogger.getInstance().logBusiness(ThLogLevel.Info, "Problem updating customer - concurrency", { meta: meta, itemMeta: itemMeta, updateQuery: updateQuery }, thError);
				reject(thError);
			},
			(err: Error) => {
				var thError = new ThError(ThStatusCode.CustomerRepositoryErrorUpdatingCustomer, err);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error updating customer", { meta: meta, itemMeta: itemMeta, updateQuery: updateQuery }, thError);
				reject(thError);
			},
			(updatedDBCustomer: Object) => {
				resolve(this._helper.buildCustomerDOFrom(updatedDBCustomer));
			}
		);
	}
}