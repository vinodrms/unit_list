import {Component, ViewChild, AfterViewInit} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import {BaseComponent} from '../../../../../../../common/base/BaseComponent';
import {AppContext} from '../../../../../../../common/utils/AppContext';
import {AddOnProductsService} from '../../../../../services/add-on-products/AddOnProductsService';
import {AddOnProductVM} from '../../../../../services/add-on-products/view-models/AddOnProductVM';
import {LazyLoadingTableComponent} from '../../../../../../../common/utils/components/lazy-loading/LazyLoadingTableComponent';
import {AddOnProductTableMetaBuilderService} from './services/AddOnProductTableMetaBuilderService';

@Component({
	selector: 'add-on-products',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/add-on-products/main/template/add-on-products.html',
	providers: [AddOnProductsService, AddOnProductTableMetaBuilderService],
	directives: [LazyLoadingTableComponent]
})

export class AddOnProductsComponent extends BaseComponent {
	isCollapsed = false;

	@ViewChild(LazyLoadingTableComponent)
	private _aopTableComponent: LazyLoadingTableComponent<AddOnProductVM>;

	constructor(private _appContext: AppContext,
		private _tableBuilder: AddOnProductTableMetaBuilderService,
		private _addOnProductsService: AddOnProductsService) {
		super();
	}
	ngAfterViewInit() {
		this._aopTableComponent.bootstrap(this._addOnProductsService, this._tableBuilder.buildLazyLoadTableMeta());
	}
	
	//TODO: implement all the underneath functions
	
	public addAddOnProduct() {
		console.log('addAddOnProduct');
	}
	public copyAddOnProduct(addOnProductVM: AddOnProductVM) {
		console.log('copy');
		console.log(addOnProductVM);
	}
	public deleteAddOnProduct(addOnProductVM: AddOnProductVM) {
		console.log('delete');
		console.log(addOnProductVM);
	}
	public editAddOnProduct(addOnProductVM: AddOnProductVM) {
		console.log('edit');
		console.log(addOnProductVM);
	}
	public selectAddOnProduct(addOnProductVM: AddOnProductVM) {
		console.log('select');
		console.log(addOnProductVM);
	}
	
}