import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {TranslationPipe} from '../../../../../../../../../../../../../common/utils/localization/TranslationPipe';
import {AppContext, ThError} from '../../../../../../../../../../../../../common/utils/AppContext';
import {InvoicePayerComponent} from '../invoice-payer/InvoicePayerComponent';
import {ThButtonComponent} from '../../../../../../../../../../../../../common/utils/components/ThButtonComponent';
import {AddOnProductsModalService} from '../../../../../../../../../../common/inventory/add-on-products/modal/services/AddOnProductsModalService';
import {AddOnProductDO} from '../../../../../../../../../../../services/add-on-products/data-objects/AddOnProductDO';
import {ModalDialogRef} from '../../../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {CustomerRegisterModalService} from '../../../../../../../../../../common/inventory/customer-register/modal/services/CustomerRegisterModalService';
import {CustomerDO} from '../../../../../../../../../../../services/customers/data-objects/CustomerDO';

@Component({
    selector: 'invoice-edit',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/invoice-operations/components/invoice-edit/template/invoice-edit.html',
    directives: [InvoicePayerComponent, ThButtonComponent],
    providers: [AddOnProductsModalService, CustomerRegisterModalService],
    pipes: [TranslationPipe]
})
export class InvoiceEditComponent {

    constructor(private _addOnProductsModalService: AddOnProductsModalService,
        private _customerRegisterModalService: CustomerRegisterModalService) {
	}

    public openAddOnProductSelectModal() {
		this._addOnProductsModalService.openAddOnProductsModal().then((modalDialogInstance: ModalDialogRef<AddOnProductDO[]>) => {
			modalDialogInstance.resultObservable.subscribe((selectedAddOnProductList: AddOnProductDO[]) => {
				_.forEach(selectedAddOnProductList, (aop: AddOnProductDO) => {
					
				});
			});
		}).catch((e: any) => { });
	}

    public openCustomerSelectModal() {
        this._customerRegisterModalService.openCustomerRegisterModal(false).then((modalDialogInstance: ModalDialogRef<CustomerDO[]>) => {
            modalDialogInstance.resultObservable.subscribe((selectedCustomerList: CustomerDO[]) => {
                
            });
        }).catch((e: any) => { });
    }
}