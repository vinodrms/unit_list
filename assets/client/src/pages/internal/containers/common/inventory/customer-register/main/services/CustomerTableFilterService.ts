import {Injectable} from 'angular2/core';
import {CustomerType} from '../../../../../../services/customers/data-objects/CustomerDO';
import {CustomersService} from '../../../../../../services/customers/CustomersService';
import {CustomerDetailsMeta} from '../../../../../../services/customers/data-objects/customer-details/ICustomerDetailsDO';
import {CustomerDetailsFactory} from '../../../../../../services/customers/data-objects/customer-details/CustomerDetailsFactory';

@Injectable()
export class CustomerTableFilterService {
	private static AllCustomersType: number = 9999999;

	private _filterList: CustomerDetailsMeta[];
	private _currentFilter: CustomerDetailsMeta;

	constructor(private _customersService: CustomersService) {
		this.initFilterList();
	}
	private initFilterList() {
		var custFactory = new CustomerDetailsFactory();
		this._filterList= [
			{
				customerTypeName: "All Customers",
				customerType: CustomerTableFilterService.AllCustomersType
			}
		];
		this._filterList = this._filterList.concat(custFactory.getCustomerDetailsMetaList());
		this._currentFilter = this._filterList[0];
	}

	public selectFilter(filter: CustomerDetailsMeta) {
		var customerType = filter.customerType;
		if(customerType === this._currentFilter.customerType) {
			return;
		}
		this._currentFilter = this.getFilterByCustomerType(customerType);
		this.updateCustomersService();
	}

	private getFilterByCustomerType(customerType: CustomerType) {
		return _.find(this._filterList, (filter: CustomerDetailsMeta) => {
			return filter.customerType === customerType;
		});
	}
	private updateCustomersService() {
		if(this._currentFilter.customerType === CustomerTableFilterService.AllCustomersType) {
			this._customersService.removeCustomerTypeFilter();
		}
		else {
			this._customersService.setCustomerTypeFilter(this._currentFilter.customerType);	
		}
		this._customersService.refreshData();
	}
	public isFilterSelected(filter: CustomerDetailsMeta): boolean {
		return filter.customerType === this._currentFilter.customerType;
	}
	
	public get filterList(): CustomerDetailsMeta[] {
		return this._filterList;
	}
	public set filterList(filterList: CustomerDetailsMeta[]) {
		this._filterList = filterList;
	}
	public get currentFilter(): CustomerDetailsMeta {
		return this._currentFilter;
	}
	public set currentFilter(currentFilter: CustomerDetailsMeta) {
		this._currentFilter = currentFilter;
	}
}