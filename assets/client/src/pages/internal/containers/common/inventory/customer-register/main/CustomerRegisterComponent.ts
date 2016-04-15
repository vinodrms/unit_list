import {Component, Output, EventEmitter, ViewChild} from 'angular2/core';
import {BaseComponent} from '../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../common/utils/localization/TranslationPipe';
import {AppContext, ThError} from '../../../../../../../common/utils/AppContext';
import {LazyLoadingTableComponent} from '../../../../../../../common/utils/components/lazy-loading/LazyLoadingTableComponent';
import {CustomerRegisterTableMetaBuilderService} from './services/CustomerRegisterTableMetaBuilderService';
import {InventoryStateManager} from '../../utils/state-manager/InventoryStateManager';
import {InventoryScreenStateType} from '../../utils/state-manager/InventoryScreenStateType';
import {InventoryScreenAction} from '../../utils/state-manager/InventoryScreenAction';
import {CustomerTableFilterService} from './services/CustomerTableFilterService';
import {CustomersService} from '../../../../../services/customers/CustomersService';
import {CustomerVM} from '../../../../../services/customers/view-models/CustomerVM';
import {CustomerDO, CustomerType} from '../../../../../services/customers/data-objects/CustomerDO';
import {CustomerPriceProductDetailsDO} from '../../../../../services/customers/data-objects/price-product-details/CustomerPriceProductDetailsDO';
import {CustomerDetailsFactory} from '../../../../../services/customers/data-objects/customer-details/CustomerDetailsFactory';
import {CustomerDetailsMeta} from '../../../../../services/customers/data-objects/customer-details/ICustomerDetailsDO';
import {CustomerRegisterOverviewComponent} from '../pages/customer-overview/CustomerRegisterOverviewComponent';
import {CustomerRegisterEditContainerComponent} from '../pages/customer-edit/container/CustomerRegisterEditContainerComponent';

@Component({
    selector: 'customer-register',
    templateUrl: '/client/src/pages/internal/containers/common/inventory/customer-register/main/template/customer-register.html',
    providers: [CustomersService, CustomerRegisterTableMetaBuilderService, CustomerTableFilterService],
    directives: [LazyLoadingTableComponent, CustomerRegisterOverviewComponent, CustomerRegisterEditContainerComponent],
	pipes: [TranslationPipe]
})
export class CustomerRegisterComponent extends BaseComponent {
    @Output() protected onScreenStateTypeChanged = new EventEmitter();

	@ViewChild(LazyLoadingTableComponent)
	private _aopTableComponent: LazyLoadingTableComponent<CustomerVM>;

	private _inventoryStateManager: InventoryStateManager<CustomerVM>;
	private _customerType: CustomerType;

    constructor(private _appContext: AppContext,
		private _customersService: CustomersService,
        private _tableBuilder: CustomerRegisterTableMetaBuilderService,
		private _custTableFilterService: CustomerTableFilterService) {
        super();
		this._inventoryStateManager = new InventoryStateManager<CustomerVM>(this._appContext, "customer.id");
		this.registerStateChange();
    }
	private registerStateChange() {
		this._inventoryStateManager.stateChangedObservable.subscribe((currentState: InventoryScreenStateType) => {
			this.onScreenStateTypeChanged.next(currentState);
		});
	}
	public ngAfterViewInit() {
		this._aopTableComponent.bootstrap(this._customersService, this._tableBuilder.buildLazyLoadTableMeta());
	}
	public get isEditing(): boolean {
		return this._inventoryStateManager.screenStateType === InventoryScreenStateType.Edit;
	}
	public get selectedCustomerVM(): CustomerVM {
		return this._inventoryStateManager.currentItem;
	}

	public addCustomer() {
        var newCustomerVM = this.buildNewCustomerVM();
        this._inventoryStateManager.canPerformAction(InventoryScreenAction.Add).then((newState: InventoryScreenStateType) => {
            this._aopTableComponent.deselectItem();

            this._inventoryStateManager.currentItem = newCustomerVM;
            this._inventoryStateManager.screenStateType = newState;
        }).catch((e: any) => { });
    }
	public editCustomer(customerVM: CustomerVM) {
        var newCustomerVM = customerVM.buildPrototype();
        this._inventoryStateManager.canPerformAction(InventoryScreenAction.Edit, newCustomerVM).then((newState: InventoryScreenStateType) => {
            this._aopTableComponent.selectItem(newCustomerVM.customer.id);

            this._inventoryStateManager.currentItem = newCustomerVM;
            this._inventoryStateManager.screenStateType = newState;
        }).catch((e: any) => { });
    }
    public selectCustomer(customerVM: CustomerVM) {
        var newCustomerVM = customerVM.buildPrototype();
        this._inventoryStateManager.canPerformAction(InventoryScreenAction.Select, newCustomerVM).then((newState: InventoryScreenStateType) => {
            this._aopTableComponent.selectItem(newCustomerVM.customer.id);

            this._inventoryStateManager.currentItem = newCustomerVM;
            this._inventoryStateManager.screenStateType = newState;
        }).catch((e: any) => { });
    }

    public showViewScreen() {
        this._aopTableComponent.deselectItem();
        this._inventoryStateManager.currentItem = null;
        this._inventoryStateManager.screenStateType = InventoryScreenStateType.View;
    }
    private buildNewCustomerVM(): CustomerVM {
        var vm = new CustomerVM();
		vm.customer = new CustomerDO();

		var custDetailsFactory = new CustomerDetailsFactory();
		vm.customer.type = custDetailsFactory.getDefaultCustomerType();
		vm.customer.customerDetails = custDetailsFactory.getCustomerDetailsByType(vm.customer.type);
		vm.customer.fileAttachmentList = [];
		vm.customer.priceProductDetails = new CustomerPriceProductDetailsDO();
		vm.customer.priceProductDetails.allowPublicPriceProducts = true;
		vm.customer.priceProductDetails.priceProductIdList = [];
        return vm;
    }

	public get filterList(): CustomerDetailsMeta[] {
		if(this.isEditing) {
			return [this._custTableFilterService.currentFilter];
		}
		return this._custTableFilterService.filterList;
	}
	public isFilterSelected(filter: CustomerDetailsMeta): boolean {
		return this._custTableFilterService.isFilterSelected(filter);
	}
	public selectFilter(filter: CustomerDetailsMeta) {
		return this._custTableFilterService.selectFilter(filter);
	}
}