import {Component, Output, EventEmitter, Input, ViewChild, AfterViewInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {BaseComponent} from '../../../../../../../../../common/base/BaseComponent';
import {AppContext, ThError} from '../../../../../../../../../common/utils/AppContext';
import {LoadingComponent} from '../../../../../../../../../common/utils/components/LoadingComponent';
import {ModalDialogRef} from '../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
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
import {FileAttachmentsComponent} from '../../../../../../../../../common/utils/components/file-attachments/FileAttachmentsComponent';
import {FileAttachmentDO} from '../../../../../../../services/common/data-objects/file/FileAttachmentDO';
import {CorporateCustomerDetailsComponent} from '../customer-details/corporate/CorporateCustomerDetailsComponent';
import {IndividualCustomerDetailsComponent} from '../customer-details/individual/IndividualCustomerDetailsComponent';
import {CustomerDetailsContainer} from './utils/CustomerDetailsContainer';
import {CorporateDetailsDO} from '../../../../../../../services/customers/data-objects/customer-details/CorporateDetailsDO';
import {IndividualDetailsDO} from '../../../../../../../services/customers/data-objects/customer-details/IndividualDetailsDO';
import {CountriesService} from '../../../../../../../services/settings/CountriesService';
import {CountriesDO} from '../../../../../../../services/settings/data-objects/CountriesDO';
import {CustomersService} from '../../../../../../../services/customers/CustomersService';
import {HotelAggregatorService} from '../../../../../../../services/hotel/HotelAggregatorService';
import {HotelAggregatedInfo} from '../../../../../../../services/hotel/utils/HotelAggregatedInfo';
import {CustomScroll} from '../../../../../../../../../common/utils/directives/CustomScroll';
import {EagerAllotmentsService} from '../../../../../../../services/allotments/EagerAllotmentsService';
import {AllotmentStatus, AllotmentDO} from '../../../../../../../services/allotments/data-objects/AllotmentDO';
import {AllotmentsDO} from '../../../../../../../services/allotments/data-objects/AllotmentsDO';

@Component({
	selector: 'customer-register-edit-container',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/customer-register/pages/customer-edit/container/template/customer-register-edit-container.html',
	providers: [EagerPriceProductsService, PriceProductsModalService, EagerAllotmentsService],
	directives: [CustomScroll, FileAttachmentsComponent, CorporateCustomerDetailsComponent, IndividualCustomerDetailsComponent],
	pipes: [TranslationPipe]
})

export class CustomerRegisterEditContainerComponent extends BaseComponent implements AfterViewInit {
	@ViewChild(CorporateCustomerDetailsComponent) private _corporateCustomerDetailsComponent: CorporateCustomerDetailsComponent;
	@ViewChild(IndividualCustomerDetailsComponent) private _individualCustDetailsComponent: IndividualCustomerDetailsComponent;

	isSavingCustomer: boolean = false;
	isLoading: boolean = true;
	private _didInit: boolean = false;
	didSubmit: boolean = false;

	private _dependentDataSubscription: Subscription;
	customerDetailsContainer: CustomerDetailsContainer;

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

	constructor(private _appContext: AppContext,
		private _countriesService: CountriesService,
		private _eagerPriceProductsService: EagerPriceProductsService,
		private _priceProductsModalService: PriceProductsModalService,
		private _customersService: CustomersService,
		private _hotelAggregatorService: HotelAggregatorService,
		private _eagerAllotmentsService: EagerAllotmentsService) {
		super();
		var custDetailsFactory = new CustomerDetailsFactory();
		this.custDetailsMetaList = custDetailsFactory.getCustomerDetailsMetaList();
	}
	public ngAfterViewInit() {
		setTimeout(() => {
			this.customerDetailsContainer = new CustomerDetailsContainer(this._corporateCustomerDetailsComponent, this._individualCustDetailsComponent);
			this._didInit = true;
			this.initializeDependentData();
		});
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
			this._eagerPriceProductsService.getPriceProducts(PriceProductStatus.Active, this._customerVM.customer.priceProductDetails.priceProductIdList),
			this._eagerAllotmentsService.getAllotments(AllotmentStatus.Active, this._customerVM.customer.priceProductDetails.priceProductIdList),
			this._countriesService.getCountriesDO(),
			this._hotelAggregatorService.getHotelAggregatedInfo()
		).subscribe((result: [PriceProductsDO, AllotmentsDO, CountriesDO, HotelAggregatedInfo]) => {
			this._customerVM.priceProductList = result[0].priceProductList;
			this._customerVM.allotmentList = result[1].allotmentList;
			this.customerDetailsContainer.initializeFrom(this._customerVM.customer);

			this._individualCustDetailsComponent.countriesDO = result[2];
			this._corporateCustomerDetailsComponent.countriesDO = result[2];
			this._corporateCustomerDetailsComponent.currency = result[3].ccy;

			this.isLoading = false;
			this.didSubmit = false;
		});
	}

	public didChangeCustomerType(customerTypeStr: string) {
		var customerType: CustomerType = parseInt(customerTypeStr);
		this.customerVM.customer.type = customerType;
	}
	public isIndividualCustomer(): boolean {
		return this.customerVM.customer.type === CustomerType.Individual;
	}
	public isCorporateCustomer(): boolean {
		return this.customerVM.customer.type === CustomerType.Company || this.customerVM.customer.type === CustomerType.TravelAgency;
	}

	public removePriceProduct(priceProductToRemove: PriceProductDO) {
		this._customerVM.priceProductList = _.filter(this._customerVM.priceProductList, (priceProduct: PriceProductDO) => { return priceProduct.id !== priceProductToRemove.id });
	}
	public openPriceProductSelectModal() {
		this._priceProductsModalService.openPriceProductsModal(PriceProductStatus.Active).then((modalDialogRef: ModalDialogRef<PriceProductDO[]>) => {
			modalDialogRef.resultObservable.subscribe((selectedPriceProductList: PriceProductDO[]) => {
				_.forEach(selectedPriceProductList, (selectedPriceProduct: PriceProductDO) => {
					this.addPriceProductIfNotExists(selectedPriceProduct);
				});
			});
		}).catch((e: any) => { });
	}
	private addPriceProductIfNotExists(priceProduct: PriceProductDO) {
		var foundPriceProduct = _.find(this._customerVM.priceProductList, (existingPriceProduct: PriceProductDO) => { return existingPriceProduct.id === priceProduct.id });
		if (!foundPriceProduct) {
			this._customerVM.priceProductList.push(priceProduct);
		}
	}

	public didChangeFileAttachmentList(fileAttachmentList: FileAttachmentDO[]) {
		this._customerVM.customer.fileAttachmentList = fileAttachmentList;
	}

	public get allowPublicPriceProducts(): boolean {
		return this.customerVM.customer.priceProductDetails.allowPublicPriceProducts;
	}
	public set allowPublicPriceProducts(allowPublicPriceProducts: boolean) {
		this.customerVM.customer.priceProductDetails.allowPublicPriceProducts = allowPublicPriceProducts;
	}

	public get corporateDetails(): CorporateDetailsDO {
		if (!this.customerDetailsContainer) {
			return null;
		}
		return this.customerDetailsContainer.corporateDetailsDO;
	}
	public get individualDetails(): IndividualDetailsDO {
		if (!this.customerDetailsContainer) {
			return null;
		}
		return this.customerDetailsContainer.individualDetailsDO;
	}

	public saveCustomer() {
		this.didSubmit = true;
		if (!this.customerDetailsContainer.isValid(this.customerVM.customer)) {
			var errorMessage = this._appContext.thTranslation.translate("Please complete all the required fields");
			this._appContext.toaster.error(errorMessage);
			return;
		}
		var customer = this._customerVM.customer;
		customer.priceProductDetails.priceProductIdList = _.map(this._customerVM.priceProductList, (priceProduct: PriceProductDO) => { return priceProduct.id });
		this.customerDetailsContainer.updateCustomerDetailsOn(customer);

		this.isSavingCustomer = true;
		this._customersService.saveCustomerDO(customer).subscribe((updatedCustomer: CustomerDO) => {
			this.isSavingCustomer = false;
			this.showViewScreen();
		}, (error: ThError) => {
			this.isSavingCustomer = false;
			this._appContext.toaster.error(error.message);
		});
	}
}