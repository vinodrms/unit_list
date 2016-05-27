import {Component, Input, Output, EventEmitter, ViewChild, AfterViewInit, DynamicComponentLoader, Type, ResolvedReflectiveProvider, ViewContainerRef} from '@angular/core';
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
export class CustomerRegisterComponent extends BaseComponent implements AfterViewInit {
	@Input() allowCustomerSelection: boolean = false;
    @Output() protected onScreenStateTypeChanged = new EventEmitter();
	@ViewChild('overviewBottom', { read: ViewContainerRef }) private _overviewBottomVCRef: ViewContainerRef;

	@ViewChild(LazyLoadingTableComponent)
	private _aopTableComponent: LazyLoadingTableComponent<CustomerVM>;

	@Output() protected onCustomerSelected = new EventEmitter<CustomerDO>();
	public triggerCustomerSelected() {
		if (!this.allowCustomerSelection) { return };
		if (this._appContext.thUtils.isUndefinedOrNull(this._inventoryStateManager.currentItem)) { return; }
		this.onCustomerSelected.next(this._inventoryStateManager.currentItem.customer);
	}

	@Output() protected onPageExit = new EventEmitter();
	public triggerPageExit() {
		this.onPageExit.next(true);
	}

	private _inventoryStateManager: InventoryStateManager<CustomerVM>;
	private _customerType: CustomerType;

    constructor(private _dynamicComponentLoader: DynamicComponentLoader,
        private _appContext: AppContext,
		private _customersService: CustomersService,
        private _tableBuilder: CustomerRegisterTableMetaBuilderService,
		private _custTableFilterService: CustomerTableFilterService) {
        super();
		this._inventoryStateManager = new InventoryStateManager<CustomerVM>(this._appContext, "customer.id");
		this.registerStateChange();
    }
    public bootstrapOverviewBottom(componentToInject: Type, providers: ResolvedReflectiveProvider[]) {
        this._dynamicComponentLoader.loadNextToLocation(componentToInject, this._overviewBottomVCRef, providers);
    }
	private registerStateChange() {
		this._inventoryStateManager.stateChangedObservable.subscribe((currentState: InventoryScreenStateType) => {
			this.onScreenStateTypeChanged.next(currentState);
		});
	}
	public ngAfterViewInit() {
		this._aopTableComponent.bootstrap(this._customersService, this._tableBuilder.buildLazyLoadTableMeta());
	}
	protected get isEditing(): boolean {
		return this._inventoryStateManager.screenStateType === InventoryScreenStateType.Edit;
	}
	protected get selectedCustomerVM(): CustomerVM {
		return this._inventoryStateManager.currentItem;
	}

	protected addCustomer() {
        var newCustomerVM = this.buildNewCustomerVM();
        this._inventoryStateManager.canPerformAction(InventoryScreenAction.Add).then((newState: InventoryScreenStateType) => {
            this._aopTableComponent.deselectItem();

            this._inventoryStateManager.currentItem = newCustomerVM;
            this._inventoryStateManager.screenStateType = newState;
        }).catch((e: any) => { });
    }
	protected editCustomer(customerVM: CustomerVM) {
        var newCustomerVM = customerVM.buildPrototype();
        this._inventoryStateManager.canPerformAction(InventoryScreenAction.Edit, newCustomerVM).then((newState: InventoryScreenStateType) => {
            this._aopTableComponent.selectItem(newCustomerVM);

            this._inventoryStateManager.currentItem = newCustomerVM;
            this._inventoryStateManager.screenStateType = newState;
        }).catch((e: any) => { });
    }
    protected selectCustomer(customerVM: CustomerVM) {
        var newCustomerVM = customerVM.buildPrototype();
        this._inventoryStateManager.canPerformAction(InventoryScreenAction.Select, newCustomerVM).then((newState: InventoryScreenStateType) => {
            this._aopTableComponent.selectItem(newCustomerVM);

            this._inventoryStateManager.currentItem = newCustomerVM;
            this._inventoryStateManager.screenStateType = newState;
        }).catch((e: any) => { });
    }

    protected showViewScreen(customerToSelect?: CustomerVM) {
        this._aopTableComponent.deselectItem();
        this._inventoryStateManager.currentItem = null;
        this._inventoryStateManager.screenStateType = InventoryScreenStateType.View;
		if (!this._appContext.thUtils.isUndefinedOrNull(customerToSelect, "customer") && this.allowCustomerSelection) {
			this._inventoryStateManager.currentItem = customerToSelect;
			this._aopTableComponent.selectItem(customerToSelect);
			this._aopTableComponent.updateTextSearchInput(customerToSelect.customer.customerName);
		}
    }
    protected buildNewCustomerVM(): CustomerVM {
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

	protected get filterList(): CustomerDetailsMeta[] {
		if (this.isEditing) {
			return [this._custTableFilterService.currentFilter];
		}
		return this._custTableFilterService.filterList;
	}
	protected isFilterSelected(filter: CustomerDetailsMeta): boolean {
		return this._custTableFilterService.isFilterSelected(filter);
	}
	protected selectFilter(filter: CustomerDetailsMeta) {
		return this._custTableFilterService.selectFilter(filter);
	}
}