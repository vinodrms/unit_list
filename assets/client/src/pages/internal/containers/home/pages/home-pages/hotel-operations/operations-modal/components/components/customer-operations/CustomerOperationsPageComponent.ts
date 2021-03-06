import { Component, OnInit, Input } from '@angular/core';
import { CustomScroll } from '../../../../../../../../../../../common/utils/directives/CustomScroll';
import { ThError, AppContext } from '../../../../../../../../../../../common/utils/AppContext';
import { HotelCustomerOperationsPageParam } from './utils/HotelCustomerOperationsPageParam';
import { CustomerOperationsPageService } from './services/CustomerOperationsPageService';
import { CustomerOperationsPageData } from './services/utils/CustomerOperationsPageData';
import { CustomerVM } from '../../../../../../../../../services/customers/view-models/CustomerVM';
import { CustomerDO } from '../../../../../../../../../services/customers/data-objects/CustomerDO';
import { HotelOperationsPageControllerService } from '../../services/HotelOperationsPageControllerService';

@Component({
    selector: 'customer-operations-page',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/customer-operations/template/customer-operations-page.html',
    providers: [CustomerOperationsPageService]
})
export class CustomerOperationsPageComponent implements OnInit {
    @Input() customerOperationsPageParam: HotelCustomerOperationsPageParam;

    isLoading: boolean;
    didInitOnce: boolean = false;
    totalBookingsCount: number;
    totalInvoiceGroupsCount: number;

    customerOperationsPageData: CustomerOperationsPageData;
    showBookingHistory: boolean = true;

    constructor(private context: AppContext,
        private custOpPageService: CustomerOperationsPageService,
        private operationsPageControllerService: HotelOperationsPageControllerService) { }

    ngOnInit() {
        this.loadPageData();
        this.context.analytics.logPageView("/operations/customer");
    }
    private loadPageData() {
        this.isLoading = true;
        this.custOpPageService.getPageData(this.customerOperationsPageParam).subscribe((pageData: CustomerOperationsPageData) => {
            this.customerOperationsPageData = pageData;
            this.isLoading = false;
            this.didInitOnce = true;
            this.updateContainerData();
        }, (err: ThError) => {
            this.context.toaster.error(err.message);
            this.isLoading = false;
        });
    }
    private updateContainerData() {
        var title = this.customerOperationsPageData.customerVM.customerNameString;
        var subtitle = this.customerOperationsPageData.customerVM.customerTypeString;
        this.customerOperationsPageParam.updateTitle(title, subtitle);
    }

    public get customerVM(): CustomerVM {
        return this.customerOperationsPageData.customerVM;
    }

    public didChangeCustomer(customer: CustomerDO) {
        this.customerOperationsPageData.customerVM.customer = customer;
        this.customerOperationsPageData = this.customerOperationsPageData.buildPrototype();
        this.updateContainerData();
    }

    public createInvoice() {
        var title = this.context.thTranslation.translate("New Invoice");
        var content = this.context.thTranslation.translate("Are you sure you want to create a new invoice for %customer%?",
            { customer: this.customerOperationsPageData.customerVM.customerNameString });
        this.context.modalService.confirm(title, content, {
            positive: this.context.thTranslation.translate("Yes"),
            negative: this.context.thTranslation.translate("No")
        }, () => {
            this.operationsPageControllerService.goToInvoice(null, this.customerVM.customer.id);
        }, () => { });
    }
}
