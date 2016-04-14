import {CustomerDO, CustomerType} from '../data-objects/CustomerDO';
import {PriceProductDO} from '../../price-products/data-objects/PriceProductDO';

export class CustomerVM {
	private _customer: CustomerDO;
	private _priceProductList: PriceProductDO[];

	constructor() {
		this._priceProductList = [];
	}

	public get customer(): CustomerDO {
		return this._customer;
	}
	public set customer(customer: CustomerDO) {
		this._customer = customer;
	}
	public get priceProductList(): PriceProductDO[] {
		return this._priceProductList;
	}
	public set priceProductList(priceProductList: PriceProductDO[]) {
		this._priceProductList = priceProductList;
	}

	public get customerNameString(): string {
		return this._customer.customerDetails.getName();
	}
	public get customerAddressString(): string {
		return this._customer.customerDetails.getAddress().toString();
	}
	public get customerTypeString(): string {
		switch (this._customer.type) {
			case CustomerType.Individual:
				return "Individual";
			case CustomerType.Company:
				return "Company";
			case CustomerType.TravelAgency:
				return "Travel Agency";
			default:
				return "";
		}
	}

	public get phoneString(): string {
		return this._customer.customerDetails.getPhone();
	}
	public get emailString(): string {
		return this._customer.customerDetails.getEmail();
	}

	public buildPrototype(): CustomerVM {
		var copy = new CustomerVM();
		copy.customer = new CustomerDO();
		copy.customer.buildFromObject(this.customer);
		copy.priceProductList = [];
		copy.priceProductList = copy.priceProductList.concat(this._priceProductList);
		return copy;
	}
}