import {CustomerVM} from '../../../../../../../../../../../services/customers/view-models/CustomerVM';

export class CustomerOperationsPageData {
    private _customerVM: CustomerVM;
    public get customerVM(): CustomerVM {
        return this._customerVM;
    }
    public set customerVM(customerVM: CustomerVM) {
        this._customerVM = customerVM;
    }
}