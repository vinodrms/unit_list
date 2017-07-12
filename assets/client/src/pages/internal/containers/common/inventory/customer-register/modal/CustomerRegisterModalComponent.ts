import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../../../../../common/base/BaseComponent';
import { LazyLoadingTableComponent } from '../../../../../../../common/utils/components/lazy-loading/LazyLoadingTableComponent';
import { LazyLoadTableMeta, TableRowCommand } from '../../../../../../../common/utils/components/lazy-loading/utils/LazyLoadTableMeta';
import { AppContext } from '../../../../../../../common/utils/AppContext';
import { ICustomModalComponent, ModalSize } from '../../../../../../../common/utils/modals/utils/ICustomModalComponent';
import { ModalDialogRef } from '../../../../../../../common/utils/modals/utils/ModalDialogRef';
import { CustomerRegisterTableMetaBuilderService } from '../main/services/CustomerRegisterTableMetaBuilderService';
import { CustomerTableFilterService } from '../main/services/CustomerTableFilterService';
import { CustomerRegisterModalInput } from './services/utils/CustomerRegisterModalInput';
import { CustomerDO } from '../../../../../services/customers/data-objects/CustomerDO';
import { CustomerVM } from '../../../../../services/customers/view-models/CustomerVM';
import { CustomersService } from '../../../../../services/customers/CustomersService';
import { CustomerDetailsMeta } from '../../../../../services/customers/data-objects/customer-details/ICustomerDetailsDO';
import { SETTINGS_PROVIDERS } from '../../../../../services/settings/SettingsProviders';
import { HotelService } from '../../../../../services/hotel/HotelService';
import { HotelAggregatorService } from '../../../../../services/hotel/HotelAggregatorService';
import { CustomerRegisterComponent } from '../main/CustomerRegisterComponent';

import * as _ from "underscore";

@Component({
	selector: 'customer-register-modal',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/customer-register/modal/template/customer-register-modal.html',
	providers: [CustomerRegisterTableMetaBuilderService, CustomerTableFilterService,
		SETTINGS_PROVIDERS, HotelService, HotelAggregatorService, CustomersService]
})
export class CustomerRegisterModalComponent extends BaseComponent implements ICustomModalComponent, AfterViewInit {
	@ViewChild(LazyLoadingTableComponent)
	private _aopTableComponent: LazyLoadingTableComponent<CustomerVM>;
	private _selectedCustomerList: CustomerDO[] = [];

	private editingCustomer: CustomerVM;
	private isEditing = false;

	constructor(private _appContext: AppContext,
		private _modalDialogRef: ModalDialogRef<CustomerDO[]>,
		private _tableBuilder: CustomerRegisterTableMetaBuilderService,
		private _custTableFilterService: CustomerTableFilterService,
		private _customersService: CustomersService,
		private _modalInput: CustomerRegisterModalInput) {
		super();
	}

	ngAfterViewInit() {
		this.bootstrapCustomersTable();
	}
	private bootstrapCustomersTable() {
		var lazyLoadTableMeta: LazyLoadTableMeta = this._tableBuilder.buildLazyLoadTableMeta();
		if (this._modalInput.multiSelection) {
			lazyLoadTableMeta.supportedRowCommandList.push(TableRowCommand.MultipleSelect);
		}
		else {
			lazyLoadTableMeta.supportedRowCommandList.push(TableRowCommand.Select);
		}
		lazyLoadTableMeta.autoSelectRows = true;
		this._aopTableComponent.bootstrap(this._customersService, lazyLoadTableMeta);
	}

	public closeDialog() {
		this._modalDialogRef.closeForced();
	}
	public isBlocking(): boolean {
		return false;
	}
	public getSize(): ModalSize {
		return ModalSize.Large;
	}

	public didSelectCustomer(customerVM: CustomerVM) {
		this._selectedCustomerList = [customerVM.customer];
	}
	public didSelectCustomerList(selectedCustomerList: CustomerVM[]) {
		this._selectedCustomerList = _.map(selectedCustomerList, (custVm: CustomerVM) => {
			return custVm.customer;
		});
	}
	public hasSelectedCustomer(): boolean {
		return this._selectedCustomerList.length > 0;
	}
	public triggerSelectedCustomerList() {
		if (!this.hasSelectedCustomer()) {
			return;
		}
		this._modalDialogRef.addResult(this._selectedCustomerList);
		this.closeDialog();
	}

	protected get filterList(): CustomerDetailsMeta[] {
		return this._custTableFilterService.filterList;
	}
	protected isFilterSelected(filter: CustomerDetailsMeta): boolean {
		return this._custTableFilterService.isFilterSelected(filter);
	}
	protected selectFilter(filter: CustomerDetailsMeta) {
		return this._custTableFilterService.selectFilter(filter);
	}
	protected addCustomer() {
		this.editingCustomer = CustomerRegisterComponent.buildNewCustomerVM();
		this.isEditing = true;
	}
	protected editCustomer(customerVM: CustomerVM) {
		this.editingCustomer = customerVM.buildPrototype();
		this.isEditing = true;
	}
	protected exitEditMode(selectedCustomer?: CustomerVM) {
		this.isEditing = false;
		if (!this._appContext.thUtils.isUndefinedOrNull(selectedCustomer, "customer")) {
			this._aopTableComponent.selectItem(selectedCustomer);
			this._aopTableComponent.updateTextSearchInput(selectedCustomer.customer.customerName);
			this.addSelectedCustomer(selectedCustomer);
		}
	}
	private addSelectedCustomer(customerVM: CustomerVM) {
		if (this._modalInput.multiSelection) {
			let foundCustomer = _.find(this._selectedCustomerList, (cust: CustomerDO) => {
				return cust.id === customerVM.customer.id;
			});
			if (this._appContext.thUtils.isUndefinedOrNull(foundCustomer)) {
				this._selectedCustomerList.push(customerVM.customer);
			}
		}
		else {
			this.didSelectCustomer(customerVM);
		}
	}
}