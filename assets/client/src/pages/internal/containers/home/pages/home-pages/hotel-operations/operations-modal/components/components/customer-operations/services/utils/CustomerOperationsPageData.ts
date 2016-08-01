import {CustomerVM} from '../../../../../../../../../../../services/customers/view-models/CustomerVM';

export class CustomerOperationsPageData {
    private _customerVM: CustomerVM;
    public get customerVM(): CustomerVM {
        return this._customerVM;
    }
    public set customerVM(customerVM: CustomerVM) {
        this._customerVM = customerVM;
    }

    public buildPrototype(): CustomerOperationsPageData {
        var pageData = new CustomerOperationsPageData();
        var customerVM = new CustomerVM();
        customerVM.customer = this.customerVM.customer;
        customerVM.priceProductList = this.customerVM.priceProductList;
        customerVM.allotmentList = this.customerVM.allotmentList;
        pageData.customerVM = customerVM;
        return pageData;
    }
}