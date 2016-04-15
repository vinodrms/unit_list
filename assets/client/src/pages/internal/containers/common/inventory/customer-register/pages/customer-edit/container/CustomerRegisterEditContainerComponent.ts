import {Component, Output, EventEmitter, Input} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {BaseComponent} from '../../../../../../../../../common/base/BaseComponent';
import {AppContext, ThError} from '../../../../../../../../../common/utils/AppContext';
import {LoadingComponent} from '../../../../../../../../../common/utils/components/LoadingComponent';
import {ModalDialogInstance} from '../../../../../../../../../common/utils/modals/utils/ModalDialogInstance';
import {PriceProductsModalService} from '../../../../price-products/modal/services/PriceProductsModalService';
import {TranslationPipe} from '../../../../../../../../../common/utils/localization/TranslationPipe';
import {CustomerVM} from '../../../../../../../services/customers/view-models/CustomerVM';
import {CustomerDO, CustomerType} from '../../../../../../../services/customers/data-objects/CustomerDO';
import {PriceProductStatus} from '../../../../../../../services/price-products/data-objects/PriceProductDO';
import {EagerPriceProductsService} from '../../../../../../../services/price-products/EagerPriceProductsService';
import {PriceProductsDO} from '../../../../../../../services/price-products/data-objects/PriceProductsDO';
import {PriceProductDO} from '../../../../../../../services/price-products/data-objects/PriceProductDO';
import {CustomerDetailsMeta} from '../../../../../../../services/customers/data-objects/customer-details/ICustomerDetailsDO';
import {CustomerDetailsFactory} from '../../../../../../../services/customers/data-objects/customer-details/CustomerDetailsFactory';

@Component({
	selector: 'customer-register-edit-container',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/customer-register/pages/customer-edit/container/template/customer-register-edit-container.html',
	providers: [EagerPriceProductsService, PriceProductsModalService],
	pipes: [TranslationPipe]
})

export class CustomerRegisterEditContainerComponent extends BaseComponent {
	isLoading: boolean = true;
	private _didInit: boolean = false;
	didSubmit: boolean = false;

	private _dependentDataSubscription: Subscription;

	@Output() onExit = new EventEmitter();
	public showViewScreen() {
		this.onExit.next(true);
	}

	private _customerVM: CustomerVM;
	public get customerVM(): CustomerVM {
		return this._customerVM;
	}
	@Input()
	public set customerVM(customerVM: CustomerVM) {
		this._customerVM = customerVM;
		this.initializeDependentData();
	}

	custDetailsMetaList: CustomerDetailsMeta[];

	constructor(private _eagerPriceProductsService: EagerPriceProductsService,
		private _priceProductsModalService: PriceProductsModalService) {
		super();
		this._didInit = true;
		var custDetailsFactory = new CustomerDetailsFactory();
		this.custDetailsMetaList = custDetailsFactory.getCustomerDetailsMetaList();
		this.initializeDependentData();
	}

	private initializeDependentData() {
		if (!this._didInit || !this._customerVM) {
			return;
		}
		this.isLoading = true;
		if (this._dependentDataSubscription) {
			this._dependentDataSubscription.unsubscribe();
		}
		this._dependentDataSubscription = Observable.combineLatest(
			this._eagerPriceProductsService.getPriceProducts(PriceProductStatus.Active, this._customerVM.customer.priceProductDetails.priceProductIdList)
		).subscribe((result: [PriceProductsDO]) => {
			this._customerVM.priceProductList = result[0].priceProductList;
			
			this.isLoading = false;
			this.didSubmit = false;
			this.customerVM.priceProductList
		});
	}

	public didChangeCustomerType(customerTypeStr: string) {
		var customerType: CustomerType = parseInt(customerTypeStr);
		// TODO: details dependent on customer type

	}

	public removePriceProduct(priceProductToRemove: PriceProductDO) {
		this._customerVM.priceProductList = _.filter(this._customerVM.priceProductList, (priceProduct: PriceProductDO) => { return priceProduct.id !== priceProductToRemove.id });
	}
	public openPriceProductSelectModal() {
		this._priceProductsModalService.openPriceProductsModal(PriceProductStatus.Active).then((modalDialogInstance: ModalDialogInstance<PriceProductDO>) => {
			modalDialogInstance.resultObservable.subscribe((selectedPriceProduct: PriceProductDO) => {
				this.addPriceProductIfNotExists(selectedPriceProduct);
			});
		}).catch((e: any) => { });
	}
	private addPriceProductIfNotExists(priceProduct: PriceProductDO) {
		var foundPriceProduct = _.find(this._customerVM.priceProductList, (existingPriceProduct: PriceProductDO) => { return existingPriceProduct.id === priceProduct.id });
		if (!foundPriceProduct) {
			this._customerVM.priceProductList.push(priceProduct);
		}
	}

	public get allowPublicPriceProducts(): boolean {
		return this.customerVM.customer.priceProductDetails.allowPublicPriceProducts;
	}
	public set allowPublicPriceProducts(allowPublicPriceProducts: boolean) {
		this.customerVM.customer.priceProductDetails.allowPublicPriceProducts = allowPublicPriceProducts;
	}

	public saveCustomer() {
		// TODO
	}
}