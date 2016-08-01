import {Component, OnInit, Input} from '@angular/core';
import {TranslationPipe} from '../../../../../../../../../../../common/utils/localization/TranslationPipe';
import {LoadingComponent} from '../../../../../../../../../../../common/utils/components/LoadingComponent';
import {CustomScroll} from '../../../../../../../../../../../common/utils/directives/CustomScroll';
import {ThError, AppContext} from '../../../../../../../../../../../common/utils/AppContext';
import {HotelCustomerOperationsPageParam} from './utils/HotelCustomerOperationsPageParam';
import {CustomerOperationsPageService} from './services/CustomerOperationsPageService';
import {CustomerOperationsPageData} from './services/utils/CustomerOperationsPageData';
import {CustomerVM} from '../../../../../../../../../services/customers/view-models/CustomerVM';
import {CustomerPreviewComponent} from '../../../../../../../../common/inventory/customer-register/pages/customer-preview/CustomerPreviewComponent';

@Component({
    selector: 'customer-operations-page',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/customer-operations/template/customer-operations-page.html',
    directives: [LoadingComponent, CustomScroll, CustomerPreviewComponent],
    providers: [CustomerOperationsPageService],
    pipes: [TranslationPipe]
})
export class CustomerOperationsPageComponent implements OnInit {
    @Input() customerOperationsPageParam: HotelCustomerOperationsPageParam;

    isLoading: boolean;
    didInitOnce: boolean = false;

    customerOperationsPageData: CustomerOperationsPageData;

    constructor(private _appContext: AppContext,
        private _custOpPageService: CustomerOperationsPageService) { }

    ngOnInit() {
        this.loadPageData();
    }
    private loadPageData() {
        this.isLoading = true;
        this._custOpPageService.getPageData(this.customerOperationsPageParam).subscribe((pageData: CustomerOperationsPageData) => {
            this.customerOperationsPageData = pageData;
            this.isLoading = false;
            this.didInitOnce = true;
            this.updateContainerData();
        }, (err: ThError) => {
            this._appContext.toaster.error(err.message);
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
}