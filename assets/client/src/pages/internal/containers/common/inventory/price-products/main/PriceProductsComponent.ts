import {Component, ViewChild, AfterViewInit, Input, Output, EventEmitter} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import {BaseComponent} from '../../../../../../../common/base/BaseComponent';
import {AppContext, ThError} from '../../../../../../../common/utils/AppContext';
import {LazyLoadingTableComponent} from '../../../../../../../common/utils/components/lazy-loading/LazyLoadingTableComponent';
import {InventoryStateManager} from '../../utils/state-manager/InventoryStateManager';
import {InventoryScreenStateType} from '../../utils/state-manager/InventoryScreenStateType';
import {InventoryScreenAction} from '../../utils/state-manager/InventoryScreenAction';
import {RoomCategoriesService} from '../../../../../services/room-categories/RoomCategoriesService';
import {YieldFiltersService} from '../../../../../services/hotel-configurations/YieldFiltersService';
import {PriceProductsService} from '../../../../../services/price-products/PriceProductsService';
import {PriceProductVM} from '../../../../../services/price-products/view-models/PriceProductVM';
import {PriceProductDO, PriceProductStatus} from '../../../../../services/price-products/data-objects/PriceProductDO';
import {PriceProductTableMetaBuilderService} from './services/PriceProductTableMetaBuilderService';
import {PriceProductOverviewComponent} from '../pages/price-product-overview/PriceProductOverviewComponent';

@Component({
	selector: 'price-products',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/price-products/main/template/price-products.html',
	providers: [RoomCategoriesService, YieldFiltersService, PriceProductsService, PriceProductTableMetaBuilderService],
	directives: [LazyLoadingTableComponent, PriceProductOverviewComponent]
})
export class PriceProductsComponent extends BaseComponent implements AfterViewInit {
	@Output() protected onScreenStateTypeChanged = new EventEmitter();

	@ViewChild(LazyLoadingTableComponent)
	private _aopTableComponent: LazyLoadingTableComponent<PriceProductVM>;

	private _inventoryStateManager: InventoryStateManager<PriceProductVM>;
	private _priceProductStatus: PriceProductStatus;

	constructor(private _appContext: AppContext,
		private _priceProductsService: PriceProductsService,
		private _tableBuilder: PriceProductTableMetaBuilderService) {
		super();
		this._inventoryStateManager = new InventoryStateManager<PriceProductVM>(this._appContext, "priceProduct.id");
		this.registerStateChange();
		this.setDefaultPriceProductStatus();
	}
	private registerStateChange() {
		this._inventoryStateManager.stateChangedObservable.subscribe((currentState: InventoryScreenStateType) => {
			this.onScreenStateTypeChanged.next(currentState);
		});
	}
	private setDefaultPriceProductStatus() {
		this._priceProductStatus = PriceProductStatus.Active;
		this._priceProductsService.setStatusFilter(this.priceProductStatus);
	}

	public ngAfterViewInit() {
		this._aopTableComponent.bootstrap(this._priceProductsService, this._tableBuilder.buildLazyLoadTableMeta());
	}

	public get isEditing(): boolean {
		return this._inventoryStateManager.screenStateType === InventoryScreenStateType.Edit;
	}
	public get selectedPriceProductVM(): PriceProductVM {
		return this._inventoryStateManager.currentItem;
	}

	public viewActivePriceProducts() {
		this.priceProductStatus = PriceProductStatus.Active;
	}
	public areActivePriceProducts(): boolean {
		return this.priceProductStatus === PriceProductStatus.Active;
	}
	public viewDraftPriceProducts() {
		this.priceProductStatus = PriceProductStatus.Draft;
	}
	public areDraftPriceProducts(): boolean {
		return this.priceProductStatus === PriceProductStatus.Draft;
	}
	public viewArchivedPriceProducts() {
		this.priceProductStatus = PriceProductStatus.Archived;
	}
	public areArchivedPriceProducts(): boolean {
		return this.priceProductStatus === PriceProductStatus.Archived;
	}

	/*
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
            this._aopTableComponent.selectItem(newAddOnProductVM.addOnProduct.id);

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
        }, (error: ThError) => {
            this._appContext.toaster.error(error.message);
        });
    }
	*/
    public selectPriceProduct(priceProductVM: PriceProductVM) {
        var newPriceProductVM = priceProductVM.buildPrototype();
        this._inventoryStateManager.canPerformAction(InventoryScreenAction.Select, newPriceProductVM).then((newState: InventoryScreenStateType) => {
            this._aopTableComponent.selectItem(newPriceProductVM.priceProduct.id);

            this._inventoryStateManager.currentItem = newPriceProductVM;
            this._inventoryStateManager.screenStateType = newState;
        }).catch((e: any) => { });
    }

    public showViewScreen() {
        this._aopTableComponent.deselectItem();
        this._inventoryStateManager.currentItem = null;
        this._inventoryStateManager.screenStateType = InventoryScreenStateType.View;
    }
    private buildNewPriceProductVM(): PriceProductVM {
        var vm = new PriceProductVM(this._appContext.thTranslation);
        vm.priceProduct = new PriceProductDO();
        return vm;
    }

	public get priceProductStatus(): PriceProductStatus {
		return this._priceProductStatus;
	}
	public set priceProductStatus(priceProductStatus: PriceProductStatus) {
		if (priceProductStatus === this._priceProductStatus) {
			return;
		}
		this._priceProductStatus = priceProductStatus;
		this.updatePageData();
	}
	private updatePageData() {
		this._priceProductsService.setStatusFilter(this._priceProductStatus);
		this._priceProductsService.refreshData();
	}
}