import { Component, ViewChild, AfterViewInit, Input, Output, EventEmitter, Type, ResolvedReflectiveProvider, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import { BaseComponent } from '../../../../../../../common/base/BaseComponent';
import { TranslationPipe } from '../../../../../../../common/utils/localization/TranslationPipe';
import { AppContext, ThError } from '../../../../../../../common/utils/AppContext';
import { ModuleLoaderService } from '../../../../../../../common/utils/module-loader/ModuleLoaderService';
import { LazyLoadingTableComponent } from '../../../../../../../common/utils/components/lazy-loading/LazyLoadingTableComponent';
import { InventoryStateManager } from '../../utils/state-manager/InventoryStateManager';
import { InventoryScreenStateType } from '../../utils/state-manager/InventoryScreenStateType';
import { InventoryScreenAction } from '../../utils/state-manager/InventoryScreenAction';
import { RoomCategoriesService } from '../../../../../services/room-categories/RoomCategoriesService';
import { YieldFiltersService } from '../../../../../services/hotel-configurations/YieldFiltersService';
import { PriceProductsService } from '../../../../../services/price-products/PriceProductsService';
import { PriceProductVM } from '../../../../../services/price-products/view-models/PriceProductVM';
import { PriceProductDO, PriceProductStatus } from '../../../../../services/price-products/data-objects/PriceProductDO';
import { PriceProductIncludedItemsDO } from '../../../../../services/price-products/data-objects/included-items/PriceProductIncludedItemsDO';
import { PriceProductTableMetaBuilderService } from './services/PriceProductTableMetaBuilderService';

@Component({
	selector: 'price-products',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/price-products/main/template/price-products.html',
	providers: [RoomCategoriesService, YieldFiltersService, PriceProductsService, PriceProductTableMetaBuilderService]
})
export class PriceProductsComponent extends BaseComponent implements AfterViewInit {
	@Output() protected onScreenStateTypeChanged = new EventEmitter();
	@Output() protected onItemDeleted = new EventEmitter();
	@ViewChild('overviewBottom', { read: ViewContainerRef }) private _overviewBottomVCRef: ViewContainerRef;

	@ViewChild(LazyLoadingTableComponent)
	private _aopTableComponent: LazyLoadingTableComponent<PriceProductVM>;

	private _inventoryStateManager: InventoryStateManager<PriceProductVM>;
	private _priceProductStatus: PriceProductStatus;

	constructor(private _appContext: AppContext,
		private _moduleLoaderService: ModuleLoaderService,
		private _priceProductsService: PriceProductsService,
		private _tableBuilder: PriceProductTableMetaBuilderService) {
		super();
		this._inventoryStateManager = new InventoryStateManager<PriceProductVM>(this._appContext, "priceProduct.id");
		this.registerStateChange();
		this.setDefaultPriceProductStatus();
	}
	public bootstrapOverviewBottom(moduleToInject: Type<any>, componentToInject: Type<any>, providers: ResolvedReflectiveProvider[]) {
		this._moduleLoaderService.loadNextToLocation(moduleToInject, componentToInject, this._overviewBottomVCRef, providers);
	}
	private registerStateChange() {
		this._inventoryStateManager.stateChangedObservable.subscribe((currentState: InventoryScreenStateType) => {
			this.onScreenStateTypeChanged.next(currentState);
		});
	}
	private registerItemDeletion(deletedPP: PriceProductDO) {
		this.onItemDeleted.next(deletedPP);
	}
	private setDefaultPriceProductStatus() {
		this._priceProductStatus = PriceProductStatus.Active;
		this._priceProductsService.setStatusFilter(this.priceProductStatus);
	}

	public ngAfterViewInit() {
		this._aopTableComponent.bootstrap(this._priceProductsService, this._tableBuilder.buildLazyLoadTableMeta());
	}

	protected get isEditing(): boolean {
		return this._inventoryStateManager.screenStateType === InventoryScreenStateType.Edit;
	}
	protected get selectedPriceProductVM(): PriceProductVM {
		return this._inventoryStateManager.currentItem;
	}

	protected viewActivePriceProducts() {
		this.priceProductStatus = PriceProductStatus.Active;
	}
	protected areActivePriceProducts(): boolean {
		return this.priceProductStatus === PriceProductStatus.Active;
	}
	protected viewDraftPriceProducts() {
		this.priceProductStatus = PriceProductStatus.Draft;
	}
	protected areDraftPriceProducts(): boolean {
		return this.priceProductStatus === PriceProductStatus.Draft;
	}
	protected viewArchivedPriceProducts() {
		this.priceProductStatus = PriceProductStatus.Archived;
	}
	protected areArchivedPriceProducts(): boolean {
		return this.priceProductStatus === PriceProductStatus.Archived;
	}

	protected addPriceProduct() {
		var newPriceProductVM = this.buildNewPriceProductVM();
		this._inventoryStateManager.canPerformAction(InventoryScreenAction.Add).then((newState: InventoryScreenStateType) => {
			this._aopTableComponent.deselectItem();

			this._inventoryStateManager.currentItem = newPriceProductVM;
			this._inventoryStateManager.screenStateType = newState;
		}).catch((e: any) => { });
	}
	protected copyPriceProduct(priceProductVM: PriceProductVM, parentId?: string) {
		var newPriceProductVM = priceProductVM.buildPrototype();
		delete newPriceProductVM.priceProduct.id;
		if (!this._appContext.thUtils.isUndefinedOrNull(parentId)) {
			newPriceProductVM.priceProduct.parentId = parentId;
		}
		newPriceProductVM.priceProduct.name = "";
		newPriceProductVM.priceProduct.status = PriceProductStatus.Draft;
		this._inventoryStateManager.canPerformAction(InventoryScreenAction.Copy, newPriceProductVM).then((newState: InventoryScreenStateType) => {
			this._aopTableComponent.deselectItem();

			this._inventoryStateManager.currentItem = newPriceProductVM;
			this._inventoryStateManager.screenStateType = newState;
		}).catch((e: any) => { });
	}
	protected editPriceProduct(priceProductVM: PriceProductVM) {
		var newPriceProductVM = priceProductVM.buildPrototype();
		this._inventoryStateManager.canPerformAction(InventoryScreenAction.Edit, newPriceProductVM).then((newState: InventoryScreenStateType) => {
			this._aopTableComponent.selectItem(newPriceProductVM);

			this._inventoryStateManager.currentItem = newPriceProductVM;
			this._inventoryStateManager.screenStateType = newState;
		}).catch((e: any) => { });
	}
	protected deletePriceProduct(priceProductVM: PriceProductVM) {
		var title = this._appContext.thTranslation.translate("Delete Price Product");
		var content = this._appContext.thTranslation.translate("Are you sure you want to delete %name% ?", { name: priceProductVM.priceProduct.name });
		this.confirmAction(priceProductVM, title, content, (priceProductDO: PriceProductDO) => {
			this._priceProductsService.deletePriceProductDO(priceProductDO).subscribe((deletedAddOnProduct: PriceProductDO) => {
				this.registerItemDeletion(priceProductDO);
			}, (error: ThError) => {
				this._appContext.toaster.error(error.message);
			});
		});
	}
	protected archivePriceProduct(priceProductVM: PriceProductVM) {
		var title = this._appContext.thTranslation.translate("Archive Price Product");
		var content = this._appContext.thTranslation.translate("Are you sure you want to archive %name% ?", { name: priceProductVM.priceProduct.name });
		this.confirmAction(priceProductVM, title, content, (priceProductDO: PriceProductDO) => {
			this._priceProductsService.archivePriceProductDO(priceProductDO).subscribe((deletedAddOnProduct: PriceProductDO) => {
			}, (error: ThError) => {
				this._appContext.toaster.error(error.message);
			});
		});
	}
	protected draftPriceProduct(priceProductVM: PriceProductVM) {
		var title = this._appContext.thTranslation.translate("Draft Price Product");
		var content = this._appContext.thTranslation.translate("Are you sure you want to mark %name% as draft ?", { name: priceProductVM.priceProduct.name });
		this.confirmAction(priceProductVM, title, content, (priceProductDO: PriceProductDO) => {
			this._priceProductsService.draftPriceProductDO(priceProductDO).subscribe((deletedAddOnProduct: PriceProductDO) => {
			}, (error: ThError) => {
				this._appContext.toaster.error(error.message);
			});
		});
	}
	protected createRelatedPriceProduct(priceProductVM: PriceProductVM) {
		var title = this._appContext.thTranslation.translate("Create Related Price Product");
		var content = this._appContext.thTranslation.translate("A related Price Product will have the same room categories and prices like the original Price Product - %priceProduct% in this case. Are you sure you want to continue?", { priceProduct: priceProductVM.priceProduct.name });
		this.confirmAction(priceProductVM, title, content, (priceProductDO: PriceProductDO) => {
			this.copyPriceProduct(priceProductVM, priceProductVM.priceProduct.id);
		});
	}
	protected confirmAction(priceProductVM: PriceProductVM, confirmationTitle, confirmationContent, onConfirm: { (priceProductDO: PriceProductDO): void }) {
		var newPriceProductVM = priceProductVM.buildPrototype();
		this._inventoryStateManager.canPerformAction(InventoryScreenAction.Delete, newPriceProductVM).then((newState: InventoryScreenStateType) => {
			var positiveLabel = this._appContext.thTranslation.translate("Yes");
			var negativeLabel = this._appContext.thTranslation.translate("No");

			this._appContext.modalService.confirm(confirmationTitle, confirmationContent, { positive: positiveLabel, negative: negativeLabel }, () => {
				if (newState === InventoryScreenStateType.View) {
					this._aopTableComponent.deselectItem();
					this._inventoryStateManager.currentItem = null;
				}
				this._inventoryStateManager.screenStateType = newState;
				onConfirm(newPriceProductVM.priceProduct);
			});
		}).catch((e: any) => { });
	}

	protected selectPriceProduct(priceProductVM: PriceProductVM) {
		var newPriceProductVM = priceProductVM.buildPrototype();
		this._inventoryStateManager.canPerformAction(InventoryScreenAction.Select, newPriceProductVM).then((newState: InventoryScreenStateType) => {
			this._aopTableComponent.selectItem(newPriceProductVM);

			this._inventoryStateManager.currentItem = newPriceProductVM;
			this._inventoryStateManager.screenStateType = newState;
		}).catch((e: any) => { });
	}

	protected showViewScreen() {
		this._aopTableComponent.deselectItem();
		this._inventoryStateManager.currentItem = null;
		this._inventoryStateManager.screenStateType = InventoryScreenStateType.View;
	}
	private buildNewPriceProductVM(): PriceProductVM {
		var vm = new PriceProductVM(this._appContext.thTranslation);
		vm.priceProduct = new PriceProductDO();
		vm.priceProduct.status = PriceProductStatus.Draft;
		vm.priceProduct.includedItems = new PriceProductIncludedItemsDO();
		vm.priceProduct.includedItems.attachedAddOnProductItemList = [];
		return vm;
	}

	protected get priceProductStatus(): PriceProductStatus {
		return this._priceProductStatus;
	}
	protected set priceProductStatus(priceProductStatus: PriceProductStatus) {
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