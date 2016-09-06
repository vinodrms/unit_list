import {Component, OnInit, Input} from '@angular/core';
import {AppContext} from '../../../../../../../../common/utils/AppContext';
import {CustomerVM} from '../../../../../../services/customers/view-models/CustomerVM';
import {PriceProductDO} from '../../../../../../services/price-products/data-objects/PriceProductDO';

@Component({
    selector: 'customer-preview',
    templateUrl: '/client/src/pages/internal/containers/common/inventory/customer-register/pages/customer-preview/template/customer-preview.html'
})
export class CustomerPreviewComponent implements OnInit {
    private _didInit: boolean = false;

    private _customerVM: CustomerVM;
    public get customerVM(): CustomerVM {
        return this._customerVM;
    }
    @Input()
    public set customerVM(customerVM: CustomerVM) {
        this._customerVM = customerVM;
        this.loadDependentData();
    }

    confidPPNames: string = "";

    constructor(private _appContext: AppContext) { }

    ngOnInit() {
        this._didInit = true;
        this.loadDependentData();
    }

    private loadDependentData() {
        if (!this._didInit || this._appContext.thUtils.isUndefinedOrNull(this._customerVM)) { return };
        this.buildConfidentialPriceProductsName();
        this._customerVM.phoneString
    }
    private buildConfidentialPriceProductsName() {
        this.confidPPNames = "";
        _.forEach(this._customerVM.priceProductList, (priceProduct: PriceProductDO) => {
            if (this.confidPPNames.length > 0) {
                this.confidPPNames += ", ";
            }
            this.confidPPNames += priceProduct.name;
        });
        if (this.confidPPNames.length == 0) {
            this.confidPPNames = "n/a";
        }
    }

    public get availabilityString(): string {
        if (this.customerVM.customer.priceProductDetails.allowPublicPriceProducts) {
            return "Allow Public Price Products";
        }
        return "Only Confidential Price Products";
    }

    public get hasPhone(): boolean {
        return !this._appContext.thUtils.isUndefinedOrNull(this._customerVM.phoneString) && this._customerVM.phoneString.length > 0;
    }
    public get hasEmail(): boolean {
        return !this._appContext.thUtils.isUndefinedOrNull(this._customerVM.emailString) && this._customerVM.emailString.length > 0;
    }
}