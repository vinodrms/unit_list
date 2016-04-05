import {Component, ViewChild, AfterViewInit} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import {BaseComponent} from '../../../../../../../common/base/BaseComponent';
import {AppContext} from '../../../../../../../common/utils/AppContext';
import {AddOnProductsService} from '../../../../../services/add-on-products/AddOnProductsService';
import {AddOnProductVM} from '../../../../../services/add-on-products/view-models/AddOnProductVM';
import {AddOnProductDO} from '../../../../../services/add-on-products/data-objects/AddOnProductDO';
import {LazyLoadingTableComponent} from '../../../../../../../common/utils/components/lazy-loading/LazyLoadingTableComponent';
import {AddOnProductTableMetaBuilderService} from './services/AddOnProductTableMetaBuilderService';
import {AddOnProductOverviewComponent} from '../pages/add-on-product-overview/AddOnProductOverviewComponent';
import {AddOnProductEditComponent} from '../pages/add-on-product-edit/AddOnProductEditComponent';
import {InventoryStateManager} from '../../utils/state-manager/InventoryStateManager';
import {InventoryScreenStateType} from '../../utils/state-manager/InventoryScreenStateType';
import {InventoryScreenAction} from '../../utils/state-manager/InventoryScreenAction';

@Component({
	selector: 'add-on-products',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/add-on-products/main/template/add-on-products.html',
	providers: [AddOnProductsService, AddOnProductTableMetaBuilderService],
	directives: [LazyLoadingTableComponent, AddOnProductOverviewComponent, AddOnProductEditComponent]
})
export class AddOnProductsComponent extends BaseComponent {
	@ViewChild(LazyLoadingTableComponent)
	private _aopTableComponent: LazyLoadingTableComponent<AddOnProductVM>;

	private _inventoryStateManager: InventoryStateManager<AddOnProductVM>;

	constructor(private _appContext: AppContext,
		private _tableBuilder: AddOnProductTableMetaBuilderService,
		private _addOnProductsService: AddOnProductsService) {
		super();
		this._inventoryStateManager = new InventoryStateManager<AddOnProductVM>(this._appContext, "addOnProduct.id");
	}

	public ngAfterViewInit() {
		this._aopTableComponent.bootstrap(this._addOnProductsService, this._tableBuilder.buildLazyLoadTableMeta());
	}

	public get isEditing(): boolean {
		return this._inventoryStateManager.screenStateType === InventoryScreenStateType.Edit;
	}
	public get selectedAddOnProductVM(): AddOnProductVM {
		return this._inventoryStateManager.currentItem;
	}

	public addAddOnProduct() {
		var newAddOnProductVM = this.buildNewAddOnProductVM();
		this._inventoryStateManager.canPerformAction(InventoryScreenAction.Add).then((newState: InventoryScreenStateType) => {
			this._inventoryStateManager.currentItem = newAddOnProductVM;
			this._inventoryStateManager.screenStateType = newState;
		}).catch((e: any) => { });
	}
	public copyAddOnProduct(addOnProductVM: AddOnProductVM) {
		var newAddOnProductVM = addOnProductVM.buildPrototype();
		delete newAddOnProductVM.addOnProduct.id;
		this._inventoryStateManager.canPerformAction(InventoryScreenAction.Copy, newAddOnProductVM).then((newState: InventoryScreenStateType) => {
			this._inventoryStateManager.currentItem = newAddOnProductVM;
			this._inventoryStateManager.screenStateType = newState;
		}).catch((e: any) => { });
	}
	public editAddOnProduct(addOnProductVM: AddOnProductVM) {
		var newAddOnProductVM = addOnProductVM.buildPrototype();
		this._inventoryStateManager.canPerformAction(InventoryScreenAction.Edit, newAddOnProductVM).then((newState: InventoryScreenStateType) => {
			this._inventoryStateManager.currentItem = newAddOnProductVM;
			this._inventoryStateManager.screenStateType = newState;
		}).catch((e: any) => { });
	}
	public deleteAddOnProduct(addOnProductVM: AddOnProductVM) {
		var newAddOnProductVM = addOnProductVM.buildPrototype();
		this._inventoryStateManager.canPerformAction(InventoryScreenAction.Delete, newAddOnProductVM).then((newState: InventoryScreenStateType) => {
			var title = this._appContext.thTranslation.translate("Delete Add-On Product");
			var content = this._appContext.thTranslation.translate("Are you sure you want to delete %name% ?", { name: addOnProductVM.addOnProduct.name });

			this._appContext.modalService.confirm(title, content, () => {
				if (newState === InventoryScreenStateType.View) {
					this._inventoryStateManager.currentItem = null;
				}
				this._inventoryStateManager.screenStateType = newState;
				// TODO: implement aop delete
			});
		}).catch((e: any) => { });
	}
	public selectAddOnProduct(addOnProductVM: AddOnProductVM) {
		var newAddOnProductVM = addOnProductVM.buildPrototype();
		this._inventoryStateManager.canPerformAction(InventoryScreenAction.Select, newAddOnProductVM).then((newState: InventoryScreenStateType) => {
			this._inventoryStateManager.currentItem = newAddOnProductVM;
			this._inventoryStateManager.screenStateType = newState;
		}).catch((e: any) => { });
	}

	public showViewScreen() {
		this._inventoryStateManager.currentItem = null;
		this._inventoryStateManager.screenStateType = InventoryScreenStateType.View;
	}

	private buildNewAddOnProductVM(): AddOnProductVM {
		var vm = new AddOnProductVM();
		vm.addOnProduct = new AddOnProductDO();
		return vm;
	}
}