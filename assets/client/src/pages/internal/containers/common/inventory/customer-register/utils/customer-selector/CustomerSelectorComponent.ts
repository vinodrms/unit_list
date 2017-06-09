import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit, Type, ResolvedReflectiveProvider, ViewContainerRef } from '@angular/core';
import { BaseComponent } from "../../../../../../../../common/base/BaseComponent";
import { CustomerDO } from "../../../../../../services/customers/data-objects/CustomerDO";
import { AppContext } from "../../../../../../../../common/utils/AppContext";
import { CustomerRegisterModalService } from "../../modal/services/CustomerRegisterModalService";
import { ModalDialogRef } from "../../../../../../../../common/utils/modals/utils/ModalDialogRef";

@Component({
	selector: 'customer-selector',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/customer-register/utils/customer-selector/template/customer-selector.html',
    providers: [CustomerRegisterModalService],
    
})
export class CustomerSelectorComponent extends BaseComponent {
    public static MaxCustomers = 10;

    customerMap: { [index: string]: CustomerDO };
    customerIdList: string[] = [];
    
    @Output() onCustomerAdded = new EventEmitter();
    @Output() onCustomerRemoved = new EventEmitter();
    
    constructor(
        private _customerRegisterModalService: CustomerRegisterModalService
        ) {
        super();
        
        this.customerIdList = [];
        this.customerMap = {};
    }

    public openCustomerSelectModal() {
        this._customerRegisterModalService.openCustomerRegisterModal(true).then((modalDialogInstance: ModalDialogRef<CustomerDO[]>) => {
            modalDialogInstance.resultObservable.subscribe((selectedCustomerList: CustomerDO[]) => {
                _.forEach(selectedCustomerList, customer => {
                    this.customerIdList.push(customer.id);
                    this.customerMap[customer.id] = customer;

                    this.onCustomerAdded.next(customer);
                });
                this.customerIdList = _.uniq(this.customerIdList);
            });
        }).catch((e: any) => { });
    }
    public getNameForCustomer(customerId: string): string {
        return this.customerMap[customerId].customerNameAndEmailString;
    }
    public removeCustomer(customerId: string) {
        this.customerIdList = _.filter(this.customerIdList, existingId => { return existingId != customerId; });
        
        let reomovedCustomer = this.customerMap[customerId];
        delete this.customerMap[customerId];

        this.onCustomerRemoved.next(reomovedCustomer);
    }
    private canAddMoreCustomers(): boolean {
        return this.customerIdList.length < CustomerSelectorComponent.MaxCustomers;
    }
}

