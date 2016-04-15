import {Injectable} from 'angular2/core';
import {CustomerType} from '../../../../../../services/customers/data-objects/CustomerDO';
import {CustomersService} from '../../../../../../services/customers/CustomersService';

export interface CustomerFilterMeta {
	customerType: number;
	displayText: string;
}

@Injectable()
export class CustomerTableFilterService {
	private static AllCustomersType: number = 9999999;

	private _filterList: CustomerFilterMeta[];
	private _currentFilter: CustomerFilterMeta;

	constructor(private _customersService: CustomersService) {
		this.initFilterList();
	}
	private initFilterList() {
		this._filterList = [
			{
				displayText: "All Customers",
				customerType: CustomerTableFilterService.AllCustomersType
			},
			{
				displayText: "Individuals",
				customerType: CustomerType.Individual
			},
			{
				displayText: "Companies",
				customerType: CustomerType.Company
			},
			{
				displayText: "Travel Agencies",
				customerType: CustomerType.TravelAgency
			}
		];
		this._currentFilter = this._filterList[0];
	}

	public selectFilter(filter: CustomerFilterMeta) {
		var customerType = filter.customerType;
		if(customerType === this._currentFilter.customerType) {
			return;
		}
		this._currentFilter = this.getFilterByCustomerType(customerType);
		this.updateCustomersService();
	}

	private getFilterByCustomerType(customerType: CustomerType) {
		return _.find(this._filterList, (filter: CustomerFilterMeta) => {
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
	public isFilterSelected(filter: CustomerFilterMeta): boolean {
		return filter.customerType === this._currentFilter.customerType;
	}
	
	public get filterList(): CustomerFilterMeta[] {
		return this._filterList;
	}
	public set filterList(filterList: CustomerFilterMeta[]) {
		this._filterList = filterList;
	}
	public get currentFilter(): CustomerFilterMeta {
		return this._currentFilter;
	}
	public set currentFilter(currentFilter: CustomerFilterMeta) {
		this._currentFilter = currentFilter;
	}
}