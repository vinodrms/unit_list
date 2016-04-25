import {Component, ViewChild, AfterViewInit, Input, Output, EventEmitter} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import {BaseComponent} from '../../../../../../../common/base/BaseComponent';
import {AppContext, ThError} from '../../../../../../../common/utils/AppContext';
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
import {AddOnProductCategoriesService} from '../../../../../services/settings/AddOnProductCategoriesService';
import {AddOnProductCategoriesDO} from '../../../../../services/settings/data-objects/AddOnProductCategoriesDO';
import {AddOnProductCategoryDO} from '../../../../../services/common/data-objects/add-on-product/AddOnProductCategoryDO';

//TODO: change this code to use Decorator
import {WizardStepsComponent} from '../../../../wizard/pages/utils/wizard-steps/WizardStepsComponent';

@Component({
    selector: 'add-on-products',
    templateUrl: '/client/src/pages/internal/containers/common/inventory/add-on-products/main/template/add-on-products.html',
    providers: [AddOnProductsService, AddOnProductTableMetaBuilderService],
    directives: [WizardStepsComponent, LazyLoadingTableComponent, AddOnProductOverviewComponent, AddOnProductEditComponent]
})
export class AddOnProductsComponent extends BaseComponent {
    @Input() protected filterBreakfastCategory: boolean = false;
    filteredCategory: AddOnProductCategoryDO;

    @Output() protected onScreenStateTypeChanged = new EventEmitter();
    @Output() protected onItemDeleted = new EventEmitter();
    
    @ViewChild(LazyLoadingTableComponent)
    private _aopTableComponent: LazyLoadingTableComponent<AddOnProductVM>;

    private _inventoryStateManager: InventoryStateManager<AddOnProductVM>;

    constructor(private _appContext: AppContext,
        private _tableBuilder: AddOnProductTableMetaBuilderService,
        private _addOnProductCategoriesService: AddOnProductCategoriesService,
        private _addOnProductsService: AddOnProductsService) {
        super();
        this._inventoryStateManager = new InventoryStateManager<AddOnProductVM>(this._appContext, "addOnProduct.id");
        this.registerStateChange();
    }
    private registerStateChange() {
        this._inventoryStateManager.stateChangedObservable.subscribe((currentState: InventoryScreenStateType) => {
            this.onScreenStateTypeChanged.next(currentState);
        });
    }
    private registerItemDeletion(deletedAddOnProduct:AddOnProductDO) {
        this.onItemDeleted.next(deletedAddOnProduct);
    }
    
    public ngAfterViewInit() {
        if (!this.filterBreakfastCategory) {
            this.bootstrapTableComponent();
            return;
        }
        this._addOnProductCategoriesService.getAddOnProductCategoriesDO().subscribe((addOnProductCategoriesDO: AddOnProductCategoriesDO) => {
            var breakfastCategory: AddOnProductCategoryDO = addOnProductCategoriesDO.getBreakfastCategory();
            if (breakfastCategory && breakfastCategory.id) {
                this.filteredCategory = breakfastCategory;
                this._addOnProductsService.setDefaultCategory(breakfastCategory);
            }
            this.bootstrapTableComponent();
        });
    }
    private bootstrapTableComponent() {
        this._aopTableComponent.bootstrap(this._addOnProductsService, this._tableBuilder.buildLazyLoadTableMeta(this.filterBreakfastCategory));
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
            this._aopTableComponent.deselectItem();

            this._inventoryStateManager.currentItem = newAddOnProductVM;
            this._inventoryStateManager.screenStateType = newState;
        }).catch((e: any) => { });
    }
    public copyAddOnProduct(addOnProductVM: AddOnProductVM) {
        var newAddOnProductVM = addOnProductVM.buildPrototype();
        delete newAddOnProductVM.addOnProduct.id;
        this._inventoryStateManager.canPerformAction(InventoryScreenAction.Copy, newAddOnProductVM).then((newState: InventoryScreenStateType) => {
            this._aopTableComponent.deselectItem();

            this._inventoryStateManager.currentItem = newAddOnProductVM;
            this._inventoryStateManager.screenStateType = newState;
        }).catch((e: any) => { });
    }
    public editAddOnProduct(addOnProductVM: AddOnProductVM) {
        var newAddOnProductVM = addOnProductVM.buildPrototype();
        this._inventoryStateManager.canPerformAction(InventoryScreenAction.Edit, newAddOnProductVM).then((newState: InventoryScreenStateType) => {
            this._aopTableComponent.selectItem(newAddOnProductVM);

            this._inventoryStateManager.currentItem = newAddOnProductVM;
            this._inventoryStateManager.screenStateType = newState;
        }).catch((e: any) => { });
    }
    public deleteAddOnProduct(addOnProductVM: AddOnProductVM) {
        var newAddOnProductVM = addOnProductVM.buildPrototype();
        this._inventoryStateManager.canPerformAction(InventoryScreenAction.Delete, newAddOnProductVM).then((newState: InventoryScreenStateType) => {
            var title = this._appContext.thTranslation.translate("Delete Add-On Product");
            var content = this._appContext.thTranslation.translate("Are you sure you want to delete %name% ?", { name: addOnProductVM.addOnProduct.name });
            var positiveLabel = this._appContext.thTranslation.translate("Yes");
            var negativeLabel = this._appContext.thTranslation.translate("No");

            this._appContext.modalService.confirm(title, content, { positive: positiveLabel, negative: negativeLabel }, () => {
                if (newState === InventoryScreenStateType.View) {
                    this._aopTableComponent.deselectItem();
                    this._inventoryStateManager.currentItem = null;
                }
                this._inventoryStateManager.screenStateType = newState;
                this.deleteAddOnProductOnServer(newAddOnProductVM.addOnProduct);
            });
        }).catch((e: any) => { });
    }
    private deleteAddOnProductOnServer(addOnProductDO: AddOnProductDO) {
        this._addOnProductsService.deleteAddOnProductDO(addOnProductDO).subscribe((deletedAddOnProduct: AddOnProductDO) => {
            this.registerItemDeletion(addOnProductDO);
        }, (error: ThError) => {
            this._appContext.toaster.error(error.message);
        });
    }

    public selectAddOnProduct(addOnProductVM: AddOnProductVM) {
        var newAddOnProductVM = addOnProductVM.buildPrototype();
        this._inventoryStateManager.canPerformAction(InventoryScreenAction.Select, newAddOnProductVM).then((newState: InventoryScreenStateType) => {
            this._aopTableComponent.selectItem(newAddOnProductVM);

            this._inventoryStateManager.currentItem = newAddOnProductVM;
            this._inventoryStateManager.screenStateType = newState;
        }).catch((e: any) => { });
    }

    public showViewScreen() {
        this._aopTableComponent.deselectItem();

        this._inventoryStateManager.currentItem = null;
        this._inventoryStateManager.screenStateType = InventoryScreenStateType.View;
    }

    private buildNewAddOnProductVM(): AddOnProductVM {
        var vm = new AddOnProductVM();
        vm.addOnProduct = new AddOnProductDO();
        return vm;
    }
}