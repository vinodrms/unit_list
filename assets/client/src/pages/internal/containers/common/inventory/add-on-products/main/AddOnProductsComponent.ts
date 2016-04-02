import {Component, OnInit} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import {BaseComponent} from '../../../../../../../common/base/BaseComponent';
import {ThError, AppContext} from '../../../../../../../common/utils/AppContext';
import {AddOnProductCategoriesService} from '../../../../../services/settings/AddOnProductCategoriesService';
import {AddOnProductCategoriesDO} from '../../../../../services/settings/data-objects/AddOnProductCategoriesDO';
import {AddOnProductsService} from '../../../../../services/add-on-products/AddOnProductsService';
import {AddOnProductVM} from '../../../../../services/add-on-products/view-models/AddOnProductVM';
import {LazyLoadData} from '../../../../../services/common/ALazyLoadRequestService';

@Component({
	selector: 'add-on-products',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/add-on-products/main/template/add-on-products.html',
	providers: [AddOnProductsService]
})

export class AddOnProductsComponent extends BaseComponent implements OnInit {
	isLoading: boolean = true;
	addOnProductCategories: AddOnProductCategoriesDO;
	addOnProductList: AddOnProductVM[];

	constructor(private _appContext: AppContext,
		private _addOnProductCategoriesService: AddOnProductCategoriesService,
		private _addOnProductsService: AddOnProductsService) {
		super();
	}

	ngOnInit() {
		this.isLoading = true;
		Observable.combineLatest(
			this._addOnProductCategoriesService.getAddOnProductCategoriesDO(),
			this._addOnProductsService.getDataObservable()
		).subscribe((result: [AddOnProductCategoriesDO, LazyLoadData<AddOnProductVM[]>]) => {
			this.addOnProductCategories = result[0];
			
			// TODO
			console.log(this.addOnProductCategories);
			console.log(result[1]);

			this.isLoading = false;
		}, (error: ThError) => {
			this.isLoading = false;
			this._appContext.toaster.error(this._appContext.thTranslation.translate(error.message));
		});
	}
}