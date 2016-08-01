import {CustomerDO, CustomerType} from '../data-objects/CustomerDO';
import {PriceProductDO} from '../../price-products/data-objects/PriceProductDO';
import {CustomerDetailsFactory} from '../data-objects/customer-details/CustomerDetailsFactory';
import {CustomerDetailsMeta} from '../data-objects/customer-details/ICustomerDetailsDO';
import {AllotmentDO} from '../../allotments/data-objects/AllotmentDO';

export class CustomerVM {
	private _customer: CustomerDO;
	private _priceProductList: PriceProductDO[];
	private _customerTypeString: string;
	private _fontName: string;
	private _allotmentList: AllotmentDO[];

	constructor() {
		this._priceProductList = [];
	}

	public get customer(): CustomerDO {
		return this._customer;
	}
	public set customer(customer: CustomerDO) {
		this._customer = customer;
		var custDetailsFactory = new CustomerDetailsFactory();
		var foundDetailsMeta = _.find(custDetailsFactory.getCustomerDetailsMetaList(), (meta: CustomerDetailsMeta) => { return meta.customerType === customer.type });
		this._customerTypeString = !foundDetailsMeta ? "" : foundDetailsMeta.customerTypeName;
		this._fontName = foundDetailsMeta.fontName;
	}
	public get priceProductList(): PriceProductDO[] {
		return this._priceProductList;
	}
	public set priceProductList(priceProductList: PriceProductDO[]) {
		this._priceProductList = priceProductList;
	}
	public get allotmentList(): AllotmentDO[] {
		return this._allotmentList;
	}
	public set allotmentList(allotmentList: AllotmentDO[]) {
		this._allotmentList = allotmentList;
	}

	public get customerNameString(): string {
		return this._customer.customerDetails.getName();
	}
	public get customerAddressString(): string {
		return this._customer.customerDetails.getAddress().toString();
	}
	public get customerTypeString(): string {
		return this._customerTypeString;
	}
	public get customerTypeFont(): string {
		return this._fontName;
	}
	public set customerTypeString(customerTypeString: string) {
		this._customerTypeString = customerTypeString;
	}
	public get phoneString(): string {
		return this._customer.customerDetails.getPhone();
	}
	public get emailString(): string {
		return this._customer.emailString;
	}

	public isNewCustomer(): boolean {
		return !this._customer.id;
	}
	public getNumberOfAllotmentsForPriceProduct(priceProduct: PriceProductDO): number {
		var foundAllotmentList: AllotmentDO[] = _.filter(this._allotmentList, (allotment: AllotmentDO) => {
			return allotment.priceProductId === priceProduct.id;
		});
		return foundAllotmentList.length;
	}

	public buildPrototype(): CustomerVM {
		var copy = new CustomerVM();
		var copyDO = new CustomerDO;
		copyDO.buildFromObject(this.customer);
		copy.customer = copyDO;
		copy.priceProductList = [];
		copy.priceProductList = copy.priceProductList.concat(this._priceProductList);
		return copy;
	}
}